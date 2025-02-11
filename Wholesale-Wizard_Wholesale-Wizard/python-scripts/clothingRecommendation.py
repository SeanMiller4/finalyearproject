from flask import Flask, request, jsonify
import pandas as pd
from prophet import Prophet
import requests

app = Flask(__name__)

GOOGLE_MAPS_API_KEY = "AIzaSyAuWC2auTkyqnJp6RXCyrpfdh5LlTCqHyo"

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
        df = pd.read_csv('Fashion_Retail_Sales.csv')
        df.columns = df.columns.str.strip().str.lower() 

        required_columns = ['item purchased', 'date purchase', 'purchase amount (usd)']
        if not all(col in df.columns for col in required_columns):
            return None

        df = df.rename(columns={'date purchase': 'ds', 'purchase amount (usd)': 'y'})
        df['ds'] = pd.to_datetime(df['ds'], errors='coerce')
        df = df.dropna(subset=['ds', 'y'])
        return df
    except Exception as e:
        print(f"Error preparing data: {e}")
        return None

def train_prophet(df):
    try:
        if df is None or df.empty:
            return None

        model = Prophet()
        model.fit(df)
        future = model.make_future_dataframe(periods=12, freq='M')
        forecast = model.predict(future)

        return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(6)
    except Exception as e:
        print(f"Error in Prophet training: {e}")
        return None

def get_trending_product(df):
    forecast = train_prophet(df)
    if forecast is None:
        return None

    return "shoes"  

def find_retailers(product, city):
    lat, lng = get_coordinates(city)
    if not lat or not lng:
        return {"error": "Invalid city name"}

    search_query = product + " store"  
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

    params = {
        "key": GOOGLE_MAPS_API_KEY,
        "location": f"{lat},{lng}",
        "radius": 10000, 
        "keyword": search_query
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
                "popularity": place.get("user_ratings_total", 0)
            })

        retailers.sort(key=lambda x: (x["rating"], x["popularity"]), reverse=True)
        return retailers[:5]  

    return []

@app.route('/recommend', methods=['GET'])
def recommend_best_retailers():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    df = prepare_data()
    trending_product = get_trending_product(df)
    if not trending_product:
        return jsonify({"error": "No sales trend data available"}), 500

    retailers = find_retailers(trending_product, city)
    return jsonify({
        "trending_product": trending_product,
        "recommended_stores": retailers
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
