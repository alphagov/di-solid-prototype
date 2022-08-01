import express from "express";
import {
  signInOrSetUpGet,
  homeGet,
  choosePaperlessGet,
} from "../controllers/personalTax";

const router = express.Router();

router.get("/home", homeGet);
router.get("/sign-in-or-set-up", signInOrSetUpGet);
router.get("/choose-paperless", choosePaperlessGet);

export default router;
