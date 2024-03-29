import pool from "../config.js";

export const upsert_campaign = async (req, res) => {
  try {
    const {
      id,
      name,
      start_date,
      draw_date,
      is_deactivated,
      prize_name,
      prize_url,
      remaining_qty,
      product_id,
      target,
      note,
    } = req.body;

    const images = req.files;
    if (!id) {
      const { rows } = await pool.query(
        `INSERT INTO public.campaigns(
          name, created_at, start_date, draw_date, is_deactivated, prize_name, prize_url, remaining_qty , product_id , target, note)
        VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7 , $8 , $9 , $10) RETURNING id;`,
        [
          name,
          start_date,
          draw_date,
          false,
          prize_name,
          prize_url,
          remaining_qty,
          product_id,
          target,
          note,
        ]
      );
      const campaignId = rows[0].id;

      if (images && images.length > 0) {
        for (const image of images) {
          await pool.query(
            `INSERT INTO public.images(campaign_id, url , uploaded_at)
            VALUES ($1, $2, current_timestamp );`,
            [campaignId, `${image.filename}`]
          );
        }
      }
      res.send({ message: "success", campaignId: rows[0].id });
    } else {
      await pool.query(
        `UPDATE public.campaigns
        SET name=$2, start_date=$3, draw_date=$4, is_deactivated=$5, prize_name=$6, prize_url=$7, remaining_qty=$8 , product_id=$9 , target =$10 , note =$11
        WHERE id = $1;`,
        [
          id,
          name,
          start_date,
          draw_date,
          is_deactivated,
          prize_name,
          prize_url,
          remaining_qty,
          product_id,
          target,
          note,
        ]
      );

      res.send({ message: "success" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
};

export const delete_campaign = async (req, res) => {
  try {
    const { id } = req.body;

    const { rows } = await pool.query(
      `  DELETE FROM public.campaigns
	WHERE id = $1 `,
      [id]
    );
    res.send({ message: "success" });
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};

export const get_admin_campaigns = async (req, res) => {
  try {
    const { query, limit, offset, from_date } = req.body;

    const { rows } = await pool.query(
      ` SELECT * FROM public.campaigns
      where name like concat('%',cast($1 as text),'%')  
       and (cast($4 as date) is null or start_date > cast($4 as date))
        limit ($2) offset ($3)
       
       `,
      [query, limit, offset, from_date]
    );
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};

export const get_user_campaigns = async (req, res) => {
  try {
    const { query, limit, offset, from_date } = req.body;

    const { rows } = await pool.query(
      ` SELECT * FROM public.campaigns
      where name like concat('%',cast($1 as text),'%')  
       and (cast($4 as date) is null or start_date > cast($4 as date)) and is_deactivated is not true
        limit ($2) offset ($3)
       
       `,
      [query, limit, offset, from_date]
    );
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};
