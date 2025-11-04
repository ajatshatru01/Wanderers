from fastapi import APIRouter, Depends, HTTPException, status
from models import ReviewCreate
from database import get_db

router = APIRouter()


# ✅ USER: Add or Update a Review
@router.post("/", status_code=status.HTTP_201_CREATED)
async def add_or_update_review(review: ReviewCreate, db=Depends(get_db)):
    # Check if the package exists
    package = await db.fetchrow("SELECT id FROM packages WHERE id = $1", review.package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")

    # Check if the user has already reviewed this package
    existing = await db.fetchrow(
        "SELECT id FROM reviews WHERE user_id = $1 AND package_id = $2",
        review.user_id, review.package_id
    )

    if existing:
        # Update existing review
        updated = await db.fetchrow(
            """
            UPDATE reviews
            SET rating = $1, comment = $2
            WHERE user_id = $3 AND package_id = $4
            RETURNING *
            """,
            review.rating, review.comment, review.user_id, review.package_id
        )
        return {"message": "Review updated successfully", "review": dict(updated)}
    else:
        # Insert new review
        new_review = await db.fetchrow(
            """
            INSERT INTO reviews (user_id, package_id, rating, comment)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            """,
            review.user_id, review.package_id, review.rating, review.comment
        )
        return {"message": "Review added successfully", "review": dict(new_review)}


# ✅ ADMIN: Get All Reviews
@router.get("/", status_code=status.HTTP_200_OK)
async def get_all_reviews(db=Depends(get_db)):
    reviews = await db.fetch(
        """
        SELECT
            r.id, r.user_id, r.package_id, r.rating, r.comment,
            u.username AS user_name,
            p.name AS package_name, p.location, p.type AS package_type, p.price
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN packages p ON r.package_id = p.id
        ORDER BY r.id DESC
        """
    )
    return [dict(r) for r in reviews]


# ✅ ADMIN: Delete a Review
@router.delete("/{review_id}", status_code=status.HTTP_200_OK)
async def delete_review(review_id: int, db=Depends(get_db)):
    review = await db.fetchrow("SELECT id FROM reviews WHERE id = $1", review_id)

    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    await db.execute("DELETE FROM reviews WHERE id = $1", review_id)
    return {"message": "Review deleted successfully"}
