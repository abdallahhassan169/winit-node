import { saltRounds } from "../config.js";
import bcrypt from "bcrypt";
import pool from "../config.js";
import { v4 as uuidv4 } from "uuid";
export const register_admin = async (req, res) => {
  try {
    console.log(req.body);
    const d = req.body;
    const hashedPassword = await bcrypt.hash(d.password, saltRounds);
    const uuid = uuidv4();
    const { rows } = await pool.query(
      ` INSERT INTO public.users(
	 name, email, password_hash, created_at, mobile_no, user_type,uid)
	VALUES ( ($1), ($2)  , ($3),current_timestamp ,($4),2 ,($5) ); `,
      [d.name, d.email, hashedPassword, d.phone, uuid]
    );
    res.status(200).send({ message: "registered succefully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ "error ": e });
  }
};
function generateRandomNumber() {
  return Math.floor(Math.random() * 900000) + 100000;
}
export const resetPassword = async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body.id;
    const new_password = generateRandomNumber();
    const hashedPassword = await bcrypt.hash(String(new_password), saltRounds);

    const { rows } = await pool.query(
      `update users set password_hash = $1 where id = $2 `,
      [hashedPassword, id]
    );
    res.status(200).send({ message: "changed succefully", new_password });
  } catch (e) {
    console.log(e);
    res.status(500).send({ "error ": e });
  }
};
export const toggle_admin_status = async (req, res) => {
  try {
    const { id } = req.body;

    const { rows } = await pool.query(
      ` update users set is_active = not is_active where id = $1 and user_type = 2  `,
      [id]
    );
    res.send({ message: "toggled succefully" });
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};

export const get_admins = async (req, res) => {
  try {
    const { query, limit, offset } = req.body;

    const { rows } = await pool.query(
      ` SELECT uid , id , name , email , mobile_no , is_active FROM public.users where user_type=2 and name like concat('%',cast($1 as text),'%') or email
       like concat('%',cast($1 as text),'%') and user_type = 2 order by id desc   limit ($2) offset ($3) `,
      [query, limit, offset]
    );
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};
