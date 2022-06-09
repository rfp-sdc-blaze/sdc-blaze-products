require("dotenv").config();
import { getInfo } from "../db/psql";
import express from "express";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.get("/products", async (req, res) => {
  let page = 1;
  let count = 100;
  if ("count" in req.query) {
    count = Number(req.query.count);
  }
  if ("page" in req.query) {
    page = Number(req.query.page);
  }

  // console.log(count, page);
  const getResult = await getInfo(count, page);
  if (getResult === false) {
    res.sendStatus(400);
  } else {
    res.send(getResult).status(200);
  }
});

app.listen(PORT, (): void => {
  console.log(`Listening on port ${PORT}`);
});
