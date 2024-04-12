import express from "express";
import {
  campaign_products,
  delete_product,
  get_products,
  upsert_product,
} from "./products.js";
import { upload } from "../files/files.js";
export const ProductsRouter = express.Router();

ProductsRouter.post("/get_products", get_products);
ProductsRouter.post("/upsert_product", upload.single("image"), upsert_product);
ProductsRouter.post("/delete_product", delete_product);
ProductsRouter.post("/campaign_products", campaign_products);
