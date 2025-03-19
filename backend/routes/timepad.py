from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.routing import APIRouter
from fastapi.templating import Jinja2Templates
from fastapi import Form

from .. import crud, schemas
from ..deps import *


router = APIRouter(prefix="/timepad")

@router.post("/", response_model=schemas.Entry)
@organizer
def create_entry(user: UserDep, entry: schemas.EntryCreate, db: Session = Depends(get_db)):
    db_entry = crud.get_entry_by_description(db, entry)
    if db_entry:
        raise HTTPException(status_code=404, detail="Entry already exists")
    else:
        return crud.create_entry(db, entry)


@router.get("/", response_model=list[schemas.Entry])
@organizer
def read_entries(user: UserDep, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_entries(db, skip, limit)


@router.get("/user/{user_id}", response_model=list[schemas.Entry])
@organizer
def read_user_entries(user: UserDep, user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User Not Found")
    else:
        return db_user.entries


@router.get("/event/{event_id}", response_model=list[schemas.Entry])
@organizer
def read_user_entries(user: UserDep, event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event Not Found")
    else:
        return db_event.entries


@router.delete("/", response_model=schemas.EntryRead)
@organizer
def delete_entry(user: UserDep, entry_id: int, db: Session = Depends(get_db)):
    db_entry = crud.get_entry(db, entry_id)
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Entry Not Found")
    else:
        return crud.delete_entry(db, entry_id)