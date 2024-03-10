import pg from "pg";
const pool = new pg.Pool({
  user: "abdallah",
  host: "dpg-cn9p3rv79t8c73c51vd0-a.oregon-postgres.render.com",
  database: "WinIt",
  password: "NjAo5XQyVpWJNz2KCMPIMDktWzQOLizx",
  port: 5432,
  max: 20, // Adjust as needed
  idleTimeoutMillis: 30000, // Adjust as needed
  ssl: {
    // These options are often required for connecting to a remote PostgreSQL server
    // Adjust them based on your server's configuration
    rejectUnauthorized: false,
  },
});
export const secret = "J3mlt0WzyktgiyXiRff5ua883P9t7jM2";
export const saltRounds = 10;
export default pool;
export const port = 3000;
