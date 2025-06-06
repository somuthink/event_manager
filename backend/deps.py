from typing import Annotated
from fastapi import Depends, HTTPException
from .database import SessionLocal
from sqlalchemy.orm import Session
from functools import wraps
from . import schemas
from . import security
from . import crud
# from . import models
# from enum import Enum
from sqlalchemy import Enum
# from pydantic import TypeAdapter


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

SessionDep = Annotated[Session, Depends(get_db)]

UserDep = Annotated[schemas.UserInDB, Depends(security.get_current_active_user)]

class Access(Enum):
    CREATE = 0
    READ = 1
    UPDATE = 2
    DELETE = 3
class Model(Enum):
    USER = 0
    EVENT = 1
    NEWS = 2
class Right:
    def __init__(self, access: Access, model: Model):
        self.access = access
        self.model = model
    access: Access
    model: Model


def check(rights: list[Right]):
    def decorator(handler):
        @wraps(handler)
        def wrapper(*args, **kwargs):
            user = kwargs.get('user')
            if user.is_organizer:
                return handler(*args, **kwargs)
            else:
                user_rights = [user.UserAccess, user.EventAccess, user.NewsAccess]
                for right in rights:
                    if right.access == Access.CREATE:
                        if right.model in user.CreateAccess:
                            return handler(*args, **kwargs)
                    elif user_rights[right.model] >= right.access:
                        return handler(*args, **kwargs)
                else:
                    user_rights = [None, user.local_event_access, user.local_news_access]
                    atrs = [None, 'event_id', 'news_id']
                    entity_ids = [None, (lambda x: x[0] if x else None)([x for x in [kwargs.get("event_id"), kwargs.get("entry").event_id if kwargs.get("entry") is not None else None] if x is not None]), kwargs.get('news_id')]
                    for right in rights:
                        if right.model != Model.USER and entity_ids[right.model] in [local_access.__dict__.get(atrs[right.model]) for local_access in user_rights[right.model] if local_access.level >= right.access]:
                            return handler(*args, **kwargs)
                    else:
                        user_rights_by_tags = user.access_by_tag
                        atrs = [None, 'access_level_to_events', 'access_level_to_news']
                        entities = [None, crud.get_event, crud.get_news]
                        for right in rights:
                            if right.model != Model.USER and [access_by_tag for access_by_tag in user_rights_by_tags if (access_by_tag.__dict__.get(atrs[right.model]) >= right.access and access_by_tag in entities[right.model](kwargs.get('db'), entity_ids[right.model]).tags if right.model == 1 else sum(list(map(lambda x: x.tags, entities[right.model](kwargs.get('db'), entity_ids[right.model]).events)), []))]:
                                return handler(*args, **kwargs)
                        raise HTTPException(status_code=403)
        return wrapper
    return decorator

def owner_or_check(rights: list[Right]):
    def decorator(handler):
        @wraps(handler)
        def wrapper(*args, **kwargs):
            user = kwargs.get('user')
            user_id = kwargs.get('user_id')
            if user.id == user_id:
                return handler(*args, **kwargs)
            else:
                return check(rights)(handler)(*args, **kwargs)
        return wrapper
    return decorator