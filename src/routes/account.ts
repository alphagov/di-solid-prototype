import express from "express";
import {
  accountHomeGet,
  accountActivityGet,
  accountSettingsGet,
  yourProofOfIdGet,
  deleteYourProofOfIdGet
} from "../controllers/account"

const router = express.Router();

router.get('/account', accountHomeGet);
router.get('/account/settings', accountSettingsGet);
router.get('/account/settings/activity', accountActivityGet);
router.get('/account/settings/your-proof-of-identity', yourProofOfIdGet);
router.get('/account/settings/your-proof-of-identity/delete', deleteYourProofOfIdGet);

export {router as accountRouter};
