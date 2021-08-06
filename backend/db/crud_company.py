from typing import List
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
