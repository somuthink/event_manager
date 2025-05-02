from functools import wraps
from ..main import app
from fastapi.testclient import TestClient
from multipledispatch import dispatch
from ..deps import *

client = TestClient(app)

# def auth(username: str, password: str):
#     def decorator(f):
#         def wrapper():
#             token = client.post("/token", data={"grant_type": "password", "username": username, "password": password})
#             assert token.status_code == 200
#             f({"Authorization": f"Bearer {token.json().get('access_token')}"})
#         return wrapper
#     return decorator


def auth(username: str, password: str):
    token = client.post("/token", data={"grant_type": "password", "username": username, "password": password})
    return {"Authorization": f"Bearer {token.json().get('access_token')}"}

def db(f):
    @wraps
    def wrapper():
        db = SessionLocal()
        f(db)
        db.close()
    return wrapper