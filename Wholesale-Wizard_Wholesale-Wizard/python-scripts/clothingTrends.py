from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import datetime
import json

def scrape_trends():
    chrome_options = Options()
    chrome_options.add_argument("--headless")  
    
    driver = webdriver.Chrome(service=Service(), options=chrome_options)
    trends = []

    try:
        driver.get("https://www.vogue.com/fashion/trends")
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "summary-item__hed-link"))
        )

        trend_elements = driver.find_elements(By.CLASS_NAME, "summary-item__hed-link")

        for trend in trend_elements:
            trend_text = trend.text.strip() 
            trend_url = trend.get_attribute("href")  
            trends.append({"text": trend_text, "url": trend_url})

    except Exception as e:
        print(f"Error while scraping trends: {e}")
    finally:
        driver.quit() 

    return trends

def get_current_season():
    month = datetime.datetime.now().month
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Spring"
    elif month in [6, 7, 8]:
        return "Summer"
    else:
        return "Autumn"

def main():
    try:
        trends = scrape_trends()
        season = get_current_season()

        output = {
            "season": season,
            "trends": trends
        }

        print(json.dumps(output))

    except Exception as e:
        print(f"Error in main function: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()