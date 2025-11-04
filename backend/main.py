from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import lifespan
from routers import auth, bookings, dashboard, packages, reviews, staff
import uvicorn
import os

app = FastAPI(title="Travel Agency Management API", lifespan=lifespan)

# Allow frontend connection (set FRONTEND_URL in your .env)
origins = [os.getenv("FRONTEND_URL", "*")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(packages.router, prefix="/packages", tags=["Packages"])
app.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
app.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
app.include_router(staff.router, prefix="/staff", tags=["Staff"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])

# Root route
@app.get("/")
def root():
    return {"message": "Travel Agency Management API", "status": "running"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
