const {fetchCategories} = require("../models/games.models");

exports.getCategories = (req, res, next) => {

    fetchCategories().then((categories) => {
        res.send({categories});
    }).catch((err) => {
        next(err);
    });
};
