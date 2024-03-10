import pool from "../config.js";
import jwt from "jsonwebtoken";
import { secret } from "../config.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const rows = await pool.query(
    `select * from "public".users where email = ($1)   `,
    [email]
  );

  const user = rows.rows[0];
  console.log(user.password_hash, password);
  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (user) {
    if (
      email === user.email &&
      isPasswordMatch
      // user type 1 is user and 2 is emp
    ) {
      const token = jwt.sign(user, secret);

      res.json({ token: token });
    } else res.send({ message: "Authentication failed." });
  } else {
    res.status(401).json({ message: "Authentication failed." });
  }
};
