import pool from "../config.js";

export const insert_address = async (req, res) => {
  try {
    const {
      apart_no,
      floor_no,
      building_no,
      street,
      area,
      city,
      country,
      uid,
    } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO public.addresses(
        apart_no, floor_no, building_no, street, area, city, country, uid, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING id;`,
      [apart_no, floor_no, building_no, street, area, city, country, uid]
    );

    res.send({ message: "success", apartmentId: rows[0].id });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
};

export const get_user_addresses = async (req, res) => {
  try {
    const { uid } = req?.body;

    const { rows } = await pool.query(
      `select * from addresses where uid = $1`,
      [uid]
    );

    res.send(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
};
