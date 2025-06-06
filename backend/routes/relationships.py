from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.routing import APIRouter
from fastapi.templating import Jinja2Templates
from fastapi.responses import Response
from fastapi import Form

from .. import crud, schemas, models
from ..deps import *

router = APIRouter(prefix="/relationships")

@router.get("/user-event/event/{event_id}", response_model=list[schemas.Association_user])
@check([Right(Access.UPDATE, Model.EVENT), Right(Access.READ, Model.USER)])
def read_members_of_event(user: UserDep, event_id: int, skip: int = 0, limit: int = 0,  db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event Not Found")
    else:
        return db_event.members[skip : skip + limit]


@router.get("/user-event/user/{user_id}", response_model=list[schemas.Association_event])
@owner_or_check([Right(Access.UPDATE, Model.EVENT), Right(Access.READ, Model.USER)])
def read_user_events(user: UserDep, user_id: int, skip: int = 0, limit: int = 0, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User Not Found")
    else:
        return db_user.events[skip : skip + limit]


@router.post("/user-event", response_model=schemas.Association)
@owner_or_check([Right(Access.UPDATE, Model.EVENT), Right(Access.UPDATE, Model.USER)])
def create_user_event(user: UserDep, user_id: int, event_id: int, extra_data: dict, db: Session = Depends(get_db)):
    if crud.get_user(db, user_id) is None or crud.get_event(db, event_id) is None:
        raise HTTPException(status_code=404, detail="Event or User Not Found")
    elif crud.get_association(db, user_id, event_id):
        raise HTTPException(status_code=400, detail="Relation already exist")
    else:
        return crud.create_association(db, user_id, event_id, extra_data)


@router.delete("/user-event", response_model=schemas.Association)
@owner_or_check([Right(Access.UPDATE, Model.EVENT), Right(Access.UPDATE, Model.USER)])
def delete_user_event(user: UserDep, user_id: int, event_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    db_event = crud.get_event(db, event_id)
    if db_user is None or db_event is None:
        raise HTTPException(status_code=404, detail="Event or User Not Found")
    elif not crud.get_association(db, user_id, event_id):
        raise HTTPException(status_code=400, detail="Relation doesnt exist")
    else:
        return crud.delete_association(db, user_id, event_id)




@router.get("/event-news/event/{event_id}", response_model=list[schemas.NewsRead])
def read_event_news(user: UserDep, event_id: int, skip: int = 0, limit: int = 0, db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event Not Found")
    else:
        return db_event.news[skip : skip + limit]


@router.get("/event-news/news/{news_id}", response_model=list[schemas.EventRead])
def read_news_events(user: UserDep, news_id: int, skip: int = 0, limit: int = 0, db: Session = Depends(get_db)):
    db_news = crud.get_news(db, news_id)
    if db_news is None:
        raise HTTPException(status_code=404, detail="News Not Found")
    else:
        return db_news.events[skip : skip + limit]


@router.post("/event-news")
@check([Right(Access.UPDATE, Model.EVENT), Right(Access.UPDATE, Model.NEWS)])
def create_event_news(user: UserDep, news_id: int, event_id: int, db: Session = Depends(get_db)):
    db_news = crud.get_news(db, news_id)
    db_event = crud.get_event(db, event_id)
    if db_news is None or db_event is None:
        raise HTTPException(status_code=404, detail="Event or News Not Found")
    elif db_event in db_news.events:
        raise HTTPException(status_code=400, detail="Relation already exist")
    else:
        db_news.events.append(db_event)
        db.commit()
        return Response(status_code=200)


@router.delete("/event-news")
@check([Right(Access.UPDATE, Model.EVENT), Right(Access.UPDATE, Model.NEWS)])
def delete_event_news(user: UserDep, news_id: int, event_id: int, db: Session = Depends(get_db)):
    db_news = crud.get_news(db, news_id)
    db_event = crud.get_event(db, event_id)
    if db_news is None or db_event is None:
        raise HTTPException(status_code=404, detail="Event or User Not Found")
    elif not db_event in db_news.events:
        raise HTTPException(status_code=400, detail="Relation doesnt exist")
    else:
        db_news.events.remove(db_event)
        db.commit()
        return Response(status_code=200)
