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
            return review;
        })
    })
}

exports.fetchReviewsById = (review_id) => {

    return db.query(`
        SELECT * FROM reviews
        WHERE review_id = $1;
    `, [review_id]).then((reviews) => {

        if (reviews.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg:"Invalid review id given"
            })
        } else {
            const dateStr = reviews.rows[0].created_at.toString()
            reviews.rows[0].created_at = new Date(dateStr)
            return reviews.rows[0]
        }
    })
}

exports.fetchCommentsByReviewId = (review_id) => {
    return this.fetchReviewsById(review_id)
        .then(() => {
            return db.query(
                `SELECT * FROM comments
                 WHERE review_id = $1;`, [review_id]
            );
    })
    .then((comments) => {
        return comments.rows
    })
}
exports.updateReviewById = (inc_votes, review_id) => {
    
    if (inc_votes === undefined){

        return Promise.reject({
            status:400,
            msg: 'No inc_votes key has been given'
        })
    } else if (typeof inc_votes !== 'number'){
        return Promise.reject({
            status:404,
            msg: 'inc_votes needs to be a number'
        })
    } else {
        return db.query(`
            UPDATE reviews
            SET votes = votes + $1
            WHERE review_id = $2
            RETURNING*;
        `, [inc_votes, review_id]).then((reviews) => {
    
            if (reviews.rows.length === 0){
                return Promise.reject({
                    status: 404,
                    msg:"Invalid review id given"
                })
            } else {
                return reviews.rows[0]
            }
        })
    }
}