from fastapi import Depends, Request, APIRouter, HTTPException
from fastapi.security import HTTPBasicCredentials as credentials
from fastapi.security import HTTPBearer
from typing import List
from sqlalchemy.orm import Session

from db import crud_company
from db.schema import CompanyBase, CompanyBaseDetail
from db.models import Company
from db.connection import get_session
import util.params as params
from middleware import verify_admin, verify_user

security = HTTPBearer()
company_route = APIRouter()


@company_route.post("/company/",
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
                credentials: credentials = Depends(security)):
    verify_admin(req.state.authenticated, session)
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


@company_route.get("/company/",
                   response_model=List[CompanyBase],
                   summary="get all companies",
                   tags=["Company"])
def get_company(req: Request,
                skip: int = 0,
                limit: int = 100,
                session: Session = Depends(get_session),
                credentials: credentials = Depends(security)):
    verify_user(req.state.authenticated, session)
    company = crud_company.get_company(session=session, skip=skip, limit=limit)
    return [params.with_extra_data(i.serialize) for i in company]


@company_route.get("/company/{id:path}",
                   response_model=CompanyBaseDetail,
                   summary="get company detail",
                   tags=["Company"])
def get_company_by_id(req: Request,
                      id: int,
                      session: Session = Depends(get_session),
                      credentials: credentials = Depends(security)):
    verify_user(req.state.authenticated, session)
    company = crud_company.get_company_by_id(session=session, id=id)
    # country = crud_company.get_company_by_country_and_crop(
    #     session=session, country=company.country, crop=company.crop)
    # crop = crud_company.get_company_by_crop(session=session, crop=company.crop)
    if company is None:
        raise HTTPException(status_code=404, detail="Not Found")
    company = params.with_extra_data(company.serialize)
    return company
