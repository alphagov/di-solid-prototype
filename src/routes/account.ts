import express from "express";
import {
  accountHomeGet,
  accountActivityGet,
  accountSettingsGet,
  yourProofOfIdGet,
  deleteYourProofOfIdGet
} from "../controllers/account"

const router = express.Router();

router.get('/', accountHomeGet);
router.get('/settings', accountSettingsGet);
router.get('/settings/activity', accountActivityGet);
router.get('/settings/your-proof-of-identity', yourProofOfIdGet);
router.get('/settings/your-proof-of-identity/delete', deleteYourProofOfIdGet);

export {router as accountRouter};
