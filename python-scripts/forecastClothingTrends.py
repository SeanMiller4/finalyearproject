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
        file_path = 'c:/users/admin/wholesale-wizard_wholesale-wizard/python-scripts/Fashion_Retail_Sales.csv'
        df = pd.read_csv(file_path)
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
        print(f"Error in preparing data: {e}")
        return None

def train_prophet(df):
    try:
        if df is None or df.empty:
            return {"error": "No data available for prediction."}

        model = Prophet()
        model.fit(df)

        future = model.make_future_dataframe(periods=12, freq='M')  
        forecast = model.predict(future)

        forecast['ds'] = forecast['ds'].dt.strftime('%Y-%m-%d %H:%M:%S')

        return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(6).to_dict('records')

    except Exception as e:
        print(f"Error in train_prophet: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    command = sys.argv[1].lower() if len(sys.argv) > 1 else None

    df = prepare_data()
    if command in ["overall", "clothing", "accessories"]:
        if command == "overall":
            result = train_prophet(df)
        else:
            category_df = df[df['category'].str.lower() == command]
            result = train_prophet(category_df)
    elif command:
        subcategory_df = df[df['subcategory'].str.lower() == command]
        if not subcategory_df.empty:
            result = train_prophet(subcategory_df)
        else:
            result = {"error": f"Subcategory '{command}' not found in the data."}
    else:
        result = {"error": "Invalid command"}

    print(json.dumps(result, indent=4))
