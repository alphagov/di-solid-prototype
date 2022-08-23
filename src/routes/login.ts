import express from "express";
import {
  callbackGet,
  clearAppSessionGet,
  loginGet,
  logoutAuthGet,
  logoutESSGet,
} from "../controllers/login";

const router = express.Router();

router.get("/", loginGet);
router.get("/callback", callbackGet);
router.get("/clear-session", clearAppSessionGet);
router.get("/logout-auth", logoutAuthGet);
router.get("/logout-ess", logoutESSGet);

export default router;
