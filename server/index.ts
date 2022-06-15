require('dotenv').config();
const morgan = require('morgan');

import {
  getInfo,
  getProductDetails,
  getProductStyles,
  getRelated,
} from '../db/psql';
import express from 'express';

const PORT = process.env.PORT || 3001;

export const app = express();

app.use(express.json());

app.get('/loaderio-545f58cbc53cf1447db2af90bc72505d.txt', (req, res) => {
  res.send('loaderio-545f58cbc53cf1447db2af90bc72505d').status(200);
});

app.get('/products', async (req, res) => {
  let page = 1;
  let count = 5;
  if ('count' in req.query) {
    if (isNaN(Number(req.query.count)) || Number(req.query.count) <= 0) {
      res.sendStatus(400);
      return;
    }
    count = Number(req.query.count);
  }
  if ('page' in req.query) {
    if (isNaN(Number(req.query.page)) || Number(req.query.page) <= 0) {
      res.sendStatus(400);
      return;
    }
    page = Number(req.query.page);
  }

  const getResult = await getInfo(count, page);
  if (getResult === false) {
    res.sendStatus(400);
  } else {
    res.send(getResult).status(200);
  }
});

app.get('/products/:product_id', async (req, res) => {
  if (isNaN(Number(req.params.product_id))) {
    res.sendStatus(400);
    return;
  }
  const productId = Number(req.params.product_id);
  const productDetails = await getProductDetails(productId);
  if (productDetails === false) {
    res.sendStatus(400);
  } else {
    res.send(productDetails).status(200);
  }
});

app.get('/products/:product_id/styles', async (req, res) => {
  if (isNaN(Number(req.params.product_id))) {
    res.sendStatus(400);
    return;
  }
  const productId = Number(req.params.product_id);
  const styleDetails = await getProductStyles(productId);
  if (styleDetails === false) {
    res.sendStatus(400);
  } else {
    res.send(styleDetails).status(200);
  }
});

app.get('/products/:product_id/related', async (req, res) => {
  if (isNaN(Number(req.params.product_id))) {
    res.sendStatus(400);
    return;
  }
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
