import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import cors from "cors";
import { storage, fileFilter } from "./src/images/images.js";
import { register_user } from "./src/users/users.js";
import { port } from "./src/config.js";
import { login } from "./src/auth/login.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

const upload = multer({ storage: storage, fileFilter: fileFilter });
app.use("/uploads", express.static("uploads"));

app.post("/register", register_user);
app.post("/login", login);
app.listen(port, () => console.log("server up"));
