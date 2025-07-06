# Smart Home Energy Management System;

A web-based application to monitor, analyze, and predict energy usage in a smart home using Node.js, MongoDB, and ARIMA forecasting.

## Project Overview:

This system helps users:
- Track energy usage of household devices
- Store usage data in MongoDB
- Predict future energy consumption using ARIMA model
- View insights via interactive charts
- Manage devices using a simple admin panel

##  Tech Stack Used:

- **Frontend**: HTML, CSS, JavaScript (Chart.js)
- **Backend**: Node.js (Express.js)
- **Database**: MongoDB (local or MongoDB Atlas)
- **ML Forecasting**: Python + ARIMA (statsmodels)
- **Deployment**: Render.com

##  Project Structure:

smart-home-energy-management-system/ ├── smart-energy-frontend/ │   └── index.html ├── smart-energy-backend/ │   ├── server.js │   ├── ml/ │   │   └── predict.py │   ├── requirements.txt │   └── package.json

## How to Run Locally:

1. **Clone the Repo**
   ```bash
   git clone https://github.com/your-username/smart-home-energy-management-system.git
   cd smart-home-energy-management-system

2. Install Backend Dependencies:

cd smart-energy-backend
npm install

3. Setup MongoDB:

Use MongoDB Compass or MongoDB Atlas.

Set your connection URI in server.js or .env.

4. Start Backend:

node server.js

5. Open Frontend Open index.html in your browser.


6. Optional: Run Prediction Script

python ml/predict.py

Forecasting with ARIMA:

This system uses the ARIMA model to predict future energy consumption based on historical usage stored in MongoDB.

> Forecast result is displayed in kilowatt-hours (kWh).
---
 MongoDB Collections Used:

1. energydatas

Stores total energy usage:

{
  "timestamp": "2024-06-01T10:00:00Z",
  "totalWattage": 1325
}

2. devices

Stores device info and status:

{
  "deviceId": "TV-001",
  "label": "Television",
  "wattage": 120,
  "status": "on"
}

Features:

Real-time energy logging

Device-wise energy tracking

ARIMA-based prediction

Charts & dashboards using Chart.js

Deployment ready with MongoDB support


Live Demo:

Deployed on: Render

Author:
Developed by Shaik Naseeroddin
GitHub: @najju2003
Email: naseeroddinshaik03@gmail.com
