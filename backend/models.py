from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table, DateTime, Date, ARRAY
from sqlalchemy import Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB, insert
from datetime import datetime, timezone

from .database import Base
# from .deps import *

class Entry(Base):
    __tablename__ = "timepad"
    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey("users.id"))
    user = relationship("User")
    event_id = Column(ForeignKey("events.id"))
    event = relationship("Event")
    action = Column(String)
    time = Column(DateTime, default=datetime.now(timezone.utc))


class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True)
    name = Column(String, index=True, unique=True)
    events = relationship("Event", secondary="tag_table", back_populates="tags")

tag_table = Table(
    "tag_table", Base.metadata,
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
    Column("event_id", ForeignKey("events.id"), primary_key=True),
)


class Association_user_event(Base):
    __tablename__ = "association_user_event"
    user_id = Column(ForeignKey("users.id"), primary_key=True)
    event_id = Column(ForeignKey("events.id"), primary_key=True)
    extra_data = Column(JSONB)
    user = relationship("User", back_populates="events")
    event = relationship("Event", back_populates="members")


class Association_event_news(Base):
    __tablename__ = "association_event_news"
    event_id = Column(ForeignKey("events.id"), primary_key=True)
    news_id = Column(ForeignKey("news.id"), primary_key=True)


class Access_event(Base):
    __tablename__ = "access_event_table"
    user_id = Column(ForeignKey("users.id"), primary_key=True)
    event_id = Column(ForeignKey("events.id"), primary_key=True)
    level = Column(Integer)
    user = relationship("User", back_populates="local_event_access")
    event = relationship("Event")


class Access_news(Base):
    __tablename__ = "access_news_table"
    user_id = Column(ForeignKey("users.id"), primary_key=True)
    news_id = Column(ForeignKey("news.id"), primary_key=True)
    level = Column(Integer)
    user = relationship("User", back_populates="local_news_access")
    news = relationship("News")


class Access_by_tag(Base):
    __tablename__ = "access_by_tag_table"
    user_id = Column(ForeignKey("users.id"), primary_key=True)
    tag_id = Column(ForeignKey("tags.id"), primary_key=True)
    access_level_to_events = Column(Integer)
    access_level_to_news = Column(Integer)
    user = relationship("User", back_populates="access_by_tag")
    tag = relationship("Tag")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    email = Column(String, nullable=True)
    number = Column(Integer, nullable=True)
    name = Column(String, nullable=True)
    surname = Column(String, nullable=True)
    patronymic = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_organizer = Column(Boolean, default=False)
    birthday = Column(Date)
    UserAccess = Column(Integer, default=-1)
    EventAccess = Column(Integer, default=1)
    NewsAccess = Column(Integer, default=1)
    CreateAccess = Column(ARRAY(Integer), default=[])
    events = relationship("Association_user_event", back_populates="user")
    entries = relationship("Entry", back_populates="user")
    local_event_access = relationship("Access_event", back_populates="user")
    local_news_access = relationship("Access_news", back_populates="user")
    access_by_tag = relationship("Access_by_tag", back_populates="user")
    tamplates = Column(ARRAY(JSONB))


class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    description = Column(String)
    theme = Column(String)
    image = Column(String)
    address = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    tags = relationship("Tag", secondary="tag_table", back_populates="events")
    structure = Column(JSONB)
    members = relationship("Association_user_event", back_populates="event")
    news = relationship("News", secondary="association_event_news", back_populates="events")
    entries = relationship("Entry", back_populates="event")


class News(Base):
    __tablename__ = "news"
    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    description = Column(String)
    image = Column(String)
    structure = Column(JSONB)
    events = relationship("Event", secondary="association_event_news", back_populates="news")