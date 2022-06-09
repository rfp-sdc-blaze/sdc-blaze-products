import { Client, Pool } from "pg";

interface Info {
  id: number;
  name: string;
  slogan: string;
  description: string;
  category: string;
  default_price: string;
}

export async function getInfo(
  count: number,
  page: number
): Promise<Info[] | boolean> {
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
