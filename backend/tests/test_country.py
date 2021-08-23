import sys
import pytest
from httpx import AsyncClient
from fastapi import FastAPI
import pandas as pd

# decorate all tests with @pytest.mark.asyncio
pytestmark = pytest.mark.asyncio
sys.path.append("..")

df = pd.read_json('./data/country_list.json')
df = pd.DataFrame(df)
df = df.dropna(subset=['name'])
df = df.drop_duplicates(subset=['name'])
df = df.drop_duplicates(subset=['code'])


class TestCountryRoutes:
    @pytest.mark.asyncio
    async def test_country_get_all(self, app: FastAPI,
                                   client: AsyncClient) -> None:
        res = await client.get(app.url_path_for("country:get-all"))
        assert res.status_code == 200
        res = res.json()
        assert len(res) == df.shape[0]

    @pytest.mark.asyncio
    async def test_country_get_by_id(self, app: FastAPI,
                                     client: AsyncClient) -> None:
        res = await client.get(app.url_path_for("country:get-by-id", id=1))
        assert res.status_code == 200
        res = res.json()
        source = df[df["name"] == res["name"]]
        assert res["code"] == str(int(source["code"][0]))
