import express from "express";

import { register_admin, toggle_admin_status } from "./admins.js";

export const AdminRouter = express.Router();

AdminRouter.post("/add_admin", register_admin);
AdminRouter.post("/toggle_admin_status", toggle_admin_status);
