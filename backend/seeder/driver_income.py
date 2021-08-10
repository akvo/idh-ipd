import os
import sys
import pandas as pd
from db.connection import SessionLocal, engine
from db import models


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

models.Base.metadata.create_all(bind=engine)
session = SessionLocal()


def get_id(name, model):
    if name != name:
        return None
    data = session.query(model).filter(model.name == name).first()
    if data:
        return data.id
    return None


file = pd.read_csv('./data/prod-driver-income.csv')
df = pd.DataFrame(file)
df['country'] = df['country'].apply(lambda x: get_id(x, models.Country))
df['crop'] = df['crop'].apply(lambda x: get_id(x, models.Crop))
df['status'] = df['status'].str.lower()
df = df.dropna(subset=['country', 'crop'])
df.to_sql('driver_income', con=engine, if_exists='append', index=False)
count = session.query(models.DriverIncome.id).count()
print(f"Added {count} rows")
session.close()
