from fastapi import Depends, HTTPException, Request, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.routing import APIRouter
from fastapi.templating import Jinja2Templates
from fastapi.responses import Response, FileResponse
from fastapi import Form
import os

from .. import crud, schemas
from ..deps import *

router = APIRouter(prefix="/files")

@router.post("/", response_class=Response)
@check([])
def upload_files(user: UserDep, files: list[UploadFile]):
    crud.create_images(files)
    return Response(status_code=200)


@router.get("/", response_class=FileResponse)
def download_file(filename: str):
    if not os.path.isfile(f"files/{filename}"):
        raise HTTPException(status_code=404, detail="File Not Found")
    else:
        return FileResponse(path=f"files/{filename}", filename=f"{filename}")


@router.delete("/", response_class=Response)
@check([])
def delete_file(user: UserDep, filename: str):
    if not os.path.isfile(f"files/{filename}"):
        raise HTTPException(status_code=404, detail="File Not Found")
    else:
        os.remove(f"files/{filename}")
        return Response(status_code=200)