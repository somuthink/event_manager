from pydantic import BaseModel
from sqlalchemy.dialects.postgresql import JSONB, insert
from datetime import datetime, timezone


class EventBase(BaseModel):
    title: str
    description: str | None = None
    theme: str | None = None
    structure: dict

class EventCreate(EventBase):
    pass


class UpdateEvent(EventBase):
    pass


class Event(EventBase):
    id: int


class NewsBase(BaseModel):
    title: str
    description: str | None = None


class NewsCreate(NewsBase):
    pass


class UpdateNews(NewsBase):
    pass

class News(NewsBase):
    id: int

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class UserBase(BaseModel):
    username: str
    email: str | None = None
    number: int | None = None
    name: str | None = None
    surname: str | None = None
    patronymic: str | None = None
    is_active: bool | None = None


class User(UserBase):
    id: int
    is_organizer: bool | None = None

class UpdateUser(UserBase):
    pass


class UserCreate(UserBase):
    password: str

class UserInDB(User):
    id: int
    hashed_password: str | None = None


class Association_user(BaseModel):
    extra_data: dict | None = None
    user: User


class Association_event(BaseModel):
    extra_data: dict | None = None
    event: Event


class Association(BaseModel):
    extra_data: dict | None = None
    user: User
    event: Event


class EntryBase(BaseModel):
    action: str
    time: datetime

class EntryCreate(EntryBase):
    user_id: int
    event_id: int

class Entry(EntryBase):
    id: int
    user: User
    event: Event

class EntryDelete(EntryBase):
    user_id: int
    event_id: int


class EntryRead(EntryBase):
    user_id: int
    event_id: int

class EntryInDB(EntryBase):
    id: int
    user_id: int
    event_id: int
    user: User
    event: Event