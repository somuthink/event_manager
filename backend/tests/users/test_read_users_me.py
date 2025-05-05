from ..deps import *


def setup_module(module):
    db = SessionLocal()
    user = crud.get_user_by_username(db, 'some_username')
    if user:
        crud.delete_user(db, user.id)
    db.close()


def teardown_function(function):
    db = SessionLocal()
    user = crud.get_user_by_username(db, 'some_username')
    if user:
        crud.delete_user(db, user.id)
    db.close()




def test_read_super_user():
    response = client.get("/users/me/", headers=auth("super_user", "1"))
    assert response.status_code == 200


def test_read_myself():
    response1 = client.post("/users", json = {
  "username": "some_username",
  "email": "some_email",
  "number": 666,
  "name": "some_name",
  "surname": "some_surname",
  "patronymic": "some_patronymic",
  "is_active": True,
  "birthday": "2025-05-02",
  "password": "some_password"
    })
    assert response1.status_code == 200
    response2 = client.get("/users/me/", headers=auth('some_username', 'some_password'))
    assert response2.status_code == 200
    json2 = response2.json()
    id2 = json2.get("id")
    json2.pop("id")
    json2.pop("hashed_password")
    assert json2 == {
  "username": "some_username",
  "email": "some_email",
  "number": 666,
  "name": "some_name",
  "surname": "some_surname",
  "patronymic": "some_patronymic",
  "is_active": True,
  "birthday": "2025-05-02",
  "is_organizer": False,
  "UserAccess": -1,
  "EventAccess": 1,
  "NewsAccess": 1,
  "CreateAccess": [],
  "local_event_access": [],
  "local_news_access": [],
  "access_by_tag": [],
  "templates": None
}

def test_incorrect_username_or_password():
    response = client.get("users/me/", headers=auth('some_username', 'some_password'))
    assert response.status_code == 401
    assert response.json() == {'detail': 'Could not validate credentials'}


def test_without_headers():
    response = client.get("/users/me/")
    assert response.status_code == 401
    assert response.json() == {
  "detail": "Not authenticated"
}