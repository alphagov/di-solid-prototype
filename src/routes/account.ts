import express, { Request, Response, NextFunction } from "express";
import redirectIfNotLoggedIn from "../lib/middleware/redirectIfNotLoggedIn";

import {
  accountHomeGet,
  accountActivityGet,
  accountSettingsGet,
  yourProofOfIdGet,
  deleteYourProofOfIdGet,
  deleteYourProofOfIdPost,
  accessManagementGet,
  accessManagementPost,
} from "../controllers/account";

const router = express.Router();

router.post("/access-management", accessManagementPost);

/* All following routes require someone to be logged in first */
router.use((req: Request, res: Response, next: NextFunction) => {
  redirectIfNotLoggedIn(req, res, next);
});

router.get("/", accountHomeGet);
router.get("/settings", accountSettingsGet);
router.get("/settings/activity", accountActivityGet);
router.get("/your-proof-of-identity", yourProofOfIdGet);
router.get("/your-proof-of-identity/delete", deleteYourProofOfIdGet);
router.post("/your-proof-of-identity/delete", deleteYourProofOfIdPost);
router.get("/access-management", accessManagementGet);

export default router;
