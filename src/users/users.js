import pool from "../config.js";

export const my_user_tickets = async (req, res) => {
  try {
    const { limit, offset } = req.body;
    const user_id = req.user.id;
    const { rows } = await pool.query(
      ` select t.*  , c.id as campaign_number , c.name as campaign_name
 from tickets t
join campaigns c on c.id = t.campaign_id
where t.user_id = $1 limit $2 offset $3
       
       `,
      [user_id, limit, offset]
    );
    res.send(rows);
  } catch (e) {
    res.status(400).send({ error: e });
  }
};
