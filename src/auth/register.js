import { saltRounds } from "../config.js";
import bcrypt from "bcrypt";
import pool from "../config.js";
import { v4 as uuidv4 } from "uuid";
import { registerSchema } from "./validation.js";
export const register_user = async (req, res) => {
  try {
    const { user_name, email, password, phone } = req.body;
    const { error } = registerSchema.validate({
      user_name,
      email,
      password,
      phone,
    });
    if (error) throw new Error(error);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const uuid = uuidv4();
    const { rows } = await pool.query(
      ` INSERT INTO public.users(
	 name, email, password_hash, created_at, mobile_no, user_type,uid)
	VALUES ( ($1), ($2)  , ($3),current_timestamp ,($4),1 ,($5) ); `,
      [user_name, email, hashedPassword, phone, uuid]
    );
    res.send({ message: "registered succefully" });
  } catch (e) {
    console.log(e);
    res.send({ "error ": e.message });
  }
};
