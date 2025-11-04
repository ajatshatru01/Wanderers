from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from models import BookingCreate
from database import get_db

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate, db=Depends(get_db)):
    # Check if package exists
    package = await db.fetchrow("SELECT id, slot FROM packages WHERE id = $1", booking.package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")

    # Check available slots
    if package["slot"] < booking.total_people:
        raise HTTPException(status_code=400, detail="Not enough slots available")

    # Use today's date if not provided
    booking_date = booking.date or date.today()

    async with db.transaction():
        # Insert booking
        new_booking = await db.fetchrow(
            """
            INSERT INTO bookings (user_id, package_id, date, total_people)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            """,
            booking.user_id, booking.package_id, booking_date, booking.total_people
        )

        # Decrease available slots
        await db.execute(
            "UPDATE packages SET slot = slot - $1 WHERE id = $2",
            booking.total_people, booking.package_id
        )

    return dict(new_booking)




# ✅ FETCH ALL BOOKINGS
@router.get("/", status_code=status.HTTP_200_OK)
async def get_all_bookings(db=Depends(get_db)):
    bookings = await db.fetch(
        """
        SELECT
            b.id, b.user_id, b.package_id, b.date, b.total_people,
            u.username AS user_name,
            p.name AS package_name, p.type AS package_type, p.price, p.location, p.duration
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN packages p ON b.package_id = p.id
        ORDER BY b.date DESC
        """
    )
    return [dict(b) for b in bookings]
# ✅ FETCH BOOKINGS BY USER ID
@router.get("/user/{user_id}", status_code=status.HTTP_200_OK)
async def get_user_bookings(user_id: int, db=Depends(get_db)):
    bookings = await db.fetch(
        """
        SELECT
            b.id AS booking_id,
            b.date AS booking_date,
            b.total_people,
            p.id AS package_id,
            p.name AS package_name,
            p.type AS package_type,
            p.price AS package_price,
            p.location AS package_location,
            p.duration AS package_duration
        FROM bookings b
        JOIN packages p ON b.package_id = p.id
        WHERE b.user_id = $1
        ORDER BY b.date DESC
        """,
        user_id
    )
    return [dict(b) for b in bookings]


# ✅ CANCEL BOOKING
@router.delete("/{booking_id}", status_code=status.HTTP_200_OK)
async def cancel_booking(booking_id: int, db=Depends(get_db)):
    booking = await db.fetchrow("SELECT package_id, total_people FROM bookings WHERE id = $1", booking_id)

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    async with db.transaction():
        # Delete booking
        await db.execute("DELETE FROM bookings WHERE id = $1", booking_id)
        # Restore slots in the package
        await db.execute(
            "UPDATE packages SET slot = slot + $1 WHERE id = $2",
            booking["total_people"], booking["package_id"]
        )

    return {"message": "Booking cancelled successfully"}
