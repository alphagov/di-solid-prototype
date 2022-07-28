import express from "express";
import { callbackGet, loginGet } from "../controllers/login";

const router = express.Router();

router.get("/", loginGet);
router.get("/callback", callbackGet);

export default router;
