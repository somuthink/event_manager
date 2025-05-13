from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.routing import APIRouter
from fastapi.templating import Jinja2Templates
from fastapi import Form

from .. import crud, schemas
from ..deps import *

router = APIRouter(prefix="/news")


@router.post("/", response_model=schemas.News)
@check([Right(Access.CREATE, Model.NEWS)])
def create_news(user: UserDep, news: schemas.NewsCreate, db: Session = Depends(get_db)):
    db_news = crud.get_news_by_title(db, news.title)
    if db_news:
        raise HTTPException(status_code=404, detail="News already exists")
    else:
        db_news = crud.create_news(db, news)
        crud.create_access_news_association(db, user.id, db_news.id, 3)
        return db_news

@router.get("/", response_model=list[schemas.NewsRead])
def read_news(q: str | None = None,skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    news = crud.get_news_list(db, q, skip, limit)
    return news


@router.get("/{news_id}", response_model=schemas.News)
def read_news(news_id: int, db: Session = Depends(get_db)):
    db_news = crud.get_news(db, news_id)
    if db_news is None:
        raise HTTPException(status_code=404, detail="News Not Found")
    return db_news


@router.put("/{news_id}")
@check([Right(Access.UPDATE, Model.NEWS)])
def update_news(user: UserDep, 
    news_id: int, updated_news: schemas.UpdateNews, db: Session = Depends(get_db)
):
    db_news = crud.update_news(db, news_id, updated_news)
    if db_news is None:
        raise HTTPException(404, "Could not update")
    return {"message": "News record successfully Updated", "data": db_news}


@router.delete("/{news_id}")
@check([Right(Access.DELETE, Model.NEWS)])
def delete_news(user: UserDep, news_id: int, db: Session = Depends(get_db)):
    db_news = crud.delete_news(db, news_id)
    if db_news is None:
        raise HTTPException(404, "User Not Found")
    return {"message": "News successfully Deleted", "data": db_news}
