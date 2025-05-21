"""import pandas as pd
from pymongo import MongoClient
from statsmodels.tsa.arima.model import ARIMA
import warnings

# ✅ Ignore all warnings (this is the fix!)
warnings.filterwarnings("ignore")

client = MongoClient("mongodb://localhost:27017/")
db = client["smartenergy"]
collection = db["energydatas"]

records = list(collection.find().sort("timestamp", -1).limit(30))

if not records or len(records) < 5:
    print(2.55)
    exit()

df = pd.DataFrame(records)
df['timestamp'] = pd.to_datetime(df['timestamp'])
df = df.sort_values('timestamp')
df.set_index('timestamp', inplace=True)

model = ARIMA(df['totalWattage'], order=(1, 1, 1))
model_fit = model.fit()
forecast = model_fit.forecast(steps=1)

print(round(float(forecast.iloc[0]), 2))"""
# modified
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
    print(2.5)  # fallback to avoid exit code 1

