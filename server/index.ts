import express from "express";

import bodyParser = require("body-parser");
import { tempData } from "./temp-data";

const app = express();

const PORT = 8888;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/", (req, res) => {
  res.send("dev api status - up");
});

app.get("/api/match", (req, res) => {
  res.send(tempData);
});

app.listen(PORT);
console.log(`server running http://localhost:${PORT}`);
