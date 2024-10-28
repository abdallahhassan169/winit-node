import pool from "../config.js";
import jwt from "jsonwebtoken";
import { secret } from "../config.js";
import bcrypt from "bcrypt";
import { loginSchema } from "./validation.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginSchema.validate({ email, password });
    if (error) throw new Error(error);
    const rows = await pool.query(
      `select * from "public".users where email = ($1)   `,
      [email]
    );

    const user = rows.rows[0];
    console.log(user?.password_hash, password, email);
    const isPasswordMatch = await bcrypt.compare(password, user?.password_hash);
    if (user) {
      if (
        email === user.email &&
        isPasswordMatch &&
        user.is_active
        // user type 1 is user and 2 is admin
      ) {
        const token = jwt.sign(user, secret);

        res.json({ token: token });
      } else res.status(401).send({ message: "Authentication failed." });
    } else {
      res.status(401).json({ message: "Authentication failed." });
    }
  } catch (e) {
    res.status(500).send({ err: e.message });
  }
};
