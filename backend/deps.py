from typing import Annotated
from fastapi import Depends, HTTPException
from .database import SessionLocal
from sqlalchemy.orm import Session
from functools import wraps
from . import schemas
from . import security
import enum
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
    VIEW = 1
    CHANGE = 2
    DELETE = 3
class CRUDAccess(Enum):
    CREATE = 0
    VIEW = 1
    CHANGE = 2
    DELETE = 3
class Model(Enum):
    USER = 0
    EVENT = 1
    NEWS = 2
class Right(schemas.BaseModel):
    def __init__(self, access: CRUDAccess, model: Model):
        self.access = access
        self.model = model
    access: CRUDAccess
    model: Model


def check_right(right: Right):
    def isorganizer(handler):
        @wraps(handler)
        def wrapper(*args, **kwargs):
            user = kwargs.get('user')
            if user.is_organizer:
                return handler(*args, **kwargs)
            else:
                user_rights = [user.GlobalUserAccess, user.GlobalEventAccess, user.GlobalNewsAccess]
                if right.access == CRUDAccess.CREATE:
                    if right.model in user.CreateAccess:
                        return handler(*args, **kwargs)
                    else:
                        raise HTTPException(status_code=405)
                elif user_rights[right.model] >= right.access:
                    return handler(*args, **kwargs)
                else:
                    raise HTTPException(status_code=405)
        return wrapper
    return isorganizer


def owner_or_check_right(right: Right):
    def owner_or_organizer(handler):
        @wraps(handler)
        def wrapper(*args, **kwargs):
            user = kwargs.get('user')
            user_id = kwargs.get('user_id')
            if user.id == user_id:
                return handler(*args, **kwargs)
            else:
                return check_right(right)(handler)(*args, **kwargs)
        return wrapper
    return owner_or_organizer