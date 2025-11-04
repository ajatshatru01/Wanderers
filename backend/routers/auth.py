from fastapi import APIRouter, HTTPException, Depends
from models import UserSignup, UserLogin
from database import get_db
import asyncpg

router = APIRouter()

@router.post("/signup")
async def signup(user: UserSignup, db = Depends(get_db)):
    try:
        new_user = await db.fetchrow(
            "INSERT INTO users (username, password, role) VALUES ($1, $2, 'guest') RETURNING id, username, role",
            user.username, user.password
        )
        return dict(new_user)
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=400, detail="Username already exists")

@router.post("/login")
async def login(credentials: UserLogin, db = Depends(get_db)):
    try:
        user = await db.fetchrow(
            "SELECT id, username, role FROM users WHERE username = $1 AND password = $2",
            credentials.username, credentials.password
        )
    except:
        raise HTTPException(status_code=500)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid Username Or Password")

    return dict(user)