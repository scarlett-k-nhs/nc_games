const {fetchCategories,
       fetchReviewsById,
       fetchReviews,
       fetchCommentsByReviewId,
       updateReviewById} = require("../models/games.models");


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

