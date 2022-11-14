const {fetchCategories,
       fetchReviewsById} = require("../models/games.models");

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