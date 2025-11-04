from fastapi import APIRouter, Depends
from database import get_db

router = APIRouter()

# ✅ 1. Package Availability Overview
@router.get("/availability")
async def get_package_availability(db=Depends(get_db)):
    total_packages = await db.fetchval("SELECT COUNT(*) FROM packages")

    # Sum of total slots (all available capacity)
    total_slots = await db.fetchval("SELECT COALESCE(SUM(slot), 0) FROM packages")

    # Total booked people across all packages
    booked_people = await db.fetchval("SELECT COALESCE(SUM(total_people), 0) FROM bookings")

    available_slots = total_slots - booked_people if total_slots > 0 else 0
    occupancy_percentage = (booked_people / total_slots * 100) if total_slots > 0 else 0

    return {
        "total_packages": total_packages,
        "total_slots": total_slots,
        "booked_people": booked_people,
        "available_slots": available_slots,
        "occupancy_percentage": round(occupancy_percentage, 2)
    }


# ✅ 2. Monthly Revenue Overview
@router.get("/revenue")
async def get_monthly_revenue(db=Depends(get_db)):
    revenue_data = await db.fetch(
        """
        SELECT
            TO_CHAR(b.date, 'Mon YYYY') AS month,
            SUM(p.price * b.total_people) AS revenue
        FROM bookings b
        JOIN packages p ON b.package_id = p.id
        WHERE b.date >= NOW() - INTERVAL '12 months'
        GROUP BY TO_CHAR(b.date, 'Mon YYYY'), DATE_TRUNC('month', b.date)
        ORDER BY DATE_TRUNC('month', b.date)
        """
    )

    return [
        {"month": row["month"], "revenue": float(row["revenue"]) if row["revenue"] is not None else 0.0}
        for row in revenue_data
    ]


# ✅ 3. Monthly Bookings Overview
@router.get("/bookings/monthly")
async def get_monthly_bookings(db=Depends(get_db)):
    bookings_data = await db.fetch(
        """
        SELECT
            TO_CHAR(date, 'Mon YYYY') AS period,
            COUNT(*) AS count
        FROM bookings
        WHERE date >= NOW() - INTERVAL '12 months'
        GROUP BY TO_CHAR(date, 'Mon YYYY'), DATE_TRUNC('month', date)
        ORDER BY DATE_TRUNC('month', date)
        """
    )

    return [{"period": row["period"], "count": row["count"]} for row in bookings_data]
