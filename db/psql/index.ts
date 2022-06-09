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
