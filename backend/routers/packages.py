from fastapi import APIRouter, Depends, Query, HTTPException
from models import PackageCreate, PackageUpdate, PackageSearch
from database import get_db
from typing import Optional
import asyncpg

router = APIRouter()

# ✅ Search packages (by type, location, price, and availability)
@router.post("/search")
async def search_packages(search: PackageSearch, db=Depends(get_db)):
    """
    Search for travel packages by date, type, location, or total people.
    Uses slot availability to determine if enough spots are open.
    """
    query = "SELECT * FROM packages WHERE slot >= $1"
    params = [search.total_people]

    if search.type:
        params.append(search.type)
        query += f" AND LOWER(type) = LOWER(${len(params)})"

    if search.location:
        params.append(search.location)
        query += f" AND LOWER(location) = LOWER(${len(params)})"

    query += " ORDER BY price"

    packages = await db.fetch(query, *params)
    return [dict(package) for package in packages]


# ✅ Get available packages (simple filter by price/type/location)
@router.get("/available")
async def get_available_packages(
    price: Optional[int] = Query(None),
    type: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    db=Depends(get_db)
):
    query = "SELECT * FROM packages WHERE slot > 0"
    params = []

    if price is not None:
        params.append(price)
        query += f" AND price <= ${len(params)}"

    if type is not None:
        params.append(type)
        query += f" AND LOWER(type) = LOWER(${len(params)})"

    if location is not None:
        params.append(location)
        query += f" AND LOWER(location) = LOWER(${len(params)})"

    query += " ORDER BY id"
    packages = await db.fetch(query, *params)
    return [dict(package) for package in packages]


# ✅ Get all packages
@router.get("/")
async def get_all_packages(db=Depends(get_db)):
    packages = await db.fetch("SELECT * FROM packages ORDER BY id")
    return [dict(package) for package in packages]


# ✅ Create new package
@router.post("/")
async def create_package(package: PackageCreate, db=Depends(get_db)):
    try:
        new_package = await db.fetchrow(
            """
            INSERT INTO packages (type, name, price, slot, location, duration)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            """,
            package.type, package.name, package.price, package.slot,
            package.location, package.duration
        )
        return dict(new_package)
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=400, detail="Package Already Exists!")


# ✅ Update existing package
@router.put("/{package_id}")
async def update_package(package_id: int, package_update: PackageUpdate, db=Depends(get_db)):
    try:
        update_fields = []
        params = []
        param_count = 1

        if package_update.type is not None:
            update_fields.append(f"type = ${param_count}")
            params.append(package_update.type)
            param_count += 1

        if package_update.name is not None:
            update_fields.append(f"name = ${param_count}")
            params.append(package_update.name)
            param_count += 1

        if package_update.price is not None:
            update_fields.append(f"price = ${param_count}")
            params.append(package_update.price)
            param_count += 1

        if package_update.slot is not None:
            update_fields.append(f"slot = ${param_count}")
            params.append(package_update.slot)
            param_count += 1

        if package_update.location is not None:
            update_fields.append(f"location = ${param_count}")
            params.append(package_update.location)
            param_count += 1

        if package_update.duration is not None:
            update_fields.append(f"duration = ${param_count}")
            params.append(package_update.duration)
            param_count += 1

        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        params.append(package_id)
        query = f"UPDATE packages SET {', '.join(update_fields)} WHERE id = ${param_count} RETURNING *"

        updated_package = await db.fetchrow(query, *params)
        if updated_package:
            return dict(updated_package)
        raise HTTPException(status_code=404, detail="Package not found")
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=400, detail="Package Already Exists!")


# ✅ Delete a package
@router.delete("/{package_id}")
async def delete_package(package_id: int, db=Depends(get_db)):
    try:
        result = await db.execute("DELETE FROM packages WHERE id = $1", package_id)
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Package not found")
        return {"message": "Package deleted successfully"}
    except asyncpg.exceptions.ForeignKeyViolationError:
        raise HTTPException(status_code=409, detail="Package has existing bookings and cannot be deleted!")
