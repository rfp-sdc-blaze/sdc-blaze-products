import { Client, Pool } from 'pg';

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
  style_id: number;
  name: string;
  original_price: string;
  sale_price: string;
  'default?': boolean;
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
      'SELECT * FROM info ORDER BY id LIMIT $1 OFFSET $2;',
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
    const detailsRes = await client.query(
      `SELECT id, name, slogan, description, category, default_price,
      (SELECT json_agg(
        json_build_object(
          'feature', feature,
          'value', value
        )
      ) AS features FROM features WHERE product_id = info.id)
        FROM info WHERE id = $1;`,
      [productId]
    );
    await client.end();
    if (detailsRes.rows.length === 0) {
      return false;
    }
    return detailsRes.rows[0];
  } catch (e) {
    console.error(e);
    await client.end();
    return false;
  }
}

// export async function getProductDetails(
//   productId: number
// ): Promise<Details | false> {
//   const client = new Client({
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PW,
//   });

//   try {
//     await client.connect();
//     const detailsRes = await client.query("SELECT * FROM info WHERE id = $1;", [
//       productId,
//     ]);
//     if (detailsRes.rows.length === 0) {
//       await client.end();
//       return false;
//     }
//     const featuresRes = await client.query(
//       "SELECT feature, value FROM features WHERE product_id = $1;",
//       [productId]
//     );
//     await client.end();
//     const productDetails = {
//       ...detailsRes.rows[0],
//       features: featuresRes.rows,
//     };
//     return productDetails;
//   } catch (e) {
//     console.error(e);
//     await client.end();
//     return false;
//   }
// }

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
      `SELECT json_agg(
        json_build_object(
          'style_id', id,
          'name', name,
          'original_price', original_price,
          'sale_price', sale_price,
          'default_style', default_style,
          'photos', (
            SELECT json_agg(
              json_build_object(
                'thumbnail_url', thumbnail_url,
                'url', url
              )
            ) FROM photos where style_id = styles.id
          ),
          'skus', (
            SELECT json_object_agg(
              id::varchar(255), json_build_object(
                'quantity', quantity,
                'size', size
              )
            ) FROM skus where styleId = styles.id
          )
        )) AS results FROM styles WHERE productId = $1`,
      [productId]
    );
    await client.end();
    if (stylesRes.rows[0].results === null) {
      const results: StyleResult[] = [];
      stylesRes.rows[0].results = results;
    }
    // remove null sale price
    for (let i = 0; i < stylesRes.rows[0].results.length; i++) {
      if (stylesRes.rows[0].results[i].sale_price === 'null') {
        stylesRes.rows[0].results[i].sale_price = 0;
      }

      if (stylesRes.rows[0].results[i].photos === null) {
        stylesRes.rows[0].results[i].photos = [
          {
            thumbnail_url: '',
            url: '',
          },
        ];
      }

      if (stylesRes.rows[0].results[i].skus === null) {
        stylesRes.rows[0].results[i].skus = [
          {
            skus: {
              1: {
                quantity: 0,
                size: 'n/a',
              },
            },
          },
        ];
      }
    }

    return {
      product_id: productId.toString(),
      ...stylesRes.rows[0],
    };
  } catch (e) {
    console.error(e);
    await client.end();
  }
  return false;
}
// export async function getProductStyles(
//   productId: number
// ): Promise<Styles | false> {
//   const client = new Client({
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PW,
//   });

//   try {
//     await client.connect();
//     const stylesRes = await client.query(
//       `SELECT * FROM styles WHERE productId = $1;`,
//       [productId]
//     );
//     if (stylesRes.rows.length === 0) {
//       await client.end();
//       return false;
//     }
//     const styleIds = stylesRes.rows.map((row) => row.id);
//     const photosRes = await Promise.all(
//       styleIds.map(async (id) => {
//         let curRes = await client.query(
//           'SELECT url, thumbnail_url FROM photos WHERE style_id = $1;',
//           [id]
//         );
//         return curRes.rows;
//       })
//     );
//     const skusRes = await Promise.all(
//       styleIds.map(async (id) => {
//         let curRes = await client.query(
//           'SELECT size, quantity FROM skus WHERE styleId = $1;',
//           [id]
//         );
//         return curRes.rows;
//       })
//     );

//     await client.end();
//     const results: StyleResult[] = [];
//     const productStyles = { product_id: productId.toString(), results };
//     styleIds.forEach((styleId, i) => {
//       const curStyle: StyleResult = {
//         style_id: Number(styleId),
//         name: stylesRes.rows[i].name,
//         original_price: stylesRes.rows[i].original_price,
//         sale_price:
//           stylesRes.rows[i].sale_price === null
//             ? '0'
//             : stylesRes.rows[i].sale_price,
//         'default?': stylesRes.rows[i].default_style,
//         photos: [...photosRes[i]],
//         skus: [...skusRes[i]],
//       };
//       productStyles.results.push(curStyle);
//     });
//     return productStyles;
//   } catch (e) {
//     console.error(e);
//     await client.end();
//   }
//   return false;
// }

export async function getRelated(productId: number): Promise<number[] | false> {
  const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
  });

  try {
    await client.connect();
    const relatedRes = await client.query(
      'SELECT related_product_id FROM related WHERE current_product_id = $1;',
      [productId]
    );

    await client.end();
    if (relatedRes.rows.length === 0) {
      return false;
    }
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
