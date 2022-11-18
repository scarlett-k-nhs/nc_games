const userRouter = require('express').Router();

const {getUsers} = require("../controllers/games.controllers");

userRouter.get('/', getUsers);

module.exports = userRouter;