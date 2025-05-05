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



def test_create_user():
    response = client.post("/users", json = {
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
    assert response.status_code == 200
    json = response.json()
    id = json.get("id")
    json.pop("id")
    json.pop("hashed_password")
    assert json == {
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
    assert client.get(f"/users/{id}", headers=auth("some_username", "some_password")).status_code == 200


def test_create_existed_user():
    id = client.post("/users", json = {
  "username": "some_username",
  "email": "some_email",
  "number": 666,
  "name": "some_name",
  "surname": "some_surname",
  "patronymic": "some_patronymic",
  "is_active": True,
  "birthday": "2025-05-02",
  "password": "some_password"
    }).json().get("id")
    response = client.post("/users", json = {
  "username": "some_username",
  "email": "another_email",
  "number": 666,
  "name": "another_name",
  "surname": "another_surname",
  "patronymic": "another_patronymic",
  "is_active": True,
  "birthday": "2025-05-02",
  "password": "another_password"
    })
    assert response.status_code == 404
    assert response.json() == {
  "detail": "Username already exists"
}


def test_empty_password():
    response = client.post("/users", json = {
  "username": "some_username",
  "email": "some_email",
  "number": 666,
  "name": "some_name",
  "surname": "some_surname",
  "patronymic": "some_patronymic",
  "is_active": True,
  "birthday": "2025-05-02",
  "password": ""
    })
    assert response.status_code == 404
    assert response.json() == {
  "detail": "Password should be not empty"
}


def test_empty_username():
    response = client.post("/users", json = {
  "username": "",
  "email": "some_email",
  "number": 666,
  "name": "some_name",
  "surname": "some_surname",
  "patronymic": "some_patronymic",
  "is_active": True,
  "birthday": "2025-05-02",
  "password": "some_password"
    })
    assert response.status_code == 404
    assert response.json() == {
  "detail": "Username should be not empty"
}