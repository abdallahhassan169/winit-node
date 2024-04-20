import express from "express";
import { get_image } from "../files/files.js";
export const ImageRouter = express.Router();

ImageRouter.get("/image", get_image);
