const commentRouter = require('express').Router();

const {deleteComment} = require("../controllers/games.controllers");

commentRouter.delete('/:comment_id', deleteComment);

module.exports = commentRouter;