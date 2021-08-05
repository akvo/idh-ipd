import pandas as pd
from db.connection import engine

file = pd.read_json('./data/country_list.json')
df = pd.DataFrame(file)
df = df.dropna(subset=['name'])
df = df.drop_duplicates(subset=['name'])
df = df.drop_duplicates(subset=['code'])
df['code'] = df['code'].astype(int)
df.drop('id', inplace=True, axis=1)
df.to_sql('country',con=engine,if_exists='append',index=False)
print(engine.execute("SELECT * FROM country").fetchall())