from fastapi import Depends, Request, APIRouter, HTTPException
from fastapi.security import HTTPBasicCredentials as credentials
from fastapi.security import HTTPBearer
from typing import List
from sqlalchemy.orm import Session

from db import crud_country
from db.schema import CountryBase
from db.schema import CountryCompanyBase
from db.connection import get_session
from middleware import verify_user

security = HTTPBearer()
country_route = APIRouter()


@country_route.get("/country/",
                   response_model=List[CountryBase],
                   summary="get all countries",
                   name="country:get-all",
                   tags=["Country"])
def get_country(session: Session = Depends(get_session)):
    country = crud_country.get_country(session=session)
    return [i.serialize for i in country]


@country_route.get("/country/{id:path}",
                   response_model=CountryBase,
                   summary="get country detail",
                   name="country:get-by-id",
                   tags=["Country"])
def get_country_by_id(id: int, session: Session = Depends(get_session)):
    country = crud_country.get_country_by_id(session=session, id=id)
    if country is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return country.serialize


@country_route.get("/country-company",
                   response_model=List[CountryCompanyBase],
                   summary="get country and the company list",
                   name="country:with-company",
                   tags=["Country"])
def get_country_company(req: Request,
                        session: Session = Depends(get_session),
                        credentials: credentials = Depends(security)):
    verify_user(req.state.authenticated, session)
    country = crud_country.get_company(session=session)
    country = [i.serialize for i in country]
    return country
