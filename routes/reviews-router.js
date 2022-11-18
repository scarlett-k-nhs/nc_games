const reviewRouter = require('express').Router();

const {getReviews,
       getReviewsById,
       getCommentsByReviewId,
       postComment,
       patchReviewById} = require("../controllers/games.controllers");

reviewRouter.get('/', getReviews);

reviewRouter.get('/:review_id', getReviewsById);

reviewRouter.get('/:review_id/comments', getCommentsByReviewId);

reviewRouter.post('/:review_id/comments', postComment);

reviewRouter.patch('/:review_id', patchReviewById);

module.exports = reviewRouter;