import express from "express";
import { delete_product, get_products, upsert_product } from "./products.js";
export const ProductsRouter = express.Router();

ProductsRouter.post("/get_products", get_products);
ProductsRouter.post("/upsert_product", upsert_product);
ProductsRouter.post("/delete_product", delete_product);
