from ..deps import *


def setup_module(module):
    db = SessionLocal()
    user = crud.get_user_by_username(db, 'some_username')
    if user:
        crud.delete_user(db, user.id)
    user = crud.get_user_by_username(db, 'another_username')
    if user:
        crud.delete_user(db, user.id)
    user = crud.get_user_by_username(db, 'username')
    if user:
        crud.delete_user(db, user.id)
    db.close()


def teardown_function(function):
    db = SessionLocal()
    user = crud.get_user_by_username(db, 'some_username')
    if user:
        crud.delete_user(db, user.id)
    user = crud.get_user_by_username(db, 'another_username')
    if user:
        crud.delete_user(db, user.id)
    user = crud.get_user_by_username(db, 'username')
    if user:
        crud.delete_user(db, user.id)
    db.close()





def test_as_organizer():
    id1 = client.post("/users", json = {
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
    assert id1
    r2 = client.put(f'/users/{id1}', headers=auth('super_user', '1'), json={
  "username": "username",
  "email": "email",
  "number": 666,
  "name": "name",
  "surname": "surname",
  "patronymic": "patronymic",
  "is_active": True,
  "birthday": "2025-05-02"
    })
    assert r2.status_code == 200
    assert r2.json() == {
  "username": "username",
  "email": "email",
  "number": 666,
  "name": "name",
  "surname": "surname",
  "patronymic": "patronymic",
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


def test_as_owner():
    id1 = client.post("/users", json = {
  "username": "some_username",
  "email": "some_email",
  "number": 666,
  "name": "some_name",
  "surname": "some_surname",
  "patronymic": "some_patronymic",
  "is_active": True,
  "birthday": "2025-05-02",
  "password": "some_password"
    }).json().get('id')
    r2 = client.put(f'/users/{id1}', headers=auth('some_username', 'some_password'), json={
  "username": "username",
  "email": "email",
  "number": 666,
  "name": "name",
  "surname": "surname",
  "patronymic": "patronymic",
  "is_active": True,
  "birthday": "2025-05-02"
    })
    assert r2.status_code == 200
    assert r2.json() == {
  "username": "username",
  "email": "email",
  "number": 666,
  "name": "name",
  "surname": "surname",
  "patronymic": "patronymic",
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


def test_as_another_user():
    client.post("/users", json = {
  "username": "another_username",
  "email": "another_email",
  "number": 666,
  "name": "another_name",
  "surname": "another_surname",
  "patronymic": "another_patronymic",
  "is_active": True,
  "birthday": "2025-05-02",
  "password": "another_password"
    })
    id1 = client.post("/users", json = {
  "username": "some_username",
  "email": "some_email",
  "number": 666,
  "name": "some_name",
  "surname": "some_surname",
  "patronymic": "some_patronymic",
  "is_active": True,
  "birthday": "2025-05-02",
  "password": "some_password"
    }).json().get('id')
    r2 = client.put(f'/users/{id1}', headers=auth('another_username', 'another_password'), json={
  "username": "username",
  "email": "email",
  "number": 666,
  "name": "name",
  "surname": "surname",
  "patronymic": "patronymic",
  "is_active": True,
  "birthday": "2025-05-02"
    })
    assert r2.status_code == 403
    assert r2.json() == {'detail': 'Forbidden'}


def test_access_read_user():
    r1 = client.post("/users", json = {
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
    assert r1.status_code == 200
    r2 = client.post("/users", json = {
  "username": "another_username",
  "email": "another_email",
  "number": 666,
  "name": "another_name",
  "surname": "another_surname",
  "patronymic": "another_patronymic",
  "is_active": True,
  "birthday": "2025-05-02",
  "password": "another_password"
    })
    assert r2.status_code == 200
    r3 = client.put(f"/users/give-global-access/{r2.json().get('id')}", headers=auth('super_user', '1'), json={
  "UserAccess": 1,
  "EventAccess": 0,
  "NewsAccess": 0,
  "CreateAccess": []
})
    assert r3.status_code == 200
    r4 = client.put(f"/users/{r1.json().get('id')}", headers=auth('another_username', 'another_password'), json={
  "username": "username",
  "email": "email",
  "number": 666,
  "name": "name",
  "surname": "surname",
  "patronymic": "patronymic",
  "is_active": True,
  "birthday": "2025-05-02"
    })
    assert r4.status_code == 403
    assert r4.json() == {'detail': 'Forbidden'}



def test_access_update_user():
    r1 = client.post("/users", json = {
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
    assert r1.status_code == 200
    r2 = client.post("/users", json = {
  "username": "another_username",
  "email": "another_email",
  "number": 666,
  "name": "another_name",
  "surname": "another_surname",
  "patronymic": "another_patronymic",
  "is_active": True,
  "birthday": "2025-05-02",
  "password": "another_password"
    })
    assert r2.status_code == 200
    r3 = client.put(f"/users/give-global-access/{r2.json().get('id')}", headers=auth('super_user', '1'), json={
  "UserAccess": 2,
  "EventAccess": 0,
  "NewsAccess": 0,
  "CreateAccess": []
})
    assert r3.status_code == 200
    r4 = client.put(f"/users/{r1.json().get('id')}", headers=auth('another_username', 'another_password'), json={
  "username": "username",
  "email": "email",
  "number": 666,
  "name": "name",
  "surname": "surname",
  "patronymic": "patronymic",
  "is_active": True,
  "birthday": "2025-05-02"
    })
    assert r4.status_code == 200
    assert r4.json() == {
  "username": "username",
  "email": "email",
  "number": 666,
  "name": "name",
  "surname": "surname",
  "patronymic": "patronymic",
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


def test_access_delete_user():
    r1 = client.post("/users", json = {
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
    assert r1.status_code == 200
    r2 = client.post("/users", json = {
  "username": "another_username",
  "email": "another_email",
  "number": 666,
  "name": "another_name",
  "surname": "another_surname",
  "patronymic": "another_patronymic",
  "is_active": True,
  "birthday": "2025-05-02",
  "password": "another_password"
    })
    assert r2.status_code == 200
    r3 = client.put(f"/users/give-global-access/{r2.json().get('id')}", headers=auth('super_user', '1'), json={
  "UserAccess": 3,
  "EventAccess": 0,
  "NewsAccess": 0,
  "CreateAccess": []
})
    assert r3.status_code == 200
    r4 = client.put(f"/users/{r1.json().get('id')}", headers=auth('another_username', 'another_password'), json={
  "username": "username",
  "email": "email",
  "number": 666,
  "name": "name",
  "surname": "surname",
  "patronymic": "patronymic",
  "is_active": True,
  "birthday": "2025-05-02"
    })
    assert r4.status_code == 200
    assert r4.json() == {
  "username": "username",
  "email": "email",
  "number": 666,
  "name": "name",
  "surname": "surname",
  "patronymic": "patronymic",
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


def test_without_headers():
    response = client.put("/users/1", json={
  "username": "username",
  "email": "email",
  "number": 666,
  "name": "name",
  "surname": "surname",
  "patronymic": "patronymic",
  "is_active": True,
  "birthday": "2025-05-02"
    })
    assert response.status_code == 401
    assert response.json() == {
  "detail": "Not authenticated"
}