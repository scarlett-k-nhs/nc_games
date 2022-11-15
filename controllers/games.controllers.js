const {fetchCategories,
       fetchReviewsById,
       fetchReviews,
       addComment} = require("../models/games.models");


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

    fetchReviews().then((reviews) => {
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

