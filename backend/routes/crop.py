from fastapi import Depends, Request, APIRouter, HTTPException
from fastapi.security import HTTPBearer
from fastapi.security import HTTPBasicCredentials as credentials
from typing import List
from sqlalchemy.orm import Session

from db import crud_crop
from db.schema import CropBase, CropCompanyBase
from db.connection import get_session
from middleware import verify_user, verify_admin
import util.params as params

security = HTTPBearer()
crop_route = APIRouter()


@crop_route.post("/crop/",
                 response_model=CropBase,
                 summary="add new crop",
                 name="crop:new",
                 tags=["Crop"])
def add_crop(req: Request,
             name: str,
             session: Session = Depends(get_session),
             credentials: credentials = Depends(security)):
    verify_admin(req.state.authenticated, session)
    crop = crud_crop.add_crop(session=session, name=name)
    return crop


@crop_route.get("/crop/",
                response_model=List[CropBase],
                summary="get all crops",
                name="crop:get-all",
                tags=["Crop"])
def get_crop(skip: int = 0,
             limit: int = 100,
             session: Session = Depends(get_session)):
    crop = crud_crop.get_crop(session=session, skip=skip, limit=limit)
    return [i.serialize for i in crop]


@crop_route.get("/crop/{id:path}",
                response_model=CropBase,
                summary="get crop detail",
                name="crop:get-by-id",
                tags=["Crop"])
def get_crop_by_id(id: int, session: Session = Depends(get_session)):
    crop = crud_crop.get_crop_by_id(session=session, id=id)
    if crop is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return crop.serialize



@crop_route.get("/crop-company",
               response_model=List[CropCompanyBase],
               summary="get crop and the company list",
               tags=["Crop", "Company"])
def get_crop_company(req: Request,
                     session: Session = Depends(get_session),
                     credentials: credentials = Depends(security)):
    verify_user(req.state.authenticated, session)
    crop = crud_crop.get_company(session=session)
    crop = [i.serialize for i in crop]
    for c in crop:
        c['company'] = [
            params.with_extra_data(x.serialize) for x in c['company']
        ]
    return crop
