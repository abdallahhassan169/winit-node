// authMiddleware.js
import jwt from "jsonwebtoken";
import pool, { secret } from "../../src/config.js";
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  const route = req.path;
  console.log(route);
  if (
    route === "/login" ||
    route === "/image" ||
    route === "/campaign_products" ||
    route === "/register"
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

const public_urls = [
  "/make_order",
  "/user_tickets",
  "/login",
  "/image",
  "/campaign_products",
  "/register",
  "banner",
];
const user_urls = ["/make_order", "/user_tickets"];
export const authorized = async (req, res, next) => {
  const user = jwt.decode(req.headers.authorization);
  console.log(user);
  const user_id = user?.id;
  const type = user?.user_type;
  const route = req.path;
  console.log(
    type,
    route,
    typeof route,
    user_urls.includes(route),
    type === "1",
    "herrrrre"
  );
  if (public_urls.includes(route)) {
    next();
  } else if (user_urls.includes(route) && type === "1") {
    next();
  } else if (type === "2" && user.is_active) {
    next();
  } else res.status(500).send("you are not authorized to this url");
};

export default authMiddleware;
