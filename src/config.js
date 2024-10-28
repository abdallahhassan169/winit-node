import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
  max: parseInt(process.env.DB_MAX, 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT, 10),
  ssl: {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true",
  },
});

export const secret = process.env.SECRET;
export const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
export const port = parseInt(process.env.PORT, 10);
export default pool;
