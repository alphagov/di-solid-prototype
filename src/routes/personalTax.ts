import express, { Request, Response, NextFunction } from "express";
import {
  signInOrSetUpGet,
  signInOrSetUpPost,
  homeGet,
  choosePaperlessGet,
  choosePaperlessPost,
} from "../controllers/personalTax";

import redirectIfNotLoggedIn from "../lib/middleware/redirectIfNotLoggedIn";

const router = express.Router();

router.get("/sign-in-or-set-up", signInOrSetUpGet);
router.post("/sign-in-or-set-up", signInOrSetUpPost);

/* All following routes require someone to be logged in first */
router.use((req: Request, res: Response, next: NextFunction) => {
  redirectIfNotLoggedIn(req, res, next);
});

router.get("/choose-paperless", choosePaperlessGet);
router.post("/choose-paperless", choosePaperlessPost);

router.get("/home", homeGet);

export default router;
