import express from "express";
import { get_statistics } from "./statistics.js";

export const statistics = express.Router();

statistics.post("/statistics", get_statistics);
