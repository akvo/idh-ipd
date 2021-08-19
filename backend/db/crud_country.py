from typing import List
from sqlalchemy.orm import Session
from .models import Country


def get_country(session: Session) -> List[Country]:
    return session.query(Country).all()


def get_country_by_id(session: Session, id: int) -> Country:
    return session.query(Country).filter(Country.id == id).first()


def get_country_by_name(session: Session, name: str) -> Country:
    return session.query(Country).filter(Country.name == name).first()


def get_company(session: Session) -> Country:
    company = session.query(Country).filter(Country.company != None).all()
    return company


def get_name(session: Session, id: int) -> str:
    country = session.query(Country).filter(Country.id == id).one()
    return country.name
