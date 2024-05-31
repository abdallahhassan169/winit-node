import express from "express";
import {
  banners,
  dash_banners,
  delete_asset,
  get_image,
} from "../files/files.js";
export const ImageRouter = express.Router();

ImageRouter.get("/image", get_image);
ImageRouter.post("/banners", banners);
ImageRouter.post("/dash_banners", dash_banners);
ImageRouter.post("/delete_asset", delete_asset);
