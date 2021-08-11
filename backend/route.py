from pydantic import Field
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session

from db import crud_user, crud_country, crud_crop
from db import crud_company, crud_driver_income
from db import models
from db.connection import SessionLocal, engine
from db.schema import UserBase, CountryBase, CropBase
from db.schema import CompanyBase, DriverIncomeBase
from db.schema import CountryCompanyBase
from db.schema import CropCompanyBase
from db.schema import UserAccessBase
from db.models import Company, DriverIncome
from db.models import UserRole, DriverIncomeStatus
import util.params as params
import requests as r
from fastapi_auth0 import Auth0, Auth0User
from os import environ, path

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
             scopes={"read:users": "OK"})

models.Base.metadata.create_all(bind=engine)
routes = APIRouter()


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


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@routes.post("/user/",
             response_model=UserBase,
             summary="add new user",
             tags=["User"],
             dependencies=[Depends(auth.implicit_scheme)])
def add_user(email: str,
             role: UserRole,
             session: Session = Depends(get_session),
             user: CustomAuth0User = Security(auth.get_user)):
    user = validate_user_by_id(user.id, session)
    if not user:
        raise HTTPException(status_code=403, detail="Forbidden")
    if user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Forbidden")
    user = crud_user.add_user(session=session, email=email, role=role)
    return user


@routes.get("/user/",
            response_model=List[UserBase],
            summary="get all users",
            tags=["User"],
            dependencies=[Depends(auth.implicit_scheme)])
def get_user(skip: int = 0,
             limit: int = 100,
             session: Session = Depends(get_session),
             user: CustomAuth0User = Security(auth.get_user)):
    user = validate_user_by_id(user.id, session)
    if not user:
        raise HTTPException(status_code=404, detail="Not Found")
    if user.role != UserRole.admin:
        raise HTTPException(status_code=404, detail="Not Found")
    user = crud_user.get_user(session=session, skip=skip, limit=limit)
    return [i.serialize for i in user]


@routes.get("/user/{id:path}",
            response_model=UserAccessBase,
            summary="get user detail",
            tags=["User"],
            dependencies=[Depends(auth.implicit_scheme)])
def get_user_by_id(id: int,
                   session: Session = Depends(get_session),
                   user: CustomAuth0User = Security(auth.get_user)):
    user = validate_user_by_id(user.id, session)
    if not user:
        raise HTTPException(status_code=404, detail="Not Found")
    if user.role != UserRole.admin:
        raise HTTPException(status_code=404, detail="Not Found")
    user = crud_user.get_user_by_id(session=session, id=id)
    if user is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return user.serialize


@routes.get("/country/",
            response_model=List[CountryBase],
            summary="get all countries",
            tags=["Country"])
def get_country(skip: int = 0,
                limit: int = 100,
                session: Session = Depends(get_session)):
    country = crud_country.get_country(session=session, skip=skip, limit=limit)
    return [i.serialize for i in country]


@routes.get("/country/{id:path}",
            response_model=CountryBase,
            summary="get country detail",
            tags=["Country"])
def get_country_by_id(id: int, session: Session = Depends(get_session)):
    country = crud_country.get_country_by_id(session=session, id=id)
    if country is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return country.serialize


@routes.post("/crop/",
             response_model=CropBase,
             summary="add new crop",
             dependencies=[Depends(auth.implicit_scheme)],
             tags=["Crop"])
def add_crop(name: str,
             session: Session = Depends(get_session),
             user: CustomAuth0User = Security(auth.get_user)):
    user = validate_user_by_id(user.id, session)
    if not user:
        raise HTTPException(status_code=403, detail="Forbidden")
    if user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Forbidden")
    crop = crud_crop.add_crop(session=session, name=name)
    return crop


@routes.get("/crop/",
            response_model=List[CropBase],
            summary="get all crops",
            tags=["Crop"])
def get_crop(skip: int = 0,
             limit: int = 100,
             session: Session = Depends(get_session)):
    crop = crud_crop.get_crop(session=session, skip=skip, limit=limit)
    return [i.serialize for i in crop]


@routes.get("/crop/{id:path}",
            response_model=CropBase,
            summary="get crop detail",
            tags=["Crop"])
def get_crop_by_id(
        id: int,
        session: Session = Depends(get_session),
):
    crop = crud_crop.get_crop_by_id(session=session, id=id)
    if crop is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return crop.serialize


@routes.post("/company/",
             response_model=CompanyBase,
             summary="add new company",
             dependencies=[Depends(auth.implicit_scheme)],
             tags=["Company"])
def add_company(name: str,
                country: int,
                crop: int,
                land_size: float = None,
                price: float = None,
                yields: int = None,
                prod_cost: int = None,
                other_income: int = None,
                living_income: int = None,
                hh_income: int = None,
                net_income: int = None,
                session: Session = Depends(get_session),
                user: CustomAuth0User = Security(auth.get_user)):
    user = validate_user_by_id(user.id, session)
    if not user:
        raise HTTPException(status_code=403, detail="Forbidden")
    if user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Forbidden")
    company = crud_company.add_company(session=session,
                                       data=Company(
                                           name=name,
                                           country=country,
                                           crop=crop,
                                           land_size=land_size,
                                           price=price,
                                           yields=yields,
                                           prod_cost=prod_cost,
                                           other_income=other_income,
                                           living_income=living_income,
                                           net_income=net_income,
                                           hh_income=hh_income))
    return params.with_extra_data(company.serialize)


@routes.get("/company/",
            response_model=List[CompanyBase],
            summary="get all companies",
            dependencies=[Depends(auth.implicit_scheme)],
            tags=["Company"])
def get_company(skip: int = 0,
                limit: int = 100,
                session: Session = Depends(get_session),
                user: CustomAuth0User = Security(auth.get_user)):
    user = validate_user_by_id(user.id, session)
    if not user:
        raise HTTPException(status_code=404, detail="Not Found")
    if user.role != UserRole.admin:
        raise HTTPException(status_code=404, detail="Not Found")
    company = crud_company.get_company(session=session, skip=skip, limit=limit)
    return [params.with_extra_data(i.serialize) for i in company]


@routes.get("/company/{id:path}",
            response_model=CompanyBase,
            summary="get company detail",
            tags=["Company"],
            dependencies=[Depends(auth.implicit_scheme)])
def get_company_by_id(id: int,
                      session: Session = Depends(get_session),
                      user: CustomAuth0User = Security(auth.get_user)):
    user = validate_user_by_id(user.id, session)
    if not user:
        raise HTTPException(status_code=404, detail="Not Found")
    if user.role != UserRole.admin:
        raise HTTPException(status_code=404, detail="Not Found")
    company = crud_company.get_company_by_id(session=session, id=id)
    if company is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return params.with_extra_data(company.serialize)


@routes.post("/driver-income/",
             response_model=DriverIncomeBase,
             summary="add new driver income",
             tags=["Driver Income"],
             dependencies=[Depends(auth.implicit_scheme)])
def add_driver_income(country: int,
                      crop: int,
                      status: DriverIncomeStatus,
                      area: float = None,
                      price: float = None,
                      cop_pha: int = None,
                      cop_pkg: float = None,
                      efficiency: int = None,
                      yields: int = None,
                      diversification: int = None,
                      revenue: int = None,
                      total_revenue: int = None,
                      net_income: int = None,
                      living_income: int = None,
                      source: str = None,
                      session: Session = Depends(get_session),
                      user: CustomAuth0User = Security(auth.get_user)):
    user = validate_user_by_id(user.id, session)
    if not user:
        raise HTTPException(status_code=403, detail="Forbidden")
    if user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Forbidden")
    driver_income = crud_driver_income.add_driver_income(
        session=session,
        data=DriverIncome(country=country,
                          crop=crop,
                          status=status,
                          area=area,
                          price=price,
                          cop_pha=cop_pha,
                          cop_pkg=cop_pkg,
                          efficiency=efficiency,
                          yields=yields,
                          diversification=diversification,
                          revenue=revenue,
                          total_revenue=total_revenue,
                          net_income=net_income,
                          living_income=living_income,
                          source=source))
    return driver_income.serialize


@routes.get("/driver-income",
            response_model=List[DriverIncomeBase],
            summary="get all driver income",
            tags=["Driver Income"],
            dependencies=[Depends(auth.implicit_scheme)])
def get_driver_income(skip: int = 0,
                      limit: int = 100,
                      session: Session = Depends(get_session),
                      user: CustomAuth0User = Security(auth.get_user)):
    user = validate_user_by_id(user.id, session)
    if not user:
        raise HTTPException(status_code=404, detail="Not Found")
    if user.role != UserRole.admin:
        raise HTTPException(status_code=404, detail="Not Found")
    driver_income = crud_driver_income.get_driver_income(session=session,
                                                         skip=skip,
                                                         limit=limit)
    return [i.serialize for i in driver_income]


@routes.get("/driver-income/{crop:path}/{country:path}",
            response_model=DriverIncomeBase,
            summary="get driver income",
            tags=["Driver Income"],
            dependencies=[Depends(auth.implicit_scheme)])
def get_driver_income_detail(crop: int,
                             country: int,
                             session: Session = Depends(get_session),
                             user: CustomAuth0User = Security(auth.get_user)):
    user = validate_user_by_id(user.id, session)
    if not user:
        raise HTTPException(status_code=404, detail="Not Found")
    if user.role != UserRole.admin:
        raise HTTPException(status_code=404, detail="Not Found")
    driver_income = crud_driver_income.get_driver_income_by_crop_country(
        session=session,
        crop=crop,
        country=country,
    )
    if driver_income is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return driver_income.serialize


@routes.get("/country-company",
            response_model=List[CountryCompanyBase],
            summary="get country and the company list",
            tags=["Country", "Company"],
            dependencies=[Depends(auth.implicit_scheme)])
def get_country_company(session: Session = Depends(get_session),
                        user: CustomAuth0User = Security(auth.get_user)):
    user = validate_user_by_id(user.id, session)
    if not user:
        raise HTTPException(status_code=404, detail="Not Found")
    if user.role != UserRole.admin:
        raise HTTPException(status_code=404, detail="Not Found")
    country = crud_country.get_company(session=session)
    return [i.serialize for i in country]


@routes.get("/crop-company",
            response_model=List[CropCompanyBase],
            summary="get crop and the company list",
            tags=["Crop", "Company"],
            dependencies=[Depends(auth.implicit_scheme)])
def get_crop_company(session: Session = Depends(get_session),
                     user: CustomAuth0User = Security(auth.get_user)):
    user = validate_user_by_id(user.id, session)
    if not user:
        raise HTTPException(status_code=404, detail="Not Found")
    if user.role != UserRole.admin:
        raise HTTPException(status_code=404, detail="Not Found")
    crop = crud_crop.get_company(session=session)
    return [i.serialize for i in crop]


@routes.get("/", tags=["Dev"])
def read_main():
    return "OK"


@routes.get("/health-check", tags=["Dev"])
def health_check():
    return "OK"
