import express, { Request, Response, NextFunction } from "express";
import {
  continueGet,
  enterNinoGet,
  enterNinoPost,
  startGet,
  verifiedNinoGet,
  beginAccessGrantsFlow,
  savedNinoGet,
  saveNinoWithAccessGrantGet,
} from "../controllers/nino";
import redirectIfNotLoggedIn from "../lib/middleware/redirectIfNotLoggedIn";

const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  redirectIfNotLoggedIn(req, res, next);
});

router.get("/", startGet);
router.get("/enter-your-number", enterNinoGet);
router.post("/enter-your-number", enterNinoPost);
router.get("/weve-verified-your-number", verifiedNinoGet);
router.post("/weve-verified-your-number", beginAccessGrantsFlow);
router.get("/save-number", saveNinoWithAccessGrantGet);
router.get("/youve-saved-your-number", savedNinoGet);
router.get("/continue", continueGet);

export default router;
