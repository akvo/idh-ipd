import sys
import jwt
import pytest
from httpx import AsyncClient
from fastapi import FastAPI
from middleware import verify_token
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from db import crud_user

sys.path.append("..")

exp_date = (datetime.now() + timedelta(days=30)).timestamp()
account = {
    "email": "support@akvo.org",
    "name": "Akvo Support",
    "exp": exp_date,
    "email_verified": True
}
token = jwt.encode(account, "secret", algorithm="HS256")
decoded = jwt.decode(token, "secret", algorithms=["HS256"])


class TestAuthorizationSetup:
    def test_token_verification(self):
        assert token != ""
        assert decoded == account
        assert True if verify_token(decoded) else False

    @pytest.mark.asyncio
    async def test_user_get_registered(self, app: FastAPI, session: Session,
                                       client: AsyncClient) -> None:
        res = await client.post(app.url_path_for("user:register"),
                                headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        user = crud_user.get_user_by_id(session=session, id=1)
        res = res.json()
        assert res["email"] == user.email
        assert res["active"] is False
