import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import pickle
import os
import itertools
from sklearn.metrics import mean_squared_error

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(BASE_DIR), 'data')
SAVED_MODELS_DIR = os.path.join(os.path.dirname(BASE_DIR), 'saved_models')


os.makedirs(SAVED_MODELS_DIR, exist_ok=True)

def train_and_save_model(data_path, model_name):
    try:
        if 'electricity' in data_path:
            df = pd.read_csv(data_path)
            df.columns = df.columns.str.strip()
            df = df.rename(columns={'Date': 'Tanggal', 'Total_Generation_MWh': 'Nilai'})
            df['Tanggal'] = pd.to_datetime(df['Tanggal'])
            df.set_index('Tanggal', inplace=True)
            series = df['Nilai']
        
        elif 'water' in data_path:
            df = pd.read_csv(data_path)
            df.columns = df.columns.str.strip()
            df = df.rename(columns={'Year': 'Tanggal', 'Total_Water_Consumption_ML': 'Nilai'})
            df['Tanggal'] = pd.to_datetime(df['Tanggal'], format='%Y')
            df.set_index('Tanggal', inplace=True)
            series = df['Nilai']
        
        p = d = q = range(0, 3)
        pdq = list(itertools.product(p, d, q))
        best_aic = float("inf")
        best_pdq = None
        best_model = None

        print(f"Mencari parameter ARIMA terbaik untuk {model_name}...")

        for param in pdq:
            try:
                model = ARIMA(series, order=param)
                model_fit = model.fit()
                print(f"ARIMA{param} - AIC:{model_fit.aic}")
                
                if model_fit.aic < best_aic:
                    best_aic = model_fit.aic
                    best_pdq = param
                    best_model = model_fit
            except:
                continue

        print(f"\nParameter terbaik untuk {model_name}: ARIMA{best_pdq} dengan AIC: {best_aic}")

        with open(os.path.join(SAVED_MODELS_DIR, f'{model_name}.pkl'), 'wb') as f:
            pickle.dump(best_model, f)
            
        print(f"Model {model_name} berhasil dilatih dan disimpan.")
    
    except FileNotFoundError:
        print(f"Error: File data {data_path} tidak ditemukan. Mohon sediakan data.")
    except Exception as e:
        print(f"Error saat memproses {data_path}: {e}")
        if 'df' in locals():
            print("Kolom yang ditemukan:", list(df.columns))

train_and_save_model(
    data_path=os.path.join(DATA_DIR, 'electricity', '20250804.csv'),
    model_name='electricity'
)

train_and_save_model(
    data_path=os.path.join(DATA_DIR, 'water', 'WaterSalesAnnual.csv'),
    model_name='water'
)