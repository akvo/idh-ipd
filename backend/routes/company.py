from fastapi import Depends, Request, APIRouter, HTTPException
from fastapi.security import HTTPBasicCredentials as credentials
from fastapi.security import HTTPBearer
from typing import List
from sqlalchemy.orm import Session

from db import crud_company, crud_crop, crud_country
from db.schema import CompanyBase
from db.schema import CompanyComparison
from db.models import Company
from db.connection import get_session
import util.params as params
import util.calc as calc
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
                   response_model=CompanyComparison,
                   summary="get company detail",
                   tags=["Company"])
def get_company_by_id(req: Request,
                      id: int,
                      session: Session = Depends(get_session),
                      credentials: credentials = Depends(security)):
    verify_user(req.state.authenticated, session)
    company = crud_company.get_company_by_id(session=session, id=id)

    country_name = crud_country.get_name(session=session, id=company.country)
    # this_crop_name = crud_crop.get_name(session=session, id=company.crop)
    in_country = crud_company.get_company_by_country(session=session,
                                                     country=company.country)
    in_country = calc.avg(in_country, 'crop')
    for c in in_country:
        crop_name = crud_crop.get_name(session=session, id=c['crop'])
        c.update({'name': f"{country_name} average in {crop_name}"})

    # same_crop = crud_company.get_company_by_crop(
    #     session=session, crop=company.crop, exclude_country=company.country)
    # same_crop = calc.avg(same_crop, 'crop')
    # for c in same_crop:
    #     c.update({'name': f"Other countries average in {this_crop_name}"})

    if company is None:
        raise HTTPException(status_code=404, detail="Not Found")
    company = params.with_extra_data(company.serialize)
    # company['comparison'] = same_crop + in_country
    company['comparison'] = in_country
    return company
