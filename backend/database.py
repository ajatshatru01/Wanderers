import asyncpg
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from fastapi import FastAPI

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
db_pool = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_pool
    db_pool = await asyncpg.create_pool(DATABASE_URL, min_size=5, max_size=20)
    print("✅ Database connected")
    yield
    await db_pool.close()
    print("❌ Database disconnected")

async def get_db():
    async with db_pool.acquire() as connection:
        yield connection