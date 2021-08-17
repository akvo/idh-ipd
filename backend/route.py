import pandas as pd
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.security import HTTPBasicCredentials, HTTPBearer
from typing import List, Optional
from math import ceil
from sqlalchemy.orm import Session

from db import crud_user, crud_country, crud_crop
from db import crud_company, crud_driver_income
from db import models
from db.connection import SessionLocal, engine
from db.schema import UserBase, CountryBase, CropBase
from db.schema import CompanyBase, DriverIncomeBase
from db.schema import CountryCompanyBase
from db.schema import CropCompanyBase
from db.schema import UserAccessBase, AccessBase
from db.schema import UserResponse
from db.models import Company, DriverIncome
from db.models import UserRole, DriverIncomeStatus
import util.params as params
from middleware import verify_token, verify_admin, verify_user, get_auth0_user

models.Base.metadata.create_all(bind=engine)
routes = APIRouter()

security = HTTPBearer()


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@routes.get("/user/me",
            response_model=UserAccessBase,
            summary="get account information",
            tags=["User"])
def get_me(req: Request,
           session: Session = Depends(get_session),
           credentials: HTTPBasicCredentials = Depends(security)):
    user = verify_user(req.state.authenticated, session)
    return user


@routes.post("/user/",
             response_model=UserBase,
             summary="register new user",
             tags=["User"])
def add_user(req: Request,
             session: Session = Depends(get_session),
             credentials: HTTPBasicCredentials = Depends(security)):
    user = verify_token(req.state.authenticated)
    user = crud_user.add_user(session=session,
                              email=user.get("email"),
                              role="user")
    return user


@routes.get("/user/",
            response_model=UserResponse,
            summary="get all users",
            tags=["User"])
def get_user(req: Request,
             page: int = 1,
             session: Session = Depends(get_session),
             credentials: HTTPBasicCredentials = Depends(security)):
    verify_admin(req.state.authenticated, session)
    user = crud_user.get_user(session=session, skip=(10 * (page - 1)))
    total = crud_user.count(session=session)
    user = [i.serialize for i in user]
    auth0_data = get_auth0_user()
    auth0_data = pd.DataFrame(auth0_data)
    user = pd.DataFrame(user)
    user = user.merge(auth0_data, on='email', how='left')
    for col in list(user):
        user[col] = user[col].apply(lambda x: None if x != x else x)
    user = user.to_dict('records')
    return {
        'current': page,
        'data': user,
        'total': total,
        'total_page': ceil(total / 10)
    }


@routes.get("/user/{id:path}",
            response_model=UserAccessBase,
            summary="get user detail",
            tags=["User"])
def get_user_by_id(req: Request,
                   id: int,
                   session: Session = Depends(get_session),
                   credentials: HTTPBasicCredentials = Depends(security)):
    verify_admin(req.state.authenticated, session)
    user = crud_user.get_user_by_id(session=session, id=id)
    if user is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return user.serialize


@routes.put("/user/{id:path}",
            response_model=UserAccessBase,
            summary="Update user",
            tags=["User"])
def update_user_by_id(req: Request,
                      id: int,
                      active: bool,
                      role: UserRole,
                      access: List[AccessBase] = [],
                      session: Session = Depends(get_session),
                      credentials: HTTPBasicCredentials = Depends(security)):
    verify_admin(req.state.authenticated, session)
    access = crud_user.add_access(session=session, user=id, access=access)
    user = crud_user.update_user_by_id(session=session,
                                       id=id,
                                       active=active,
                                       role=role)
    if user is None:
        raise HTTPException(status_code=404, detail="Not Found")
    if user.role == UserRole.admin:
        crud_user.delete_all_access(session=session, user=user.id)
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
             tags=["Crop"])
def add_crop(req: Request,
             name: str,
             session: Session = Depends(get_session),
             credentials: HTTPBasicCredentials = Depends(security)):
    verify_user(req.state.authenticated, session)
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
def get_crop_by_id(id: int, session: Session = Depends(get_session)):
    crop = crud_crop.get_crop_by_id(session=session, id=id)
    if crop is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return crop.serialize


@routes.post("/company/",
             response_model=CompanyBase,
             summary="add new company",
             tags=["Company"])
def add_company(req: Request,
                name: str,
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
                credentials: HTTPBasicCredentials = Depends(security)):
    verify_user(req.state.authenticated, session)
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
            tags=["Company"])
def get_company(req: Request,
                skip: int = 0,
                limit: int = 100,
                session: Session = Depends(get_session),
                credentials: HTTPBasicCredentials = Depends(security)):
    verify_user(req.state.authenticated, session)
    company = crud_company.get_company(session=session, skip=skip, limit=limit)
    return [params.with_extra_data(i.serialize) for i in company]


@routes.get("/company/{id:path}",
            response_model=CompanyBase,
            summary="get company detail",
            tags=["Company"])
def get_company_by_id(req: Request,
                      id: int,
                      session: Session = Depends(get_session),
                      credentials: HTTPBasicCredentials = Depends(security)):
    verify_user(req.state.authenticated, session)
    company = crud_company.get_company_by_id(session=session, id=id)
    if company is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return params.with_extra_data(company.serialize)


@routes.post("/driver-income/",
             response_model=DriverIncomeBase,
             summary="add new driver income",
             tags=["Driver Income"])
def add_driver_income(req: Request,
                      country: int,
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
                      credentials: HTTPBasicCredentials = Depends(security)):
    verify_user(req.state.authenticated, session)
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
            tags=["Driver Income"])
def get_driver_income(req: Request,
                      skip: int = 0,
                      limit: int = 100,
                      session: Session = Depends(get_session),
                      credentials: HTTPBasicCredentials = Depends(security)):
    verify_user(req.state.authenticated, session)
    driver_income = crud_driver_income.get_driver_income(session=session,
                                                         skip=skip,
                                                         limit=limit)
    return [i.serialize for i in driver_income]


@routes.get("/driver-income/{crop:path}/{country:path}",
            response_model=DriverIncomeBase,
            summary="get driver income",
            tags=["Driver Income"])
def get_driver_income_detail(
    req: Request,
    crop: int,
    country: int,
    session: Session = Depends(get_session),
    credentials: HTTPBasicCredentials = Depends(security)):
    verify_user(req.state.authenticated, session)
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
            tags=["Country", "Company"])
def get_country_company(req: Request,
                        session: Session = Depends(get_session),
                        credentials: HTTPBasicCredentials = Depends(security)):
    verify_user(req.state.authenticated, session)
    country = crud_country.get_company(session=session)
    country = [i.serialize for i in country]
    for c in country:
        c['company'] = [
            params.with_extra_data(x.serialize) for x in c['company']
        ]
    return country


@routes.get("/crop-company",
            response_model=List[CropCompanyBase],
            summary="get crop and the company list",
            tags=["Crop", "Company"])
def get_crop_company(req: Request,
                     session: Session = Depends(get_session),
                     credentials: HTTPBasicCredentials = Depends(security)):
    verify_user(req.state.authenticated, session)
    crop = crud_crop.get_company(session=session)
    crop = [i.serialize for i in crop]
    for c in crop:
        c['company'] = [
            params.with_extra_data(x.serialize) for x in c['company']
        ]
    return crop


@routes.get("/", tags=["Dev"])
def read_main():
    return "OK"


@routes.get("/health-check", tags=["Dev"])
def health_check():
    return "OK"
