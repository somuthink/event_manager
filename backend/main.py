from fastapi import FastAPI
from .routes import events, users, news, relationships, timepad, files
from fastapi.staticfiles import StaticFiles
from . import models, database
from . import security
from .deps import *


models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

for route in [events, users, security, news, relationships, timepad, files]:
    app.include_router(route.router)

app.mount("/static", StaticFiles(directory="static"), name="static")