const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router")

app.use(express.json());

app.use('/api', apiRouter);

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