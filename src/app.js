const path = require("path");
const express = require("express");
const cors = require("cors");
const userRouter = require("./routers/user");

require("./db/mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);

module.exports = app;
