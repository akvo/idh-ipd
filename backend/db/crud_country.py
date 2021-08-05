from typing import List
from sqlalchemy.orm import Session
from .models import Country, CountryDict


def add_country(session: Session, name: str) -> CountryDict:
    country = Country(name=name)
    session.add(country)
    session.commit()
    session.flush()
    session.refresh(country)
    return country


def get_country(session: Session,
                skip: int = 0,
                limit: int = 100) -> List[Country]:
    return session.query(Country).offset(skip).limit(limit).all()


def get_country_by_id(session: Session, id: int) -> Country:
    return session.query(Country).filter(Country.id == id).first()
