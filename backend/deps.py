from typing import Annotated
from fastapi import Depends, HTTPException
from .database import SessionLocal
from sqlalchemy.orm import Session
from functools import wraps
from . import schemas
from . import security


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

SessionDep = Annotated[Session, Depends(get_db)]

UserDep = Annotated[schemas.UserInDB, Depends(security.get_current_active_user)]

def organizer(handler):
    @wraps(handler)
    def wrapper(*args, **kwargs):
        user = kwargs.get('user')
        if user.is_organizer:
            return handler(*args, **kwargs)
        else:
            raise HTTPException(status_code=405)
    return wrapper

def owner_or_organizer(handler):
    @wraps(handler)
    def wrapper(*args, **kwargs):
        user = kwargs.get('user')
        user_id = kwargs.get('user_id')
        if user.is_organizer or user.id == user_id:
            return handler(*args, **kwargs)
        else:
            raise HTTPException(status_code=405)
    return wrapper
