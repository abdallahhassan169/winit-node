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
      image_url,
      total_qty,
      remaining_qty,
    } = req.body;
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
          image_url,
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
          image_url,
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
