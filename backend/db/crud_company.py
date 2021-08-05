from typing import List
from sqlalchemy.orm import Session
from .models import Company, CompanyDict


def add_company(session: Session, name: str, country: int, crop: int,
                land_size: float, price: float, yields: int, prod_cost: int,
                other_income: int, living_income: int) -> CompanyDict:
    company = Company(name=name,
                      country=country,
                      crop=crop,
                      land_size=land_size,
                      price=price,
                      yields=yields,
                      prod_cost=prod_cost,
                      other_income=other_income,
                      living_income=living_income)
    session.add(company)
    session.commit()
    session.flush()
    session.refresh(company)
    return company


def get_company(session: Session,
                skip: int = 0,
                limit: int = 100) -> List[Company]:
    return session.query(Company).offset(skip).limit(limit).all()


def get_company_by_id(session: Session, id: int) -> Company:
    return session.query(Company).filter(Company.id == id).first()
