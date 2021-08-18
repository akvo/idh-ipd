import sys
import pytest
from httpx import AsyncClient
from fastapi import FastAPI
from db.schema import CropBase

# decorate all tests with @pytest.mark.asyncio
pytestmark = pytest.mark.asyncio
sys.path.append("..")


@pytest.fixture
def new_crop():
    return CropBase(name="strawbery")


class TestCropRoutes:
    async def test_crop_get_all(self, app: FastAPI,
                                client: AsyncClient) -> None:
        res = await client.get(app.url_path_for("crop:get-all"))
        assert res.status_code == 200
        data = res.json()
        assert [d['name'] for d in data] == ["Coffee", "Cocoa", "Tea"]
        assert [d['id'] for d in data] == [1, 2, 3]

    async def test_crop_get_by_id(self, app: FastAPI,
                                  client: AsyncClient) -> None:
        res = await client.get(app.url_path_for("crop:get-by-id", id=1))
        assert res.status_code == 200
        assert res.json() == {"id": 1, "name": "Coffee"}

    async def test_routes_should_be_authorize(self, app: FastAPI,
                                              client: AsyncClient) -> None:
        res = await client.post(app.url_path_for("crop:new"), json={})
        assert res.status_code == 403
