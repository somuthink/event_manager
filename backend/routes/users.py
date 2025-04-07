from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.routing import APIRouter

from .. import crud, schemas
from ..deps import *

router = APIRouter(prefix="/users")


@router.post("/", response_model=schemas.UserInDB)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=404, detail="Username already exists")
    else:
        return crud.create_user(db, user)


@router.get("/", response_model=list[schemas.User])
@check([Right(Access.READ, Model.USER)])
def read_users(user: UserDep, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip, limit)
    return users


@router.get("/{user_id}", response_model=schemas.UserBase)
def read_user(user: UserDep, user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User Not Found")
    return db_user


@router.put("/{user_id}")
def update_user(user: UserDep, 
    user_id: int, updated_user: schemas.UpdateUser, db: Session = Depends(get_db)
):
    db_user = crud.update_user(db, user_id, updated_user)
    if db_user is None:
        raise HTTPException(404, "Could not update")
    return {"message": "User record successfully Updated", "data": db_user}


@router.delete("/{user_id}")
def delete_user(user: UserDep, user_id: int, db: Session = Depends(get_db)):
    db_user = crud.delete_user(db, user_id)
    if db_user is None:
        raise HTTPException(404, "User Not Found")
    return {"message": "User successfully Deleted", "data": db_user}


@router.get("/me/", response_model=schemas.UserInDB)
async def read_users_me(
    current_user: UserDep,
):
    return current_user


@router.put("/give-right/{user_id}")
def give_right(rights: list[schemas.RightSchema], user_id: int, db: Session = Depends(get_db)):
    user_to_update = crud.get_user(db, user_id)
    if user_to_update:
        for right in rights:
            for key, value in right.model_dump(exclude_unset=True).items():
                setattr(user_to_update, key, value)
        db.commit()
        db.refresh(user_to_update)
        return user_to_update
    else:
        raise HTTPException(404, "Could not update")