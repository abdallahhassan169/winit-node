import pool from "../config.js";

export const upsert_campaign = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Start transaction

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
    console.log(req.body);
    const images = req.files;
    if (!id) {
      const { rows } = await client.query(
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
          remaining_qty ?? target,
          product_id,
          target,
          note,
        ]
      );
      const campaignId = rows[0].id;

      if (images && images.length > 0) {
        for (const image of images) {
          await client.query(
            `INSERT INTO public.images(campaign_id, url , uploaded_at)
            VALUES ($1, $2, current_timestamp );`,
            [campaignId, `${image.filename}`]
          );
        }
      }
      await client.query("COMMIT"); // Commit transaction
      res.send({ message: "success", campaignId: rows[0].id });
    } else {
      // Update campaign information
      await client.query(
        `UPDATE public.campaigns
        SET name=$2, start_date=$3, draw_date=$4, is_deactivated=$5, prize_name=$6, prize_url=$7, remaining_qty=COALESCE($8 ,remaining_qty ), product_id=$9 , target =$10 , note =$11
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

      // Insert new images
      if (images && images.length > 0) {
        // Delete old images
        await client.query(
          `DELETE FROM public.images
        WHERE campaign_id = $1;`,
          [id]
        );
        for (const image of images) {
          await client.query(
            `INSERT INTO public.images(campaign_id, url , uploaded_at)
            VALUES ($1, $2, current_timestamp );`,
            [id, `${image.filename}`]
          );
        }
      }

      await client.query("COMMIT"); // Commit transaction
      res.send({ message: "success" });
    }
  } catch (e) {
    await client.query("ROLLBACK"); // Rollback transaction on error
    console.error(e);
    res.status(500).send({ error: e.message });
  } finally {
    client.release(); // Release client back to the pool
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
    console.log(query, "qqq");
    const { rows } = await pool.query(
      ` SELECT c.*,p.name as product FROM public.campaigns c
      join products  p on p.id = c.product_id 
      where (c.name like concat('%',cast($1 as text),'%')  or p.name like concat('%',cast($1 as text),'%'))
       and (cast($4 as date) is null or c.start_date > cast($4 as date)) order by c.id
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
