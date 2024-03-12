import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { port } from "./src/config.js";
import { ProductsRouter } from "./src/Products/router.js";
import { AuthRouter } from "./src/auth/router.js";
import { AdressRouter } from "./src/addresses/router.js";
import { AdminRouter } from "./src/admins/router.js";
import { CampRouter } from "./src/campaigns/router.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

app.use(AuthRouter);
app.use(ProductsRouter);
app.use(AdressRouter);
app.use(AdminRouter);
app.use(CampRouter);
app.listen(port, () => console.log("server up"));
