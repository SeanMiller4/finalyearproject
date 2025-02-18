import pandas as pd
from prophet import Prophet
import sys
import json

CATEGORY_MAPPING = {
    'Clothing': ['T-shirt', 'Tunic', 'Tank Top', 'Leggings', 'Onesie', 'Jacket', 'Trousers', 'Jeans', 'Trench Coat', 'Pajamas', 'Romper', 'Shorts', 'Blazer', 'Dress', 'Cardigan', 'Camisole', 'Socks', 'Blouse', 'Loafers', 'Slippers', 'Vest', 'Sandals', 'Jumpsuit', 'Raincoat', 'Coat', 'Kimono', 'Skirt', 'Swimsuit', 'Boots', 'Sneakers', 'Sweater'],
    'Accessories': ['Handbag', 'Wallet', 'Bag', 'Hat', 'Bowtie', 'Poncho', 'Gloves', 'Flip-Flops', 'Backpack', 'Scarf', 'Umbrella', 'Sun Hat', 'Belt', 'Sunglasses', 'Tie']
}

def categorize_item(item_name):
    item_name = item_name.lower()
    for category, items in CATEGORY_MAPPING.items():
        for item in items:
            if item.lower() in item_name:
                return category, item
    return 'Other', 'Unknown'

def prepare_data():
    try:
        df = pd.read_csv('Fashion_Retail_Sales.csv')
        df.columns = df.columns.str.strip() 
        df.columns = df.columns.str.lower()  

        required_columns = ['item purchased', 'purchase amount (usd)', 'date purchase']
        if not all(column in df.columns for column in required_columns):
            return None

        df[['category', 'subcategory']] = df['item purchased'].apply(lambda x: pd.Series(categorize_item(x)))

        df = df.rename(columns={'purchase amount (usd)': 'y', 'date purchase': 'ds'})
        df['ds'] = pd.to_datetime(df['ds'], errors='coerce')

        df = df.dropna(subset=['ds', 'y'])

        return df

    except Exception as e:
        print(f"Error in preparing data: {e}", file=sys.stderr)
        return None

def train_prophet(df):
    try:
        if df is None or df.empty:
            return {"error": "No data available for prediction."}

        model = Prophet()
        model.fit(df)

        future = model.make_future_dataframe(periods=12, freq='M')  
        forecast = model.predict(future)

        return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(6).to_dict('records')

    except Exception as e:
        print(f"Error in train_prophet: {e}", file=sys.stderr)
        return {"error": str(e)}

def main():
    try:
        df = prepare_data()
        if df is None:
            print(json.dumps({"error": "Failed to process data"}))
            sys.exit(1)

        overall_predictions = train_prophet(df)
        clothing_predictions = train_prophet(df[df['category'] == 'Clothing'])
        accessories_predictions = train_prophet(df[df['category'] == 'Accessories'])

        output = {
            "overall_predictions": overall_predictions,
            "clothing_predictions": clothing_predictions,
            "accessories_predictions": accessories_predictions
        }

        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"error": f"Error in main function: {e}"}))
        sys.exit(1)

if __name__ == '__main__':
    main()