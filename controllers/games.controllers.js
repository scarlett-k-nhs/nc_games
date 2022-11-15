const {fetchCategories,
       fetchReviewsById,
       fetchReviews} = require("../models/games.models");


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

