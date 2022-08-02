import express from "express";
import {
  callbackGet,
  clearAppSessionGet,
  loginGet,
} from "../controllers/login";

const router = express.Router();

router.get("/", loginGet);
router.get("/callback", callbackGet);
router.get("/clear-session", clearAppSessionGet);

export default router;
