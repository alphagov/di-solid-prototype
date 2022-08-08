import express from "express";
import {
  continueGet,
  enterNinoGet,
  enterNinoPost,
  startGet,
  verifiedNinoGet,
  verifiedNinoPost,
  savedNinoGet,
} from "../controllers/nino";

const router = express.Router();

router.get("/", startGet);
router.get("/enter-your-number", enterNinoGet);
router.post("/enter-your-number", enterNinoPost);
router.get("/weve-verified-your-number", verifiedNinoGet);
router.post("/weve-verified-your-number", verifiedNinoPost);
router.get("/youve-saved-your-number", savedNinoGet);
router.get("/continue", continueGet);

export default router;
