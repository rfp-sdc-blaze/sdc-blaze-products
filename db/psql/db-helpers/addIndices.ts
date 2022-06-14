import { Pool } from 'pg';
require('dotenv').config();

async function addIndices() {
  const pool = new Pool({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
  });

  try {
    await pool.query(`
      CREATE INDEX info_id ON info (id);
      CREATE INDEX features_product_id ON features (product_id);
      CREATE INDEX related_curr_prod_id ON related (current_product_id);
      CREATE INDEX styles_productId ON styles (productId);
      CREATE INDEX skus_styleId ON skus (styleId);
      CREATE INDEX photos_style_id ON photos (style_id);
    `);
  } catch (e) {
    console.error(e);
  }

  await pool.end();
}

addIndices();
