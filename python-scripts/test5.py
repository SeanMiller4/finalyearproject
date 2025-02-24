import time
from pytrends.request import TrendReq
import pandas as pd
from prophet import Prophet
import requests
import sys
import json

GOOGLE_MAPS_API_KEY = "AIzaSyAuWC2auTkyqnJp6RXCyrpfdh5LlTCqHyo"

PRODUCT_TO_RETAILER_STORE = {
    'T-shirt': 't-shirt store',
    'Tunic': 'tunic store',
    'Tank Top': 'tank top store',
    'Leggings': 'leggings store',
    'Onesie': 'onesie store',
    'Jacket': 'jacket store',
    'Trousers': 'trouser store',
    'Jeans': 'jeans store',
    'Trench Coat': 'trench coat store',
    'Pajamas': 'pajamas store',
    'Romper': 'romper store',
    'Shorts': 'shorts store',
    'Blazer': 'blazer store',
    'Dress': 'dress boutique',
    'Cardigan': 'cardigan store',
    'Camisole': 'camisole store',
    'Socks': 'sock store',
    'Blouse': 'blouse store',
    'Loafers': 'loafers store',
    'Slippers': 'slippers store',
    'Vest': 'vest store',
    'Sandals': 'sandals store',
    'Jumpsuit': 'jumpsuit store',
    'Raincoat': 'raincoat store',
    'Coat': 'coat store',
    'Kimono': 'kimono store',
    'Skirt': 'skirt store',
    'Swimsuit': 'swimsuit store',
    'Boots': 'boot store',
    'Sneakers': 'sneaker store',
    'Sweater': 'sweater store'
}

pytrends = TrendReq(hl='en-US', tz=360)

def get_trending_data(keyword, max_retries=5):
    retries = 0
    delay = 2 
    while retries < max_retries:
        try:
            pytrends.build_payload([keyword], cat=0, timeframe='now 7-d', geo='', gprop='')
            trend_data = pytrends.interest_over_time()
            if trend_data.empty:
                return None
            return trend_data
        except Exception as e:
            if "429" in str(e):
                print(f"Received 429 for {keyword}. Retrying in {delay} seconds...", file=sys.stderr)
                time.sleep(delay)
                delay *= 2  
                retries += 1
            else:
                print(f"Error getting data for {keyword}: {e}", file=sys.stderr)
                return None
    print(f"Max retries reached for {keyword}. Skipping...", file=sys.stderr)
    return None


def get_top_trending_clothing_items():
    fashion_keywords = [
        'T-shirt', 'Tunic', 'Tank Top', 'Leggings', 'Onesie', 'Jacket',
        'Trousers', 'Jeans', 'Trench Coat', 'Pajamas', 'Romper', 'Shorts',
        'Blazer', 'Dress', 'Cardigan', 'Camisole', 'Socks', 'Blouse',
        'Loafers', 'Slippers', 'Vest', 'Sandals', 'Jumpsuit', 'Raincoat',
        'Coat', 'Kimono', 'Skirt', 'Swimsuit', 'Boots', 'Sneakers', 'Sweater'
    ]
    
    trending_data = {}
    for keyword in fashion_keywords:
        trend = get_trending_data(keyword)
        if trend is not None:
            avg_interest = trend[keyword].mean()  
            trending_data[keyword] = avg_interest
        time.sleep(1.7)
    
    top_trending_items = sorted(trending_data.items(), key=lambda x: x[1], reverse=True)
    return top_trending_items

def get_coordinates(city):
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": city, "key": GOOGLE_MAPS_API_KEY}
    response = requests.get(url, params=params)
    data = response.json()

    if "results" in data and data["results"]:
        location = data["results"][0]["geometry"]["location"]
        return location["lat"], location["lng"]
    return None, None 

def prepare_data():
    try:
        file_path = 'c:/users/admin/finalyearproject/python-scripts/Fashion_Retail_Sales.csv'
        df = pd.read_csv(file_path)
        df.columns = df.columns.str.strip().str.lower()  

        required_columns = ['item purchased', 'date purchase', 'purchase amount (usd)']
        if not all(col in df.columns for col in required_columns):
            return None

        df = df.rename(columns={'date purchase': 'ds', 'purchase amount (usd)': 'y'})
        df['ds'] = pd.to_datetime(df['ds'], errors='coerce')
        df = df.dropna(subset=['ds', 'y'])

        df['category'] = df['item purchased'].str.split('-').str[0].str.strip()

        return df
    except Exception as e:
        print(f"Error preparing data: {e}", file=sys.stderr)
        return None

def find_trending_category(df):
    try:
        if df is None or df.empty:
            return None

        categories = df['category'].unique()
        trend_scores = {}

        for category in categories:
            cat_df = df[df['category'] == category][['ds', 'y']]
            if cat_df.shape[0] < 10: 
                continue

            model = Prophet()
            model.fit(cat_df)
            future = model.make_future_dataframe(periods=12, freq='M')
            forecast = model.predict(future)

            last_actual = cat_df['y'].iloc[-1]
            future_trend = forecast['yhat'].iloc[-1]
            trend_scores[category] = (future_trend - last_actual) / last_actual

        if not trend_scores:
            return None

        trending_category = max(trend_scores, key=trend_scores.get)
        return trending_category
    except Exception as e:
        print(f"Error finding trending category: {e}", file=sys.stderr)
        return None

def find_retailers(product, city):
    lat, lng = get_coordinates(city)
    if lat is None or lng is None:
        return {"error": "Invalid city name"}
    
    query = PRODUCT_TO_RETAILER_QUERY.get(product, f"{product} store")
    
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "key": GOOGLE_MAPS_API_KEY,
        "location": f"{lat},{lng}",
        "radius": 10000,  
        "keyword": query
    }
    response = requests.get(url, params=params)
    data = response.json()

    if "results" in data:
        retailers = []
        for place in data["results"]:
            retailers.append({
                "name": place["name"],
                "address": place.get("vicinity", "No address available"),
                "rating": place.get("rating", "No rating"),
                "popularity": place.get("user_ratings_total", 0),
                "lat": place["geometry"]["location"]["lat"],
                "lng": place["geometry"]["location"]["lng"]
            })
        retailers.sort(key=lambda x: (x["rating"], x["popularity"]), reverse=True)
        return retailers[:5]
    return []

def main():
    if len(sys.argv) == 1:
        top_trending_items = get_top_trending_clothing_items()
        output = {"top_trending_items": top_trending_items}
        print(json.dumps(output))
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
        print(json.dumps({"error": "Usage: script.py OR script.py <product> <city>"}), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()