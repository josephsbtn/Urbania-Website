import pickle
import os
import pandas as pd

ELEC_MODEL_PATH = os.path.join("saved_models", "electricity.pkl")
WATER_MODEL_PATH = os.path.join("saved_models", "water.pkl")

with open(ELEC_MODEL_PATH, "rb") as f:
    elec_model = pickle.load(f)

with open(WATER_MODEL_PATH, "rb") as f:
    water_model = pickle.load(f)

def forecast_electricity():
    forecast_results = elec_model.forecast(steps=48)
    
    time_index = pd.date_range(start='2024-01-03 00:00:00', periods=48, freq='30T')
    forecast_series = pd.Series(forecast_results.values, index=time_index)
    
    avg_forecast_30min = forecast_series.resample('30T').mean().mean()
    avg_forecast_1hr = forecast_series.resample('H').mean().mean()
    avg_forecast_3hr = forecast_series.resample('3H').mean().mean()
    
    return {
        "electricity_forecast": {
            "30_menit": round(avg_forecast_30min, 2),
            "1_jam": round(avg_forecast_1hr, 2),
            "3_jam": round(avg_forecast_3hr, 2)
        }
    }

def forecast_water():
    forecast_results = water_model.forecast(steps=3)
    return {
        "water_forecast": {
            "1_year_ahead": round(forecast_results.iloc[0], 2),
            "3_years_ahead": round(forecast_results.iloc[2], 2),
        }
    }