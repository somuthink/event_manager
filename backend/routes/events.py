from fastapi import Depends, Form, HTTPException, Request
from fastapi.routing import APIRouter
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..deps import *

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/events")


@router.post("/", response_model=schemas.Event)
@check([Right(Access.CREATE, Model.EVENT)])
def create_event(user: UserDep, event: schemas.EventCreate, db: Session = Depends(get_db)):
    db_event = crud.get_event_by_title(db, event.title)
    if db_event:
        raise HTTPException(status_code=404, detail="Event already exists")
    else:
        db_event = crud.create_event(db, event)
        crud.create_access_event_association(db, user.id, db_event.id, 3)
        return db_event


@router.get("/", response_model=list[schemas.EventRead])
def read_events(q: str | None = None , skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = crud.get_events(db, q, skip, limit, )
    return events


@router.get("/{event_id}", response_model=schemas.Event)
def read_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event Not Found")
    return db_event


@router.put("/{event_id}")
@check([Right(Access.UPDATE, Model.EVENT)])
def update_event(user: UserDep, 
    event_id: int, updated_event: schemas.UpdateEvent, db: Session = Depends(get_db)
):
    db_event = crud.update_event(db, event_id, updated_event)
    if db_event is None:
        raise HTTPException(404, "Could not update")
    return {"message": "Event record successfully Updated", "data": db_event}


@router.delete("/{event_id}")
@check([Right(Access.DELETE, Model.EVENT)])
def delete_event(user: UserDep, event_id: int, db: Session = Depends(get_db)):
    db_event = crud.delete_event(db, event_id)
    if db_event is None:
        raise HTTPException(404, "Event Not Found")
    return {"message": "Event successfully Deleted", "data": db_event}
