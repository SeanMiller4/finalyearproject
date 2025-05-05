import pandas as pd
from prophet import Prophet
import sys
import json

def extract_keywords_from_csv(item):
    return item.strip().title() if isinstance(item, str) else 'Unknown'

def prepare_data():
    try:
        df = pd.read_csv("c:/users/admin/finalyearproject/python-scripts/csvforfyp.csv")
        df.columns = df.columns.str.strip().str.lower()

        required_columns = ['item purchased', 'purchase amount (usd)', 'date purchase']
        if not all(column in df.columns for column in required_columns):
            return None

        df['subcategory'] = df['item purchased'].apply(extract_keywords_from_csv)
        df['category'] = 'Clothing'

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

        return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(12).to_dict('records')

    except Exception as e:
        print(f"Error in train_prophet: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    command = sys.argv[1].lower() if len(sys.argv) > 1 else None

    df = prepare_data()
    if df is None:
        result = {"error": "Failed to prepare data"}
    elif command == "subcategories":
        subcategories = sorted(df['subcategory'].dropna().unique().tolist()) 
        result = subcategories if subcategories else {"error": "No subcategories found."}        
    elif command in ["overall"]:
        result = train_prophet(df)
    elif command:
        subcategory_df = df[df['subcategory'].str.lower() == command]
        result = train_prophet(subcategory_df)
    else:
        result = {"error": "Invalid command"}

    print(json.dumps(result, indent=4))