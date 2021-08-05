from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import crud_user, crud_country, crud_crop, crud_company, models
from db.connection import SessionLocal, engine
from db.schema import UserBase, CountryBase, CropBase, CompanyBase
from db.models import UserRole

models.Base.metadata.create_all(bind=engine)
routes = APIRouter()


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@routes.get("/health-check")
def health_check():
    return "OK"


@routes.get("/")
def read_main():
    return "OK"


@routes.post("/user/", response_model=UserBase, summary="add new user")
def add_user(email: str,
             role: UserRole,
             session: Session = Depends(get_session)):
    user = crud_user.add_user(session=session, email=email, role=role)
    return user


@routes.get("/user/", response_model=List[UserBase], summary="get all users")
def get_user(skip: int = 0,
             limit: int = 100,
             session: Session = Depends(get_session)):
    user = crud_user.get_user(session=session, skip=skip, limit=limit)
    return [i.serialize for i in user]


@routes.get("/user/{id:path}",
            response_model=UserBase,
            summary="get user detail")
def get_user_by_id(id: int, session: Session = Depends(get_session)):
    user = crud_user.get_user_by_id(session=session, id=id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user.serialize


@routes.post("/country/",
             response_model=CountryBase,
             summary="add new country")
def add_country(name: str, session: Session = Depends(get_session)):
    country = crud_country.add_country(session=session, name=name)
    return country


@routes.get("/country/",
            response_model=List[CountryBase],
            summary="get all countries")
def get_country(skip: int = 0,
                limit: int = 100,
                session: Session = Depends(get_session)):
    country = crud_country.get_country(session=session, skip=skip, limit=limit)
    return [i.serialize for i in country]


@routes.get("/country/{id:path}",
            response_model=CountryBase,
            summary="get country detail")
def get_country_by_id(id: int, session: Session = Depends(get_session)):
    country = crud_country.get_country_by_id(session=session, id=id)
    if country is None:
        raise HTTPException(status_code=404, detail="country not found")
    return country.serialize


@routes.post("/crop/", response_model=CropBase, summary="add new crop")
def add_crop(name: str, session: Session = Depends(get_session)):
    crop = crud_crop.add_crop(session=session, name=name)
    return crop


@routes.get("/crop/", response_model=List[CropBase], summary="get all crops")
def get_crop(skip: int = 0,
             limit: int = 100,
             session: Session = Depends(get_session)):
    crop = crud_crop.get_crop(session=session, skip=skip, limit=limit)
    return [i.serialize for i in crop]


@routes.get("/crop/{id:path}",
            response_model=CropBase,
            summary="get crop detail")
def get_crop_by_id(id: int, session: Session = Depends(get_session)):
    crop = crud_crop.get_crop_by_id(session=session, id=id)
    if crop is None:
        raise HTTPException(status_code=404, detail="crop not found")
    return crop.serialize


@routes.post("/company/",
             response_model=CompanyBase,
             summary="add new company")
def add_company(name: str,
                country: int,
                crop: int,
                land_size: float,
                price: float,
                yields: int,
                prod_cost: int,
                other_income: int,
                living_income: int,
                session: Session = Depends(get_session)):
    company = crud_company.add_company(session=session,
                                       name=name,
                                       country=country,
                                       crop=crop,
                                       land_size=land_size,
                                       price=price,
                                       yields=yields,
                                       prod_cost=prod_cost,
                                       other_income=other_income,
                                       living_income=living_income)
    return company


@routes.get("/company/",
            response_model=List[CompanyBase],
            summary="get all companies")
def get_company(skip: int = 0,
                limit: int = 100,
                session: Session = Depends(get_session)):
    company = crud_company.get_company(session=session, skip=skip, limit=limit)
    return [i.serialize for i in company]


@routes.get("/company/{id:path}",
            response_model=CompanyBase,
            summary="get company detail")
def get_company_by_id(id: int, session: Session = Depends(get_session)):
    company = crud_company.get_company_by_id(session=session, id=id)
    if company is None:
        raise HTTPException(status_code=404, detail="company not found")
    return company.serialize
