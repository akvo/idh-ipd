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


file = pd.read_csv('./data/prod-company.csv')
df = pd.DataFrame(file)
df['country'] = df['country'].apply(lambda x: get_id(x, models.Country))
df['crop'] = df['crop'].apply(lambda x: get_id(x, models.Crop))
df = df.dropna(subset=['name', 'country', 'crop'])
df.to_sql('company', con=engine, if_exists='append', index=False)
results = engine.execute("SELECT count(*) FROM company").fetchall()
print(results.count)
session.close()
