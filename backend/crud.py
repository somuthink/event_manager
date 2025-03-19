from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from multipledispatch import dispatch

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    data = user.model_dump()
    data.pop("password")
    data.update({"hashed_password": pwd_context.hash(user.password)})
    db_user = models.User(**data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, updated_user: schemas.UserBase):
    user_to_update = db.query(models.User).filter(models.User.id == user_id).first()
    if user_to_update:
        for key, value in updated_user.model_dump(exclude_unset=True).items():
            setattr(user_to_update, key, value)
        db.commit()
        db.refresh(user_to_update)
        return user_to_update
    else:
        return None


def delete_user(db: Session, user_id: int):
    user_to_delete = db.query(models.User).filter(models.User.id == user_id).first()
    if user_to_delete:
        db.delete(user_to_delete)
        db.commit()
        return user_to_delete
    else:
        return None


def get_event(db: Session, event_id: int):
    return db.query(models.Event).filter(models.Event.id == event_id).first()


def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Event).offset(skip).limit(limit).all()


def get_event_by_title(db: Session, title: str):
    return db.query(models.Event).filter(models.Event.title == title).first()


def create_event(db: Session, event: schemas.EventCreate):
    db_event = models.Event(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def update_event(db: Session, event_id: int, updated_event: schemas.EventBase):
    event_to_update = db.query(models.Event).filter(models.Event.id == event_id).first()
    if event_to_update:
        for key, value in updated_event.model_dump(exclude_unset=True).items():
            setattr(event_to_update, key, value)
        db.commit()
        db.refresh(event_to_update)
        return event_to_update
    else:
        return None
    

def delete_event(db: Session, event_id: int):
    event_to_delete = db.query(models.Event).filter(models.Event.id == event_id).first()
    if event_to_delete:
        db.delete(event_to_delete)
        db.commit()
        return event_to_delete
    else:
        return None

@dispatch(Session, int)
def get_news(db: Session, news_id: int):
    return db.query(models.News).filter(models.News.id == news_id).first()


@dispatch(Session, int, int)
def get_news(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.News).offset(skip).limit(limit).all()


def get_news_by_title(db: Session, title: str):
    return db.query(models.News).filter(models.News.title == title).first()


def create_news(db: Session, news: schemas.NewsCreate):
    db_news = models.News(**news.model_dump())
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news


def update_news(db: Session, news_id: int, updated_news: schemas.NewsBase):
    news_to_update = db.query(models.News).filter(models.News.id == news_id).first()
    if news_to_update:
        for key, value in updated_news.model_dump(exclude_unset=True).items():
            setattr(news_to_update, key, value)
        db.commit()
        db.refresh(news_to_update)
        return news_to_update
    else:
        return None


def delete_news(db: Session, news_id: int):
    news_to_delete = db.query(models.News).filter(models.News.id == news_id).first()
    if news_to_delete:
        db.delete(news_to_delete)
        db.commit()
        return news_to_delete
    else:
        return None
    

def get_association(db: Session, user_id: int, event_id: int):
    return db.query(models.Association_user_event).filter(models.Association_user_event.user_id == user_id).filter(models.Association_user_event.event_id == event_id).first()


def create_association(db: Session, user_id: int, event_id: int, extra_data: dict):
    db_association = models.Association_user_event(user = get_user(db, user_id), event = get_event(db, event_id), extra_data = extra_data)
    db.add(db_association)
    db.commit()
    db.refresh(db_association)
    return db_association


def delete_association(db: Session, user_id: int, event_id: int):
    db_association = get_association(db, user_id, event_id)
    db.delete(db_association)
    db.commit()
    return db_association

def create_entry(db: Session, entry: schemas.EntryCreate):
    db_entry = models.Entry(**entry.model_dump())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def get_entry_by_description(db: Session, entry: schemas.EntryRead):
    return db.query(models.Entry).filter(models.Entry.time == entry.time).filter(models.Entry.action == entry.action).filter(models.Entry.user_id == entry.user_id).filter(models.Entry.event_id == entry.event_id).first()


def get_entry(db: Session, entry_id: int):
    return db.query(models.Entry).filter(models.Entry.id == entry_id).first()


def get_entries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Entry).offset(skip).limit(limit).all()


def delete_entry(db: Session, entry_id: int):
    db_entry = get_entry(db, entry_id)
    db.delete(db_entry)
    db.commit()
    return db_entry