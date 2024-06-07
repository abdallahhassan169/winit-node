import pool from "../config.js";

export const get_products = async (req, res) => {
  try {
    const { query, limit, offset, id } = req.body;
    console.log(id);
    const { rows } = await pool.query(
      ` SELECT * FROM public.products where (name like concat('%',cast($1 as text),'%') or brand_name like concat('%',cast($1 as text),'%') or
       description like concat('%',cast($1 as text),'%')) and (cast($4 as int) is null or id = cast($4 as int)) order by id limit ($2) offset ($3) `,
      [query, limit, offset, id]
    );
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};

export const upsert_product = async (req, res) => {
  try {
    const {
      id,
      name,
      name_en,
      description,
      category,
      usd_price,
      egp_price,
      brand_name,
      total_qty,
      remaining_qty,
    } = req.body;
    const imageUrl = req?.file?.filename || null;
    console.log(req.file, "File information");

    if (!id) {
      const { rows } = await pool.query(
        `INSERT INTO public.products(
          name, name_en, description, category, usd_price, egp_price, brand_name, image_url, total_qty, remaining_qty)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
        [
          name,
          name_en,
          description,
          category,
          usd_price,
          egp_price,
          brand_name,
          imageUrl,
          total_qty,
          remaining_qty,
        ]
      );
    } else {
      const { rows } = await pool.query(
        `UPDATE public.products
        SET name=$2, name_en=$3, description=$4, category=$5, usd_price=$6, egp_price=$7, brand_name=$8, image_url=COALESCE($9, image_url), total_qty=$10, remaining_qty=$11
        WHERE id=$1;`,
        [
          id,
          name,
          name_en,
          description,
          category,
          usd_price,
          egp_price,
          brand_name,
          imageUrl,
          total_qty,
          remaining_qty,
        ]
      );
    }
    res.send({ message: "success" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
};

export const delete_product = async (req, res) => {
  try {
    const { id } = req.body;

    const { rows } = await pool.query(
      `  DELETE FROM public.products
	WHERE id = $1 `,
      [id]
    );
    res.send({ message: "success" });
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};

export const campaign_products = async (req, res) => {
  try {
    const { query, limit, offset, ids } = req.body;
    console.log(ids);
    const { rows } = await pool.query(
      ` SELECT
    json_build_object(
        'product', p.*,
        'campaign', c.*,
        'images', json_agg(i.*),
        'winner', u.*
    ) AS full_data
FROM
    campaigns c
JOIN
    products p ON c.product_id = p.id
LEFT JOIN
    tickets t ON t.campaign_id = c.id AND t.is_winner = true
LEFT JOIN
    users u ON u.uid = t.user_id
LEFT JOIN
    images i ON c.id = i.campaign_id
WHERE c.is_deactivated is not true and
    ($4::int[] IS NULL OR c.id = ANY($4::int[])) AND
  (  (p.name LIKE CONCAT('%', CAST($1 AS TEXT), '%'))
     or
    (c.name LIKE CONCAT('%', CAST($1 AS TEXT), '%')))
GROUP BY
    p.id, c.id, u.uid
LIMIT
    ($2)
OFFSET
    ($3); `,
      [query, limit, offset, ids]
    );
    // ($4::int [] is null or c.id = any($4::int []))
    const finishd_have_winner = rows.filter((x) => x.full_data.winner);
    const finsihed_no_winner = rows.filter(
      (x) =>
        x?.full_data.campaign?.remaining_qty === 0 &&
        x.full_data.winner === null
    );
    const available = rows.filter(
      (x) =>
        x?.full_data.campaign?.remaining_qty > 0 && x.full_data.winner === null
    );
    res.send({ finishd_have_winner, finsihed_no_winner, available, rows });
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};
