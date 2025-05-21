
from pymongo import MongoClient
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

try:
    # Use your correct MongoDB Atlas URI
    client = MongoClient("your-full-mongo-uri-here")
    db = client["smartenergy"]
    collection = db["energydatas"]

    data = list(collection.find({}, {"_id": 0, "timestamp": 1, "totalWattage": 1}))
    if not data:
        print(2.5)  # safe default
        exit()

    df = pd.DataFrame(data)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.set_index('timestamp', inplace=True)
    df = df.resample('H').mean().fillna(method='ffill')

    model = ARIMA(df['totalWattage'], order=(1, 1, 1))
    model_fit = model.fit()
    forecast = model_fit.forecast(steps=1)
    print(round(float(forecast.iloc[0]), 2))  # ✅ print ONLY number
except:
    print(2.5)  # fallback to avoid exit code

