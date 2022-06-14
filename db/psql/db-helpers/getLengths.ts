import { Pool } from 'pg';
require('dotenv').config();

async function getLengths() {
  const pool = new Pool({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
  });

  try {
    const lastInfoRes = await pool.query(`
      SELECT id FROM info ORDER BY id DESC LIMIT 1;
    `);
    const lastFeaturesRes = await pool.query(`
      SELECT id FROM features ORDER BY id DESC LIMIT 1;
    `);
    const lastRelatedRes = await pool.query(`
      SELECT id FROM related ORDER BY id DESC LIMIT 1;
    `);
    const lastStylesRes = await pool.query(`
      SELECT id FROM styles ORDER BY id DESC LIMIT 1;
    `);
    const lastSkusRes = await pool.query(`
      SELECT id FROM skus ORDER BY id DESC LIMIT 1;
    `);
    const lastPhotosRes = await pool.query(`
      SELECT id FROM photos ORDER BY id DESC LIMIT 1;
    `);

    const lastInfo = lastInfoRes.rows[0];
    const lastFeatures = lastFeaturesRes.rows[0];
    const lastRelated = lastRelatedRes.rows[0];
    const lastStyles = lastStylesRes.rows[0];
    const lastSkus = lastSkusRes.rows[0];
    const lastPhotos = lastPhotosRes.rows[0];

    console.log({ lastInfo }); // 1000011
    console.log({ lastFeatures }); // 2219279
    console.log({ lastRelated }); // 4508263
    console.log({ lastStyles }); // 1958102
    console.log({ lastSkus }); // 11323917
    console.log({ lastPhotos }); // 5655719
  } catch (e) {
    console.error(e);
  }

  await pool.end();
}

getLengths();
