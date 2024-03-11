import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import cors from "cors";
import { storage, fileFilter } from "./src/images/images.js";
import { register_user } from "./src/auth/register.js";
import { port } from "./src/config.js";
import { login } from "./src/auth/login.js";
import { ProductsRouter } from "./src/Products/router.js";
import { AuthRouter } from "./src/auth/router.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

const upload = multer({ storage: storage, fileFilter: fileFilter });
app.use("/uploads", express.static("uploads"));

app.use(AuthRouter);
app.use(ProductsRouter);
app.listen(port, () => console.log("server up"));
