from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class UserSignup(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class PackageCreate(BaseModel):
    type: str
    name: str
    price: int
    slot: int
    location: str
    duration: int

class PackageUpdate(BaseModel):
    type: Optional[str] = None
    name: Optional[str] = None
    price: Optional[int] = None
    slot: Optional[int] = None
    location: Optional[str] = None
    duration: Optional[int] = None

class PackageSearch(BaseModel):
    date: date
    total_people: int
    type: Optional[str] = None
    location: Optional[str] = None


class BookingCreate(BaseModel):
    user_id: int
    package_id: int
    total_people: int
    date: Optional[date]= None

class StaffCreate(BaseModel):
    name: str
    role: str
    phone: str
    

class StaffUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None

class ReviewCreate(BaseModel):
    user_id: int
    package_id: int
    rating: int = Field(..., ge=1, le=5, description="Rating between 1 and 5")
    comment: str