import express from "express";

import { get_admins, register_admin, toggle_admin_status } from "./admins.js";

export const AdminRouter = express.Router();

AdminRouter.post("/add_admin", register_admin);
AdminRouter.post("/get_admins", get_admins);
AdminRouter.post("/toggle_admin_status", toggle_admin_status);
