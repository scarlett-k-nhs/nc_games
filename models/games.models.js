const db = require("../db/connection.js");
const { sort } = require("../db/data/test-data/categories.js");
const {checkCategory, checkReviewsById} = require("../db/seeds/utils")
const jsonObject = require("../endpoints.json");

exports.fetchCategories = () => {

    return db.query(`
        SELECT * FROM categories;
    `).then((categories) => {
        return categories.rows;
    })
}

exports.fetchReviews = (category, sort_by = 'created_at', order = 'desc') => {

    if (!['asc', 'desc'].includes(order)){
        return Promise.reject({
            status: 400,
            msg: 'invalid ordering must be asc or desc'
        })
    }

    validSortBys = ['created_at', 'review_id', 'title', 'designer',
                    'owner', 'review_img_url', 'body', 'category',
                    'votes', 'comment_count']
    
    if (!validSortBys.includes(sort_by)){
        return Promise.reject({
            status: 400,
            msg: `cannot sort by ${sort_by}`
        })
    };
    
    valueArr = [];
    let count = 1;
    
    let queryStr = `
        SELECT 
            reviews.*,
            COUNT(comments.review_id) AS comment_count
        FROM reviews
        INNER JOIN comments
        ON comments.review_id = reviews.review_id
        `
    if (category !== undefined){

        queryStr += ` WHERE reviews.category = $${count}`
        valueArr.push(category);
        count++
    }

    queryStr += ` 
        GROUP BY reviews.review_id
        ORDER BY reviews.${sort_by} ${order};
        `
    return db.query(queryStr, valueArr).then((reviews) => {
        if (reviews.rows.length === 0){
            return Promise.reject({
                status:404,
                msg:'category not found'
            })
        } else{
            return reviews.rows.map((review) => {
                review.comment_count = Number(review.comment_count),
                review.created_at = Date(review.created_at)
                return review;
            })
        }
    })
}

exports.fetchReviewsById = (review_id) => {
    return db.query(`
        SELECT 
            reviews.review_id as review_id,
            reviews.title as title,
            reviews.designer as designer,
            reviews.owner as owner,
            reviews.review_img_url AS review_img_url,
            reviews.review_body AS review_body,
            reviews.category AS category,
            reviews.created_at AS created_at,
            reviews.votes as votes,
            COUNT(CoMments.review_id) AS comment_count
        FROM reviews
        LEFT JOIN comments
        ON comments.review_id = reviews.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;
        `, [review_id])
       .then((reviews) => {
        if (reviews.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg:"Invalid review id given"
            })
        } else {
            const dateStr = reviews.rows[0].created_at.toString()
            reviews.rows[0].created_at = new Date(dateStr)
            reviews.rows[0].comment_count = Number(reviews.rows[0].comment_count)
            return reviews.rows[0]
        }
    })
}

exports.addComment = (newComment, review_id) => {

    return checkReviewsById(review_id).then(() => {
            
            const {body, username} = newComment;
    
            if (body === undefined || username === undefined){
                return Promise.reject({
                    status: 400,
                    msg: "bad request as keys are missing"
                })
            } else if (typeof body !== 'string' || typeof username !== 'string'){
                return Promise.reject({
                    status: 400,
                    msg: "information given by the object is not the right data type"
                })            
            } else {
                return db.query(`
                    INSERT INTO comments
                        (body, review_id, author)
                    VALUES
                        ($1, $2, $3)
                    RETURNING *;
                `, [body, review_id, username])
            }
        
    }).then((comment) => {
        return comment.rows
    })
}


exports.fetchCommentsByReviewId = (review_id) => {
    return checkReviewsById(review_id)
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
                    msg:"review id not found"
                })
            } else {
                return reviews.rows[0]
            }
        })
    }
}

exports.fetchUsers = () => {

    return db.query(`
        SELECT * FROM users;
    `).then((users) => {
        return users.rows;
    })
}

exports.removeComment = (comment_id) => { 
    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING* ;
    `, [comment_id]).then((comment) => {

        if (comment.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: "comment id not found"
            })
        }
    })
};
