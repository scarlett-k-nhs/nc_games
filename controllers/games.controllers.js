const {fetchCategories,
       fetchReviews} = require("../models/games.models");

exports.getCategories = (req, res, next) => {

    fetchCategories().then((categories) => {
        res.send({categories});
    }).catch((err) => {
        next(err);
    });
};

exports.getReviews = (req, res, next) => {

    fetchReviews().then((reviews) => {
        console.log(reviews)
        res.send({reviews});
    }).catch((err) => {
        next(err);
    });
}