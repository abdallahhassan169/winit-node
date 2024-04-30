import express from "express";
import {
  admin_orders,
  change_order_status,
  make_order,
  my_user_orders,
  order_by_id,
} from "./orders.js";

export const OrderRouter = express.Router();

OrderRouter.post("/make_order", make_order);
OrderRouter.post("/get_user_orders", my_user_orders);
OrderRouter.post("/get_admin_orders", admin_orders);
OrderRouter.post("/order_by_id", order_by_id);
OrderRouter.post("/change_order_status", change_order_status);
