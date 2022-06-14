import http from 'k6/http';
import { sleep } from 'k6';
export let options = {
  vus: 1000, //stimulate how many virtual users
  duration: '30s', //how long you want it to run
};
//Below randomize the endpoints
// GET /products/:product_id
// export default function () {
//   http.get(
//     `http://localhost:3001/products/${
//       Math.floor(Math.random() * (1000011 - 1 + 1)) + 1
//     }`
//   );
// }

// GET /products
// export default function () {
//   http.get('http://localhost:3001/products/');
// }

// GET /products?count=900&page=1000
// export default function () {
//   http.get('http://localhost:3001/products?count=900&page=1000');
// }

// GET /products/:product_id/styles
// export default function () {
//   http.get(
//     `http://localhost:3001/products/${
//       Math.floor(Math.random() * (1000011 - 1 + 1)) + 1
//     }/styles`
//   );
// }

// GET /products/:product_id/related
// export default function () {
//   http.get(
//     `http://localhost:3001/products/${
//       Math.floor(Math.random() * (1000011 - 1 + 1)) + 1
//     }/related`
//   );
// }
