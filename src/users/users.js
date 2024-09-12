import pool from "../config.js";

export const my_user_tickets = async (req, res) => {
  try {
    const user_id = req.user.uid;
    console.log(req.user, "user");
    const { rows } = await pool.query(
      ` select * from tickets t join campaigns c on c.id = t.campaign_id 
where user_id = $1
       
       `,
      [user_id]
    );
    rows.map((t) => {
      if (t.remaining_qty === 0) {
        t.cam_status = "finished and waiting winner";
      } else if (t.remaining_qty > 0) {
        t.cam_status = "continues";
      } else {
        t.cam_status = "the winner has been selected";
      }
    });
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e });
  }
};
