from ..deps import *


def setup_module(module):
    db = SessionLocal()
    user = crud.get_user_by_username(db, 'some_username')
    if user:
        crud.delete_user(db, user.id)
    db.close()

def setup_function(function):
    client.post("/users", json = {
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


def teardown_function(function):
    db = SessionLocal()
    user = crud.get_user_by_username(db, 'some_username')
    if user:
        crud.delete_user(db, user.id)
    db.close()




def test_organizer():
    res = False
    limit = 100
    skip = 0
    response2 = client.get(f"/users/?skip={skip}&limit={limit}", headers=auth('super_user', '1'))
    while response2.json():
        assert response2.status_code == 200
        if 'some_username' in [user.get('username') for user in response2.json()]:
            res = True
        skip += limit
        response2 = client.get(f"/users/?skip={skip}&limit={limit}", headers=auth('super_user', '1'))
    assert res


def test_not_organizer():
    limit = 100
    skip = 0
    response2 = client.get(f"/users/?skip={skip}&limit={limit}", headers=auth('some_username', 'some_password'))
    assert response2.status_code == 405
    assert response2.json() == {
  "detail": "Method Not Allowed"
}


def test_access_read_user():
    r1 = client.get('/users/me/', headers=auth('some_username', 'some_password'))
    assert r1.status_code == 200
    r2 = client.put(f"/users/give-global-access/{r1.json().get('id')}", headers=auth('super_user', '1'), json={
  "UserAccess": 1,
  "EventAccess": 0,
  "NewsAccess": 0,
  "CreateAccess": []
})
    assert r2.status_code == 200
    res = False
    limit = 100
    skip = 0
    r3 = client.get(f"/users/?skip={skip}&limit={limit}", headers=auth('some_username', 'some_password'))
    while r3.json():
        assert r3.status_code == 200
        if 'some_username' in [user.get('username') for user in r3.json()]:
            res = True
        skip += limit
        r3 = client.get(f"/users/?skip={skip}&limit={limit}", headers=auth('some_username', 'some_password'))
    assert res


def test_access_update_user():
    r1 = client.get('/users/me/', headers=auth('some_username', 'some_password'))
    assert r1.status_code == 200
    r2 = client.put(f"/users/give-global-access/{r1.json().get('id')}", headers=auth('super_user', '1'), json={
  "UserAccess": 2,
  "EventAccess": 0,
  "NewsAccess": 0,
  "CreateAccess": []
})
    assert r2.status_code == 200
    res = False
    limit = 100
    skip = 0
    r3 = client.get(f"/users/?skip={skip}&limit={limit}", headers=auth('some_username', 'some_password'))
    while r3.json():
        assert r3.status_code == 200
        if 'some_username' in [user.get('username') for user in r3.json()]:
            res = True
        skip += limit
        r3 = client.get(f"/users/?skip={skip}&limit={limit}", headers=auth('some_username', 'some_password'))
    assert res


def test_access_delete_user():
    r1 = client.get('/users/me/', headers=auth('some_username', 'some_password'))
    assert r1.status_code == 200
    r2 = client.put(f"/users/give-global-access/{r1.json().get('id')}", headers=auth('super_user', '1'), json={
  "UserAccess": 3,
  "EventAccess": 0,
  "NewsAccess": 0,
  "CreateAccess": []
})
    assert r2.status_code == 200
    res = False
    limit = 100
    skip = 0
    r3 = client.get(f"/users/?skip={skip}&limit={limit}", headers=auth('some_username', 'some_password'))
    while r3.json():
        assert r3.status_code == 200
        if 'some_username' in [user.get('username') for user in r3.json()]:
            res = True
        skip += limit
        r3 = client.get(f"/users/?skip={skip}&limit={limit}", headers=auth('some_username', 'some_password'))
    assert res


def test_without_headers():
    response = client.get("/users?skip=0&limit=100")
    assert response.status_code == 401
    assert response.json() == {
  "detail": "Not authenticated"
}