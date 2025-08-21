const express = require("express");
const app = express();

require("dotenv").config();

const cors = require("cors");
const { dbconnect } = require("./config/database");

const reportRouter = require("./router/reportRouter");
const publicServiceRouter = require("./router/publicSeviceRouter");
const predictRouter = require("./router/predictService");
const { calcHappinessIndex } = require("./service/publicService");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

dbconnect()
  .then(() => {
    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
    calcHappinessIndex();
    app.use("/report", express.static("uploads"), reportRouter);
    app.use("/public-service", publicServiceRouter);
    app.use("/predict", predictRouter);
  })
  .catch((err) => {
    console.log(err);
  });
