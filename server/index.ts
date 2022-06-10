require("dotenv").config();
import {
  getInfo,
  getProductDetails,
  getProductStyles,
  getRelated,
} from "../db/psql";
import express from "express";

const PORT = process.env.PORT || 3001;

export const app = express();

app.use(express.json());

app.get("/products", async (req, res) => {
  let page = 1;
  let count = 5;
  if ("count" in req.query) {
    count = Number(req.query.count);
  }
  if ("page" in req.query) {
    page = Number(req.query.page);
  }

  const getResult = await getInfo(count, page);
  if (getResult === false) {
    res.sendStatus(400);
  } else {
    res.send(getResult).status(200);
  }
});

app.get("/products/:product_id", async (req, res) => {
  const productId = Number(req.params.product_id);
  const productDetails = await getProductDetails(productId);
  if (productDetails === false) {
    res.sendStatus(400);
  } else {
    res.send(productDetails).status(200);
  }
});

app.get("/products/:product_id/styles", async (req, res) => {
  const productId = Number(req.params.product_id);
  const styleDetails = await getProductStyles(productId);
  if (styleDetails === false) {
    res.sendStatus(400);
  } else {
    res.send(styleDetails).status(200);
  }
});

app.get("/products/:product_id/related", async (req, res) => {
  const productId = Number(req.params.product_id);
  const relatedProducts = await getRelated(productId);
  if (relatedProducts === false) {
    res.sendStatus(400);
  } else {
    res.send(relatedProducts).status(200);
  }
});

export const server = app.listen(PORT, (): void => {
  console.log(`Listening on port ${PORT}`);
});
