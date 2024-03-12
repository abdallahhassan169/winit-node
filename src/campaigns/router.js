import express from "express";
import {
  delete_campaign,
  get_admin_campaigns,
  get_user_campaigns,
  upsert_campaign,
} from "./campaigns.js";

export const CampRouter = express.Router();
CampRouter.post("/upsert_campaign", upsert_campaign);
CampRouter.post("/delete_campaign", delete_campaign);
CampRouter.post("/get_admin_campaigns", get_admin_campaigns);
CampRouter.post("/get_user_campaigns", get_user_campaigns);
