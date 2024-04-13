import pool from "../config.js";

export const get_products = async (req, res) => {
  try {
    const { query, limit, offset } = req.body;

    const { rows } = await pool.query(
      ` SELECT * FROM public.products where name like concat('%',cast($1 as text),'%') or brand_name like concat('%',cast($1 as text),'%') or
       description like concat('%',cast($1 as text),'%') limit ($2) offset ($3) `,
      [query, limit, offset]
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
      description,
      category,
      usd_price,
      egp_price,
      brand_name,
      total_qty,
      remaining_qty,
    } = req.body;
    const imageUrl = `${req?.file?.filename}`;
    if (!id) {
      const { rows } = await pool.query(
        ` INSERT INTO public.products(
	  name, description, category, usd_price, egp_price, brand_name, image_url, total_qty, remaining_qty)
	VALUES (  $1, $2, $3, $4, $5, $6, $7, $8, $9); `,
        [
          name,
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
        ` UPDATE public.products
	SET   name=$2, description=$3, category=$4, usd_price=$5, egp_price=$6, brand_name=$7, image_url=$8, total_qty=$9, remaining_qty=$10
	WHERE id = $1 `,
        [
          id,
          name,
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
    console.log(e);
    res.send({ "error ": e });
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
      `  SELECT
    json_build_object(
        'product' ,   p.*  ,
        'campaign',   c.* ,
		    'images', json_agg(i.*),
        'winner',u.*
        
    ) AS full_data
FROM
    campaigns c
JOIN
    products p
ON
    c.product_id = p.id
 left join tickets t on t.campaign_id = c.id and t.is_winner = true
 left join users u on u.uid = t.user_id
	left join images i on c.id = i.campaign_id  where ($4::int [] is null or c.id = any($4::int []))
   and( p.name like concat('%',cast($1 as text),'%')
    or p.brand_name like concat('%',cast($1 as text),'%')
     or p.description like concat('%',cast($1 as text),'%'))
      and c.is_deactivated is not true and c.draw_date > current_date GROUP BY p.id, c.id , u.*
       limit ($2) offset ($3)  `,
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
