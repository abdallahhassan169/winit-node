import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { port } from "./src/config.js";
import { ProductsRouter } from "./src/Products/router.js";
import { AuthRouter } from "./src/auth/router.js";
import { AdressRouter } from "./src/addresses/router.js";
import { AdminRouter } from "./src/admins/router.js";
import { CampRouter } from "./src/campaigns/router.js";
import { OrderRouter } from "./src/orders/router.js";
import { ImageRouter } from "./src/files/router.js";
import { userRouter } from "./src/users/router.js";
import multer from "multer";
import { upsert_product } from "./src/Products/products.js";
import { extname } from "path";
import { upsert_campaign } from "./src/campaigns/campaigns.js";
import { add_assets } from "./src/files/files.js";
import { statistics } from "./src/statistics/router.js";
import authMiddleware, { authorized } from "./src/auth/MiddleWare.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/var/data/images"); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    // Use the current timestamp as the filename
    cb(null, Date.now() + extname(file.originalname));
  },
});
export const upload = multer({ storage: storage });
app.use(authMiddleware);
app.use(authorized);
app.use("/uploads", express.static("uploads"));
app.post("/upsert_product", upload.single("image"), upsert_product);
app.post("/upsert_campaign", upload.array("images"), upsert_campaign);
app.post(
  "/add_assets",
  upload.fields([
    { name: "banner", maxCount: 1 }, // Handle single file upload with field name 'banner'
    { name: "images", maxCount: 10 }, // Handle array of files upload with field name 'images' (up to 10 files)
  ]),
  add_assets
);
app.use(AuthRouter);
app.use(ProductsRouter);
app.use(AdressRouter);
app.use(AdminRouter);
app.use(CampRouter);
app.use(OrderRouter);
app.use(ImageRouter);
app.use(userRouter);
app.use(statistics);
app.listen(port, () => console.log("server up on port :" + port));
