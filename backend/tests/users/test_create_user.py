from ..deps import *

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
  "tamplates": None
  }
    response = client.delete(f"/users/{id}", headers=auth("super_user", "1"))
    assert response.status_code == 200


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
  "detail": "Username already exists"
}
    response = client.delete(f"/users/{id}", headers=auth("super_user", "1"))
    assert response.status_code == 200