from pydantic import BaseModel
from sqlalchemy.dialects.postgresql import JSONB, insert
from datetime import datetime, timezone, date


class Access_event_schema(BaseModel):
    level: int
    event_id: int


class Access_news_schema(BaseModel):
    level: int
    news_id: int


class Tag(BaseModel):
    name: str


class EventBase(BaseModel):
    title: str | None = None
    description: str | None = None
    theme: str | None = None
    image: str
    address: str
    start_time: datetime
    end_time: datetime
    tags: list[Tag]

class EventRead(EventBase):
    id: int


class EventCreate(EventBase):
    structure: dict


class UpdateEvent(EventBase):
    structure: dict | None = None


class Event(EventBase):
    structure: dict
    id: int


class NewsBase(BaseModel):
    title: str | None = None
    description: str | None = None
    image: str


class NewsRead(NewsBase):
    id: int


class NewsCreate(NewsBase):
    structure: dict


class UpdateNews(NewsBase):
    structure: dict | None = None

class News(NewsBase):
    structure: dict
    id: int

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class UserBase(BaseModel):
    username: str | None
    email: str | None = None
    number: int | None = None
    name: str | None = None
    surname: str | None = None
    patronymic: str | None = None
    is_active: bool | None = None
    birthday: date | None = None

class User(UserBase):
    is_organizer: bool | None = None
    UserAccess: int | None
    EventAccess: int | None
    NewsAccess: int | None
    CreateAccess: list[int] | None
    local_event_access: list[Access_event_schema] | None
    local_news_access: list[Access_news_schema] | None
    tamplates: list[dict] | None

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


class AccessSchema(BaseModel):
    UserAccess: int | None
    EventAccess: int | None
    NewsAccess: int | None
    CreateAccess: list[int] | None = set()


class RightSchema(BaseModel):
    access: int
    model: int

