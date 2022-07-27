import express, { Request, Response, NextFunction } from "express";
import redirectIfNotLoggedIn from "../lib/middleware/redirectIfNotLoggedIn";

import {
  accountHomeGet,
  accountActivityGet,
  accountSettingsGet,
  yourProofOfIdGet,
  deleteYourProofOfIdGet,
} from "../controllers/account";

const router = express.Router();

/* All following routes require someone to be logged in first */
router.use((req: Request, res: Response, next: NextFunction) => {
  redirectIfNotLoggedIn(req, res, next);
});

router.get("/", accountHomeGet);
router.get("/settings", accountSettingsGet);
router.get("/settings/activity", accountActivityGet);
router.get("/settings/your-proof-of-identity", yourProofOfIdGet);
router.get("/settings/your-proof-of-identity/delete", deleteYourProofOfIdGet);

export default router;
