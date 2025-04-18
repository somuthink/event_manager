from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.routing import APIRouter
from fastapi.templating import Jinja2Templates
from fastapi import Form

from .. import crud, schemas
from ..deps import *


router = APIRouter(prefix="/tags")

@router.post("/", response_model=schemas.Tag)
def create_tag(name: str, db: Session = Depends(get_db)):
    db_tag = crud.get_tag(db, name)
    if db_tag:
        raise HTTPException(status_code=404, detail="Tag already exists")
    else:
        return crud.create_tag(db, name)

@router.get("/", response_model=list[schemas.Tag])
def read_tags(db: Session = Depends(get_db)):
    return crud.get_tags(db)


@router.delete("/")
def delete_tag(name: str, db: Session = Depends(get_db)):
    db_tag = crud.get_tag(db, name)
    if db_tag is None:
        raise HTTPException(404, "Tag Not Found")
    else:
        return crud.delete_tag(db, name)
