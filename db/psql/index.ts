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
    const infoRes = await client.query(
      "SELECT * FROM info ORDER BY id LIMIT 10;"
    );
    await client.end();
    return infoRes.rows;
  } catch (e) {
    console.error(e);
    await client.end();
    return false;
  }
}
