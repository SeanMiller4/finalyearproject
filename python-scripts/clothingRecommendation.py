import time
import sys
import json
import inflect
from pytrends.request import TrendReq
import warnings
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pandas as pd

GOOGLE_MAPS_API_KEY = "AIzaSyAuWC2auTkyqnJp6RXCyrpfdh5LlTCqHyo"

ANCHOR = "clothing"

warnings.filterwarnings("ignore", category=FutureWarning)

# initialize the inflect engine for normalization, (groups same words that end in "s", lowers caps, etc.)
p = inflect.engine()

def normalize_keyword(keyword):
    keyword = keyword.lower()
    singular = p.singular_noun(keyword)
    return singular if singular else keyword


# pytrends for returning trending google popularity.

pytrends = TrendReq(hl='en-GB', tz=360)

def batch_with_anchor(keywords, batch_size=5):
    payload_size = batch_size - 1
    for i in range(0, len(keywords), payload_size):
        batch = keywords[i:i + payload_size]
        yield [ANCHOR] + batch

def get_trending_data_batch(batch, max_retries=5):
    retries = 0
    delay = 2
    while retries < max_retries:
        try:
            pytrends.build_payload(batch, cat=0, timeframe='now 7-d', geo='IE')
            trend_data = pytrends.interest_over_time()
            if trend_data.empty:
                return {}
            means = {kw: trend_data[kw].mean() for kw in batch}
            anchor_mean = means.get(ANCHOR)
            if not anchor_mean:
                return {}
            return {
                kw: round((means[kw] / anchor_mean) * 100, 1)
                for kw in batch
                if kw != ANCHOR
            }
        except Exception as e:
            if "429" in str(e):
                time.sleep(delay)
                delay *= 2
                retries += 1
            else:
                print(f"Error in batch {batch}: {e}", file=sys.stderr)
                return {}
    return {}

def get_trending_data_for_keywords(keywords):
    trending_data = {}
    for batch in batch_with_anchor(keywords, batch_size=5):
        batch_data = get_trending_data_batch(batch)
        trending_data.update(batch_data)
        time.sleep(10) 
    return trending_data

# selenium functions for web navigation and beautifulsoup parsing.

DISALLOWED_SUBCATEGORIES = {
    "THE NEW", "ZARA HAIR", "SPECIAL PRICES", "HOME", "SKI COLLECTION",
    "ZARA PRE-OWNED", "SALE", "GIFT CARD", "JOIN LIFE", "+ INFO", "CAREERS", "STORES",
    "HOLIDAY MOOD", "EVENTS", "ZARA STREAMING", "HOME", "GIFTS", "BASICS", "SPECIAL EDITION", "DRESSES"
}

def get_woman_subcategories():
    url = "https://www.zara.com/ie/"
    
    options = Options()
    # options.add_argument("--headless")
    options.add_argument("--window-size=1280,800")
    options.add_argument("--log-level=3")
    driver = webdriver.Chrome(options=options)
    wait = WebDriverWait(driver, 20)
    
    driver.get(url)
    
    time.sleep(5);

    menu_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[data-qa-id='layout-header-toggle-menu']")))
    driver.execute_script("arguments[0].click();", menu_button)

    wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".layout-categories")))

    
    try:
        woman_link = wait.until(
            EC.element_to_be_clickable(
                (By.XPATH, "//li[contains(@class, 'layout-categories__container-item--level-1')]//span[text()='WOMAN']/ancestor::a")
            )
        )
        driver.execute_script("arguments[0].click();", woman_link)
        time.sleep(1.5)
        
        carousel_items = driver.find_elements(By.CSS_SELECTOR, "div.zds-carousel-item.layout-categories__carousel-item")
        active_html = None
        for item in carousel_items:
            if item.is_displayed():
                active_html = item.get_attribute("outerHTML")
                break
        if not active_html:
            driver.quit()
            return []
        else:
            subcats = extract_level2_subcategories(active_html)
    except Exception as e:
        driver.quit()
        return []
    
    driver.quit()
    return subcats

def extract_level2_subcategories(carousel_html):
    subcategories = []
    soup = BeautifulSoup(carousel_html, "html.parser")
    li_elements = soup.find_all("li", class_=lambda x: x and "layout-categories-category--level-2" in x)
    for li in li_elements:
        a_tag = li.find("a", class_="layout-categories-category__link")
        if a_tag:
            name_span = a_tag.find("span", class_="layout-categories-category__name")
            if name_span:
                name = name_span.get_text(strip=True)
                if name not in DISALLOWED_SUBCATEGORIES:
                    parts = name.split(" | ")
                    subcategories.extend([part.strip() for part in parts])
    return subcategories

# finding retailers based on google ratings and google places api.
def get_coordinates(city):
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": city, "key": GOOGLE_MAPS_API_KEY}
    response = requests.get(url, params=params)
    data = response.json()
    if "results" in data and data["results"]:
        location = data["results"][0]["geometry"]["location"]
        return location["lat"], location["lng"]
    return None, None

def find_retailers(product, city):
    lat, lng = get_coordinates(city)
    if lat is None or lng is None:
        return {"error": "Invalid city name"}
    query = f"{product} store"
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "key": GOOGLE_MAPS_API_KEY,
        "location": f"{lat},{lng}",
        "radius": 10000,
        "keyword": query
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    retailers = []
    for place in data["results"]:
        retailers.append({
            "name": place["name"],
            "address": place.get("vicinity", "No address available"),
            "rating": place.get("rating", 0),
            "popularity": place.get("user_ratings_total", 0),
            "lat": place["geometry"]["location"]["lat"],
            "lng": place["geometry"]["location"]["lng"]
       })
    retailers.sort(key=lambda x: (x["rating"], x["popularity"]), reverse=True)
    return retailers[:5]
    
def extract_keywords_from_csv(column_name):
    df = pd.read_csv("c:/users/admin/finalyearproject/python-scripts/csvforfyp.csv")
    all_items = df[column_name].dropna().astype(str).tolist()
    keywords = set()
    for item in all_items:
        clean_item = item.strip().title()
        keywords.add(clean_item)
    return list(keywords)

def main():
    if len(sys.argv) == 1:
        zara_keywords = get_woman_subcategories()
        
        csv_keywords = extract_keywords_from_csv("Item Purchased")
        
        csv_trending = get_trending_data_for_keywords(csv_keywords)
        zara_trending = get_trending_data_for_keywords(zara_keywords)
        
        csv_normalized = {normalize_keyword(item): item for item in csv_keywords}
        zara_normalized = {normalize_keyword(item): item for item in zara_keywords}
        
        overlap_keys = set(csv_normalized.keys()) & set(zara_normalized.keys())
        csv_only_keys = set(csv_normalized.keys()) - overlap_keys
        zara_only_keys = set(zara_normalized.keys()) - overlap_keys
        
        common_items = [csv_normalized[norm] for norm in overlap_keys]
        common_trending = get_trending_data_for_keywords(common_items)
        
        csv_only_data = {csv_normalized[k]: csv_trending.get(csv_normalized[k], 0) for k in csv_only_keys}
        zara_only_data = {zara_normalized[k]: zara_trending.get(zara_normalized[k], 0) for k in zara_only_keys}
        
        output = {
            "Items_You_Sell_That_Zara_Sells": common_trending,
            "Items_You_Sell_Only": csv_only_data,
            "Zara_Only_Items": zara_only_data
        }
        print(json.dumps(output, indent=2))
        sys.exit(0)
        
    elif len(sys.argv) == 3:
        product = sys.argv[1]
        city = sys.argv[2]
        retailers = find_retailers(product, city)
        if isinstance(retailers, dict) and "error" in retailers:
            print(json.dumps(retailers), file=sys.stderr)
            sys.exit(1)
        output = {
            "recommended_product": product,
            "city": city,
            "recommended_stores": retailers
        }
        print(json.dumps(output))
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == '__main__':
    main()