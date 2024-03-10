// authMiddleware.js
import jwt from "jsonwebtoken";
import pool, { secret } from "../../config.js";
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  const route = req.path;
  console.log(route);
  if (
    route === "/login" ||
    route === "/image" ||
    route === "/get_cities" ||
    route === "/register" ||
    route === "/upsert_guest_complain"
  ) {
    next();
    return;
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach user information to the request for further use in routes
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
    console.log("done", token);
  });
};

export const authorized = async (req, res, next) => {
  const user = jwt.decode(req.headers.authorization);
  console.log(user);
  const user_id = user?.id;
  const type = user?.user_type;
  const route = req.path;
  console.log(type);
  const all_routes = await pool.query(
    `select su.url from public.admins_pages ap join system_urls su on ap.page_id = su.id  where admin_id =($1)  `,
    [user_id]
  );

  if (all_routes?.rows.map((r) => r.url).includes(route) || type === "1") {
    next();
  } else res.send("you are not authorized to this service");
};

export default authMiddleware;
