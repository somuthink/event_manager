import os
from typing import Optional
from sqlalchemy import or_, case
from fastapi import Query, UploadFile
from multipledispatch import dispatch
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from . import models, schemas

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


def update_user(db: Session, user_id: int, updated_user: schemas.User):
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

def get_events(
        db: Session,
        q: str | None = None,
        skip: int = 0,
        limit: int = 100,
):
    query = db.query(models.Event)

    if q:
        title_match = models.Event.title.ilike(f"%{q}%")
        desc_match = models.Event.description.ilike(f"%{q}%")

        query = query.filter(or_(title_match, desc_match)).order_by(
            case(
                    (title_match, 0),  
                    (desc_match, 1),  
                    else_=2
            )
        )

    return query.order_by(models.Event.start_time.asc()).offset(skip).limit(limit).all()


def get_event_by_title(db: Session, title: str):
    return db.query(models.Event).filter(models.Event.title == title).first()


def create_event(db: Session, event: schemas.EventCreate):
    data = event.model_dump()
    data.pop("tags")
    db_event = models.Event(**data)
    db.add(db_event)
    db_event.tags = [get_tag(db, tag.name) for tag in event.tags]
    db.commit()
    db.refresh(db_event)
    return db_event


def update_event(db: Session, event_id: int, updated_event: schemas.EventBase):
    event_to_update = db.query(models.Event).filter(models.Event.id == event_id).first()
    if event_to_update:
        data = updated_event.model_dump(exclude_unset=True)
        data.pop("tags")
        event_to_update.tags = [get_tag(db, tag.name) for tag in updated_event.tags]
        for key, value in data.items():
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

def get_news(db: Session, news_id: int):
    return db.query(models.News).filter(models.News.id == news_id).first()


def get_news_list(db: Session, q: str | None = None, skip: int = 0, limit: int = 100):
    query = db.query(models.News)

    if q:
        title_match = models.News.title.ilike(f"%{q}%")
        desc_match = models.News.description.ilike(f"%{q}%")

        query = query.filter(or_(title_match, desc_match)).order_by(
            case(
                (title_match, 0),
                (desc_match, 1),
                else_=2
            )
        )

    return query.order_by(models.News.id.desc()).offset(skip).limit(limit).all()


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




def get_access_event_association(db: Session, user_id: int, event_id: int):
    return db.query(models.Access_event).filter(models.Access_event.user_id == user_id).filter(models.Access_event.event_id == event_id).first()


def create_access_event_association(db: Session, user_id: int, event_id: int, level: int):
    db_association = models.Access_event(user = get_user(db, user_id), event = get_event(db, event_id), level = level)
    db.add(db_association)
    db.commit()
    db.refresh(db_association)
    return db_association


def delete_access_event_association(db: Session, user_id: int, event_id: int):
    db_association = get_access_event_association(db, user_id, event_id)
    db.delete(db_association)
    db.commit()
    return db_association



def get_access_news_association(db: Session, user_id: int, news_id: int):
    return db.query(models.Access_news).filter(models.Access_news.user_id == user_id).filter(models.Access_news.news_id == news_id).first()


def create_access_news_association(db: Session, user_id: int, news_id: int, level: int):
    db_association = models.Access_news(user = get_user(db, user_id), news = get_news(db, news_id), level = level)
    db.add(db_association)
    db.commit()
    db.refresh(db_association)
    return db_association


def delete_access_news_association(db: Session, user_id: int, news_id: int):
    db_association = get_access_news_association(db, user_id, news_id)
    db.delete(db_association)
    db.commit()
    return db_association



def get_access_tag_association(db: Session, user_id: int, tag_id: int):
    return db.query(models.Access_news).filter(models.Access_by_tag.user_id == user_id).filter(models.Access_by_tag.tag_id == tag_id).first()


def create_access_tag_association(db: Session, user_id: int, tag_id: int, access_level_to_events: int, access_level_to_news: int):
    db_association = models.Access_by_tag(user = get_user(db, user_id), tag = get_tag(db, tag_id), access_level_to_events = access_level_to_events, access_level_to_news = access_level_to_news)
    db.add(db_association)
    db.commit()
    db.refresh(db_association)
    return db_association


def delete_access_tag_association(db: Session, user_id: int, tag_id: int):
    db_association = get_access_tag_association(db, user_id, tag_id)
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


@dispatch(Session, str)
def get_tag(db: Session, name: str):
    return db.query(models.Tag).filter(models.Tag.name == name).first()


@dispatch(Session, int)
def get_tag(db: Session, tag_id):
    return db.query(models.Tag).filter(models.Tag.id == tag_id).first()


def get_tags(db: Session):
    return db.query(models.Tag).all()


def create_tag(db: Session, name: str):
    db_tag = models.Tag(name = name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag


def delete_tag(db: Session, name: str):
    db_tag = get_tag(db, name)
    db.delete(db_tag)
    db.commit()
    return db_tag

def create_images(files: list[UploadFile] | None = None):
    # Создаем путь к директории
    dir_path = f"files/"

    saved_files = []
    if not os.path.isdir(dir_path):
        os.mkdir(dir_path)
        
    # Сохраняем каждый файл
    for i, file_data in enumerate(files, 1):
        try:
            # Генерируем уникальное имя файла
            # file_name = file_data.filename
            file_path = os.path.join(dir_path, file_data.filename)
            
            # Сохраняем файл на диск
            with open(file_path, "wb") as buffer:
                buffer.write(file_data.file.read())
                
            saved_files.append(file_path)
            
        except Exception as e:
            # Удаляем созданные файлы при ошибке
            for file_for_delete in saved_files:
                os.remove(file_for_delete)
            raise RuntimeError(f"Failed to save file {file_data.filename}: {str(e)}") from e
        
        # os.path.splitext(file_data.filename)[1]
