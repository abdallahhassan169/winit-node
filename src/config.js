import pg from "pg";
const pool = new pg.Pool({
  user: "abdallah",
  host: "dpg-cp1olu6ct0pc73d5htng-a.oregon-postgres.render.com",
  database: "winit",
  password: "0KivliVIHGpPsbu9ElJMa3fqIPScBuM4",
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
export const port = 3001;
