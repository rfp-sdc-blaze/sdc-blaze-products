import { Pool } from 'pg';
require('dotenv').config();

async function dropIndices() {
  const pool = new Pool({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
  });

  try {
    await pool.query(`
      DROP INDEX IF EXISTS info_id;
      DROP INDEX IF EXISTS features_product_id;
      DROP INDEX IF EXISTS related_curr_prod_id;
      DROP INDEX IF EXISTS styles_productId;
      DROP INDEX IF EXISTS skus_styleId;
      DROP INDEX IF EXISTS photos_style_id;
    `);
  } catch (e) {
    console.error(e);
  }

  await pool.end();
}

dropIndices();
