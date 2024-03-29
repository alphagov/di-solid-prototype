import express, { Request, Response, NextFunction } from "express";
import { saveGet, savePost } from "../controllers/identity/save";

import {
  completeSavedGet,
  completeReturnGet,
} from "../controllers/identity/complete";

import {
  checkYourDetailsGet,
  chooseAddressGet,
  confirmDetailsGet,
  enterAddressGet,
  enterPassportGet,
  findAddressGet,
  proveIdentityGet,
  proveIdentityLoggedOutGet,
  securityQuestionsIntroGet,
  securityQuestionOneGet,
  securityQuestionTwoGet,
  securityQuestionThreeGet,
  securityQuestionFourGet,
  chooseAddressPost,
  confirmDetailsPost,
  enterAddressPost,
  enterPassportPost,
  findAddressPost,
  proveIdentityLoggedOutPost,
  proveIdentityStartGet,
  securityQuestionPost,
  checkInPersonGet,
  useSavedProofOfIdentityGet,
  savedIdentityConfirmedGet,
} from "../controllers/identity/ipv";

import redirectIfNotLoggedIn from "../lib/middleware/redirectIfNotLoggedIn";

const router = express.Router();

/* Begin journey. This has to happen before we log someone in */
router.get("/prove-identity-logged-out", proveIdentityLoggedOutGet);
router.post("/prove-identity-logged-out", proveIdentityLoggedOutPost);

/* All following routes require someone to be logged in first */
router.use((req: Request, res: Response, next: NextFunction) => {
  redirectIfNotLoggedIn(req, res, next);
});

/* Check if someone has stored credentials */
router.get("/", proveIdentityStartGet);

/* Prove your Identity */
router.get("/prove-identity", proveIdentityGet);

/* Enter your Passport details exactly as they appear on your Passport */
router.get("/enter-passport", enterPassportGet);
router.post("/enter-passport", enterPassportPost);

/* Find your Address */
router.get("/find-address", findAddressGet);
router.post("/find-address", findAddressPost);

/* Choose your Address */
router.get("/choose-address", chooseAddressGet);
router.post("/choose-address", chooseAddressPost);

/* Enter your Address */
router.get("/enter-address", enterAddressGet);
router.post("/enter-address", enterAddressPost);

/* Save your identity page. */
router.get("/save", saveGet);
router.post("/save", savePost);

router.get("/confirm-details", confirmDetailsGet);
router.post("/confirm-details", confirmDetailsPost);

router.get("/check-your-details", checkYourDetailsGet);

/* Security Questions. */
router.get("/security-questions/intro", securityQuestionsIntroGet);

router.get("/security-questions/question-1", securityQuestionOneGet);
router.get("/security-questions/question-2", securityQuestionTwoGet);
router.get("/security-questions/question-3", securityQuestionThreeGet);
router.get("/security-questions/question-4", securityQuestionFourGet);

router.post("/security-questions", securityQuestionPost);

/* Check in person page. */
router.get("/check-in-person", checkInPersonGet);

/* IPV Core completion pages */
router.get("/complete/saved", completeSavedGet);
router.get("/complete/return", completeReturnGet);
router.get("/complete/identity-confirmed", savedIdentityConfirmedGet);

/* Re-use identity page */
router.get("/use-saved-proof-of-identity", useSavedProofOfIdentityGet);

export default router;
