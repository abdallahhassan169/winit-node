import { saltRounds } from "../config.js";
import bcrypt from "bcrypt";
import pool from "../config.js";
import { v4 as uuidv4 } from "uuid";
export const register_user = async (req, res) => {
  try {
    const d = req.body;
    const hashedPassword = await bcrypt.hash(d.password, saltRounds);
    const uuid = uuidv4();
    const { rows } = await pool.query(
      ` INSERT INTO public.users(
	 name, email, password_hash, created_at, mobile_no, user_type,uid)
	VALUES ( ($1), ($2)  , ($3),current_timestamp ,($4),1 ,($5) ); `,
      [d.user_name, d.email, hashedPassword, d.phone, uuid]
    );
    res.send({ message: "registered succefully" });
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};
