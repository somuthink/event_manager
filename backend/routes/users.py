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


@router.get("/", response_model=list[schemas.UserInDB])
@check([Right(Access.READ, Model.USER)])
def read_users(user: UserDep, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip, limit)
    return users


@router.get("/{user_id}", response_model=schemas.User)
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


@router.put("/give-global-access/{user_id}")
@check([])
def give_global_access(user: UserDep, global_access: schemas.AccessSchema, user_id: int, db: Session = Depends(get_db)):
    db_user = crud.update_user(db, user_id, global_access)
    if db_user is None:
        raise HTTPException(404, "Could not update")
    
    return {"message": "User successfully Deleted", "data": db_user}


@router.post("/give-local-access/{user_id}")
@check([])
def give_local_access(user: UserDep, local_access: schemas.RightSchema, user_id: int, entity_id: int, db: Session = Depends(get_db)):
    actions = [[], [crud.get_event, crud.get_access_event_association, crud.create_access_event_association], [crud.get_news, crud.get_access_news_association, crud.create_access_news_association]]
    if crud.get_user(db, user_id) is None or actions[local_access.model][0](db, entity_id) is None:
        raise HTTPException(status_code=404, detail=f"{['', 'Event', 'News'][local_access.model]} or User Not Found")
    elif actions[local_access.model][1](db, user_id, entity_id):
        raise HTTPException(status_code=400, detail="Access already exist")
    else:
        return actions[local_access.model][2](db, user_id, entity_id, local_access.access)


@router.delete("/delete-local-access/{user_id}")
@check([])
def delete_local_access(user: UserDep, model: int, user_id: int, entity_id: int, db: Session = Depends(get_db)):
    actions = [[], [crud.get_event, crud.get_access_event_association, crud.delete_access_event_association], [crud.get_news, crud.get_access_news_association, crud.delete_access_news_association]]
    db_user = crud.get_user(db, user_id)
    db_entity = actions[model][0](db, entity_id)
    if db_user is None or db_entity is None:
        raise HTTPException(status_code=404, detail=f"{['', 'Event', 'News'][model]} or User Not Found")
    elif not actions[model][1](db, user_id, entity_id):
        raise HTTPException(status_code=400, detail="Relation doesnt exist")
    else:
        return actions[model][2](db, user_id, entity_id)