from pydantic import Field
from typing import Optional
import requests as r
from fastapi import HTTPException
from fastapi_auth0 import Auth0, Auth0User
from os import environ, path
from db import crud_user
from db.models import UserRole

AUTH0_DOMAIN = environ['AUTH0_DOMAIN']
AUTH0_CLIENT_ID = environ['AUTH0_CLIENT_ID']
AUTH0_SECRET = environ['AUTH0_SECRET']
AUTH0_AUDIENCE = environ['AUTH0_AUDIENCE']
TOKEN_TMP = "./tmp/token.txt"


class CustomAuth0User(Auth0User):
    email: Optional[str] = Field(None, alias='grand-type')


auth = Auth0(domain=AUTH0_DOMAIN,
             api_audience="ipd-backend",
             auth0user_model=CustomAuth0User,
             scopes={'read:email': 'test'})


def get_new_token():
    data = {
        "client_id": AUTH0_CLIENT_ID,
        "client_secret": AUTH0_SECRET,
        "audience": AUTH0_AUDIENCE,
        "grant_type": "client_credentials"
    }
    res = r.post(f"https://{AUTH0_DOMAIN}/oauth/token", data=data)
    res = res.json()
    return res['access_token']


def validate_user_by_id(USER_ID, session):
    access_token = None
    if path.exists(TOKEN_TMP):
        with open(TOKEN_TMP, 'r') as access:
            access_token = access.read()
    if not access_token:
        access_token = get_new_token()
        with open(TOKEN_TMP, 'w') as access:
            access.write(access_token)
    user = r.get(f"https://idh-ipd.eu.auth0.com/api/v2/users/{USER_ID}",
                 headers={"Authorization": "Bearer {}".format(access_token)})
    if user.status_code == 200:
        user = user.json()
        user = crud_user.get_user_by_email(session=session,
                                           email=user["email"])
        return user
    if user.status_code == 401:
        access_token = get_new_token()
        with open(TOKEN_TMP, 'w') as access:
            access.write(access_token)
        return validate_user_by_id(USER_ID, session)
    return False


def verify(email: str, session):
    user = crud_user.get_user_by_email(session=session, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="Forbidden")
    if user.role != UserRole.admin:
        raise HTTPException(
            status_code=403,
            detail="You don't have data access, please contact admin")
    return user
