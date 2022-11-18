const apiRouter = require('express').Router();
const reviewRouter = require('./reviews-router');
const categoryRouter = require('./categories-router');
const userRouter = require('./users-router');
const commentRouter = require('./comments-router');
const {getAPI} = require("../controllers/games.controllers");

apiRouter.get('/', getAPI);

apiRouter.use('/reviews', reviewRouter);

apiRouter.use('/categories', categoryRouter);

apiRouter.use('/users', userRouter);

apiRouter.use('/comments', commentRouter);

module.exports = apiRouter;