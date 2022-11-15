const db = require("../db/connection.js");

exports.fetchCategories = () => {

    return db.query(`
        SELECT * FROM categories;
    `).then((categories) => {
        return categories.rows;
    })
}

exports.fetchReviews = () => {

    return db.query(`
    SELECT 
        reviews.review_id as review_id,
        reviews.title as title,
        reviews.designer as designer,
        reviews.owner as owner,
        reviews.review_img_url AS review_img_url,
        reviews.review_body AS body,
        reviews.category AS category,
        reviews.created_at AS created_at,
        reviews.votes as votes,
        COUNT(comments.review_id) AS comment_count
    FROM reviews
    INNER JOIN comments
    ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;

    `).then((reviews) => {
        
        return reviews.rows.map((review) => {
            review.comment_count = Number(review.comment_count),
            review.created_at = Date(review.created_at)
        })
    })
}
