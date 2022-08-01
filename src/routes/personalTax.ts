import express from "express";
import {
  signInOrSetUpGet,
  signInOrSetUpPost,
  homeGet,
  choosePaperlessGet,
  choosePaperlessPost,
} from "../controllers/personalTax";

const router = express.Router();

router.get("/home", homeGet);
router.get("/sign-in-or-set-up", signInOrSetUpGet);
router.post("/sign-in-or-set-up", signInOrSetUpPost);

router.get("/choose-paperless", choosePaperlessGet);
router.post("/choose-paperless", choosePaperlessPost);

export default router;
