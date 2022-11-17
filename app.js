const express = require("express");
const app = express();
const {getCategories,
      getReviews,
      getReviewsById,
      getCommentsByReviewId,
      patchReviewById,
      postComment,
      getUsers,
      deleteComment} = require("./controllers/games.controllers.js");

app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewsById);

app.get('/api/reviews/:review_id/comments', getCommentsByReviewId)

app.get('/api/users', getUsers);

app.post('/api/reviews/:review_id/comments', postComment)

app.patch('/api/reviews/:review_id', patchReviewById);

app.delete('/api/comments/:comment_id', deleteComment);


app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Route not found" });
  });

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
      res.status(400).send({ msg: "bad request!" });
  } else {
      next(err);
  }
  });

  app.use((err, req, res, next) => {
    if (err.code === "23503") {
        res.status(400).send({ msg: "bad request!" });
    } else {
        next(err);
    }
    });
  
  app.use((err, req, res, next) => {
  if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
  } else {
      next(err);
  }
  });

app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
    });
    
module.exports = app;