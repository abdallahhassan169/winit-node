import express from "express";
import { banners, get_image } from "../files/files.js";
export const ImageRouter = express.Router();

ImageRouter.get("/image", get_image);
ImageRouter.post("/banners", banners);
