import express from "express";

import { my_user_tickets } from "./users.js";

export const userRouter = express.Router();

userRouter.post("/user_tickets", my_user_tickets);
