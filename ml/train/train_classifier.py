import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(BASE_DIR), 'data')
SAVED_MODELS_DIR = os.path.join(os.path.dirname(BASE_DIR), 'saved_models')


os.makedirs(SAVED_MODELS_DIR, exist_ok=True)

def train_and_save_model(data_path, model_name):
    try:
        if 'electricity' in data_path:
            df = pd.read_excel(data_path)
            df.columns = [col.strip().replace(' ', '_') for col in df.columns]
            df = df.rename(columns={'Date': 'Tanggal', 'Total_Generation_MWh': 'Nilai'})
        elif 'water' in data_path:
            df = pd.read_csv(data_path)
            df.columns = [col.strip().replace(' ', '_') for col in df.columns]
            df = df.rename(columns={'Year': 'Tanggal', 'Total_Water_Consumption_ML': 'Nilai'})
        
        df['Tanggal'] = pd.to_datetime(df['Tanggal'])
        df.set_index('Tanggal', inplace=True)
        series = df['Nilai']
        
        model = ARIMA(series, order=(1, 1, 1))
        model_fit = model.fit()
        
        with open(os.path.join(SAVED_MODELS_DIR, f'{model_name}.pkl'), 'wb') as f:
            pickle.dump(model_fit, f)
        
        print(f"Model {model_name} berhasil dilatih dan disimpan.")
    
    except FileNotFoundError:
        print(f"Error: File data {data_path} tidak ditemukan. Mohon sediakan data.")
    except Exception as e:
        print(f"Error saat memproses {data_path}: {e}")
        if 'df' in locals():
            print("Kolom yang ditemukan:", list(df.columns))

train_and_save_model(
    data_path=os.path.join(DATA_DIR, 'electricity', '20250804.xls'),
    model_name='electricity'
)
train_and_save_model(
    data_path=os.path.join(DATA_DIR, 'water', 'WaterSalesAnnual.csv'),
    model_name='water'
)