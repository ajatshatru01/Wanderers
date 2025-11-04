from fastapi import APIRouter, Depends, HTTPException
from models import StaffCreate, StaffUpdate
from database import get_db
import asyncpg

router = APIRouter()

@router.get("/")
async def get_all_staff(db = Depends(get_db)):
    staff = await db.fetch("SELECT * FROM staff ORDER BY name")
    return [dict(s) for s in staff]

@router.post("/")
async def create_staff(staff: StaffCreate, db = Depends(get_db)):
    try:
        new_staff = await db.fetchrow(
            """
            INSERT INTO staff (name, role, phone)
            VALUES ($1, $2, $3)
            RETURNING *
            """,
            staff.name, staff.role, staff.phone
        )
        return dict(new_staff)
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=400, detail="Phone Number Already Exists!")

@router.put("/{staff_id}")
async def update_staff(staff_id: int, staff_update: StaffUpdate, db = Depends(get_db)):
    try:
        update_fields = []
        params = []
        param_count = 1

        if staff_update.name is not None:
            update_fields.append(f"name = ${param_count}")
            params.append(staff_update.name)
            param_count += 1

        if staff_update.role is not None:
            update_fields.append(f"role = ${param_count}")
            params.append(staff_update.role)
            param_count += 1

        if staff_update.phone is not None:
            update_fields.append(f"phone = ${param_count}")
            params.append(staff_update.phone)
            param_count += 1

        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields provided for update.")

        params.append(staff_id)
        query = f"UPDATE staff SET {', '.join(update_fields)} WHERE id = ${param_count} RETURNING *"

        updated_staff = await db.fetchrow(query, *params)
        if not updated_staff:
            raise HTTPException(status_code=404, detail="Staff not found.")
        return dict(updated_staff)

    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=400, detail="Phone Number Already Exists!")

@router.delete("/{staff_id}")
async def delete_staff(staff_id: int, db = Depends(get_db)):
    result = await db.execute("DELETE FROM staff WHERE id = $1", staff_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Staff not found.")
    return {"message": "Staff deleted successfully."}
