const categoryRouter = require('express').Router();

const {getCategories} = require("../controllers/games.controllers");

categoryRouter.get('/', getCategories);

module.exports = categoryRouter;