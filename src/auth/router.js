import { login } from "./login.js";
import { register_user } from "./register.js";
import express from "express";
export const AuthRouter = express.Router();
AuthRouter.post("/register", register_user);
AuthRouter.post("/login", login);
