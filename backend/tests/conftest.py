import warnings
import os
import sys

import pytest
from asgi_lifespan import LifespanManager

from fastapi import FastAPI
from httpx import AsyncClient
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from db.connection import get_session, get_db_url

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)


# Apply migrations at beginning and end of testing session
@pytest.fixture(scope="session")
def apply_migrations():
    warnings.filterwarnings("ignore", category=DeprecationWarning)
    os.environ["TESTING"] = "1"
    config = Config("alembic.ini")
    command.upgrade(config, "head")


# Create a new application for testing
@pytest.fixture
def app(apply_migrations: None) -> FastAPI:
    from core.config import app
    return app


# Grab a reference to our database when needed
@pytest.fixture
def session(app: FastAPI) -> FastAPI:
    engine = create_engine(get_db_url())
    TestingSessionLocal = sessionmaker(autocommit=False,
                                       autoflush=False,
                                       bind=engine)

    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_session] = override_get_db
    return app


# Make requests in our tests
@pytest.fixture
async def client(session: FastAPI) -> AsyncClient:
    async with LifespanManager(session):
        async with AsyncClient(app=session,
                               base_url="http://testserver",
                               headers={"Content-Type":
                                        "application/json"}) as client:
            yield client
