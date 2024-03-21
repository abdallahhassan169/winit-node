import express from "express";
import { admin_orders, make_order, my_user_orders } from "./orders.js";

export const OrderRouter = express.Router();

OrderRouter.post("/make_order", make_order);
OrderRouter.post("/get_user_orders", my_user_orders);
OrderRouter.post("/get_admin_orders", admin_orders);
