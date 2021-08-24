from typing import List
from sqlalchemy import and_
from sqlalchemy.orm import Session
from .models import Company, CompanyDict


def add_company(session, data) -> CompanyDict:
    session.add(data)
    session.commit()
    session.flush()
    session.refresh(data)
    return data


def get_company(session: Session,
                skip: int = 0,
                limit: int = 100) -> List[Company]:
    return session.query(Company).offset(skip).limit(limit).all()


def get_company_by_id(session: Session, id: int) -> Company:
    return session.query(Company).filter(Company.id == id).first()


def get_company_by_country(session: Session,
                           country: int,
                           crop: int = 0) -> List[Company]:
    if crop == 0:
        return session.query(Company).filter(Company.country == country).all()
    return session.query(Company).filter(Company.country == country).filter(
        Company.crop == crop).all()


def get_company_by_crop(session: Session,
                        crop: int,
                        exclude_country: int = 0) -> List[Company]:
    return session.query(Company).filter(
        and_(Company.country != exclude_country, Company.crop == crop)).all()
