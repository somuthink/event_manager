from typing import Annotated
from fastapi import Depends, HTTPException
from .database import SessionLocal
from sqlalchemy.orm import Session
from functools import wraps
from . import schemas
from . import security
# from enum import Enum
from sqlalchemy import Enum


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
                    raise HTTPException(status_code=405)
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