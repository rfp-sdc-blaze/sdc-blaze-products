import { Client, Pool } from "pg";

interface Info {
  id: number;
  name: string;
  slogan: string;
  description: string;
  category: string;
  default_price: string;
}

interface Feature {
  feature: string;
  value: string;
}

interface Details extends Info {
  features: Feature[];
}

interface StylePhotos {
  thumbnail_url: string;
  url: string;
}

interface SkuObj {
  [key: string]: {
    quantity: number;
    size: string;
  };
}
interface StyleResult {
  style_id: string;
  name: string;
  original_price: string;
  sale_price: string;
  "default?": boolean;
  photos: StylePhotos[];
  skus: SkuObj[];
}
interface Styles {
  product_id: string;
  results: StyleResult[];
}

export async function getInfo(
  count: number,
  page: number
): Promise<Info[] | false> {
  const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
  });

  try {
    await client.connect();

    const offset = (page - 1) * count;
    const qValues = [count, offset];
    const infoRes = await client.query(
      "SELECT * FROM info ORDER BY id LIMIT $1 OFFSET $2;",
      qValues
    );
    await client.end();
    return infoRes.rows;
  } catch (e) {
    console.error(e);
    await client.end();
    return false;
  }
}

export async function getProductDetails(
  productId: number
): Promise<Details | false> {
  const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
  });

  try {
    await client.connect();
    const featuresRes = await client.query(
      "SELECT feature, value FROM features WHERE product_id = $1;",
      [productId]
    );
    const detailsRes = await client.query("SELECT * FROM info WHERE id = $1;", [
      productId,
    ]);
    await client.end();
    const productDetails = {
      ...detailsRes.rows[0],
      features: featuresRes.rows,
    };
    return productDetails;
  } catch (e) {
    console.error(e);
    await client.end();
    return false;
  }
}

export async function getProductStyles(
  productId: number
): Promise<Styles | false> {
  const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
  });

  try {
    await client.connect();
    const stylesRes = await client.query(
      `SELECT * FROM styles WHERE productId = $1;`,
      [productId]
    );
    const styleIds = stylesRes.rows.map((row) => row.id);
    const photosRes = await Promise.all(
      styleIds.map(async (id) => {
        let curRes = await client.query(
          "SELECT url, thumbnail_url FROM photos WHERE style_id = $1;",
          [id]
        );
        return curRes.rows;
      })
    );
    const skusRes = await Promise.all(
      styleIds.map(async (id) => {
        let curRes = await client.query(
          "SELECT size, quantity FROM skus WHERE styleId = $1;",
          [id]
        );
        return curRes.rows;
      })
    );

    await client.end();
    const results: StyleResult[] = [];
    const productStyles = { product_id: productId.toString(), results };
    styleIds.forEach((styleId, i) => {
      const curStyle = {
        style_id: styleId,
        name: stylesRes.rows[i].name,
        original_price: stylesRes.rows[i].original_price,
        sale_price: stylesRes.rows[i].sale_price,
        "default?": stylesRes.rows[i].default_style,
        photos: [...photosRes[i]],
        skus: [...skusRes[i]],
      };
      productStyles.results.push(curStyle);
    });
    return productStyles;
  } catch (e) {
    console.error(e);
    await client.end();
  }
  return false;
}

export async function getRelated(productId: number): Promise<number[] | false> {
  const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
  });

  try {
    await client.connect();
    const relatedRes = await client.query(
      "SELECT related_product_id FROM related WHERE current_product_id = $1;",
      [productId]
    );

    await client.end();
    const relatedProducts = relatedRes.rows.map(
      (relObj) => relObj.related_product_id
    );

    return relatedProducts;
  } catch (e) {
    console.error(e);
    await client.end();
    return false;
  }
}
