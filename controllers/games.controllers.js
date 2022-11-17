const {fetchCategories,
       fetchReviewsById,
       fetchReviews,
       updateReviewById,
       addComment,
       fetchCommentsByReviewId,
       fetchUsers,
       removeComment} = require("../models/games.models");

exports.getCategories = (req, res, next) => {

    fetchCategories().then((categories) => {
        res.send({categories});
    }).catch((err) => {
        next(err);
    });
};

exports.getReviewsById = (req, res, next) => {

    const {review_id} = req.params

    fetchReviewsById(review_id).then((review) => {
        res.send({review});
    }).catch((err) => {
        next(err);
    });
};

exports.getReviews = (req, res, next) => {

    const {category, sort_by, order} = req.query;

    fetchReviews(category, sort_by, order).then((reviews) => {
        res.send({reviews});
    }).catch((err) => {
        next(err);
    });
}

exports.postComment = (req, res, next) => {
    
    const newComment = req.body;
    const {review_id} = req.params;

    addComment(newComment, review_id).then((comment) => {
        res.status(201).send({comment});
    }).catch((err) => {
        next(err);
    });    
    
}

exports.getCommentsByReviewId = (req, res, next) => {

    const {review_id} = req.params

    fetchCommentsByReviewId(review_id).then((comments) => {
        res.send({comments});
    }).catch((err) => {
        next(err);
    });
}

exports.patchReviewById = (req, res, next) => {
    
    const {inc_votes}= req.body;
    const {review_id} = req.params

    updateReviewById(inc_votes, review_id).then((review) => {
        res.send({review});
    }).catch((err) => {
        next(err);
    });
}

exports.getUsers = (req, res, next) => {

    fetchUsers().then((users) => {
        res.send({users});
    }).catch((err) => {
        next(err);
    });
}

exports.deleteComment = (req, res, next) => {

    const {comment_id} = req.params;

    removeComment(comment_id).then(() => {
        res.status(204).end();
    }).catch((err) => {
        next(err);
    })
}

exports.getAPI= (req, res, next) => {

    fetchAPI().then(({json}) => {
        res.send(json);
    }).catch((err) => {
        next(err);
    })
}

