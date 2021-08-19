from fastapi import Depends, Request, APIRouter, HTTPException
from fastapi.security import HTTPBasicCredentials as credentials
from fastapi.security import HTTPBearer
from typing import List
from sqlalchemy.orm import Session
from db import crud_driver_income
from db.schema import DriverIncomeBase
from db.models import DriverIncomeStatus, DriverIncome
from db.connection import get_session
from middleware import verify_admin, verify_user

security = HTTPBearer()
driver_income_route = APIRouter()


@driver_income_route.post("/driver-income/",
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
                      credentials: credentials = Depends(security)):
    verify_admin(req.state.authenticated, session)
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


@driver_income_route.get("/driver-income",
                         response_model=List[DriverIncomeBase],
                         summary="get all driver income",
                         tags=["Driver Income"])
def get_driver_income(req: Request,
                      skip: int = 0,
                      limit: int = 100,
                      session: Session = Depends(get_session),
                      credentials: credentials = Depends(security)):
    verify_user(req.state.authenticated, session)
    driver_income = crud_driver_income.get_driver_income(session=session,
                                                         skip=skip,
                                                         limit=limit)
    return [i.serialize for i in driver_income]


@driver_income_route.get("/driver-income/{crop:path}/{country:path}",
                         response_model=DriverIncomeBase,
                         summary="get driver income",
                         tags=["Driver Income"])
def get_driver_income_detail(req: Request,
                             crop: int,
                             country: int,
                             session: Session = Depends(get_session),
                             credentials: credentials = Depends(security)):
    verify_user(req.state.authenticated, session)
    driver_income = crud_driver_income.get_driver_income_by_crop_country(
        session=session,
        crop=crop,
        country=country,
    )
    if driver_income is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return driver_income.serialize
