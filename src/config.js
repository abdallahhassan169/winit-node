import pg from "pg";
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "Api",
  password: "11620000",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
});
export const secret = "J3mlt0WzyktgiyXiRff5ua883P9t7jM2";
export const saltRounds = 10;
export default pool;
export const port = 3000;
