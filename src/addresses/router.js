import express from "express";
import { get_user_addresses, insert_address } from "./addresses.js";
export const AdressRouter = express.Router();

AdressRouter.post("/add_address", insert_address);
AdressRouter.post("/get_user_addresses", get_user_addresses);
