import express from "express";
import { Request, Response, NextFunction } from "express";
import {
    saveGet,
    savePost,
} from "../controllers/identity/save"

import {
    completeSavedGet,
    completeReturnGet,
} from "../controllers/identity/complete"

import {
  checkYourDetailsGet,
  chooseAddressGet,
  confirmDetailsGet,
  enterAddressGet,
  enterPassportGet,
  findAddressGet,
  proveIdentityGet,
  proveIdentityLoggedOutGet,
  useSavedProofOfIdentityGet,
  securityQuestionsIntroGet,
  securityQuestionOneGet,
  securityQuestionTwoGet,
  securityQuestionThreeGet,
  securityQuestionFourGet
} from "../controllers/identity/ipv"

import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";

const router = express.Router();

async function redirectIfNotLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.session == undefined) { res.redirect("/login") }
    const session = await getSessionFromStorage(req.session?.sessionId);

    if (!session?.info.isLoggedIn) {
      res.redirect("/login");
    } else {
      next()
    }
  }

router.use((req: Request, res: Response, next: NextFunction) => {
    redirectIfNotLoggedIn(req, res, next);
})

/* Save your identity page. */
router.get('/save', saveGet);
router.post('/save', savePost);

router.get('/check-your-details', checkYourDetailsGet);
router.get('/choose-address', chooseAddressGet);
router.get('/confirm-details', confirmDetailsGet);
router.get('/enter-address', enterAddressGet);
router.get('/enter-passport', enterPassportGet);
router.get('/find-address', findAddressGet);
router.get('/prove-identity', proveIdentityGet);
router.get('/prove-identity-logged-out', proveIdentityLoggedOutGet);
router.get('/use-saved-proof-of-identity', useSavedProofOfIdentityGet);
router.get('/security-questions/intro', securityQuestionsIntroGet);
router.get('/security-questions/question-1', securityQuestionOneGet);
router.get('/security-questions/question-2', securityQuestionTwoGet);
router.get('/security-questions/question-3', securityQuestionThreeGet);
router.get('/security-questions/question-4', securityQuestionFourGet);

/* IPV Core completion pages */
router.get('/complete/saved', completeSavedGet);
router.get('/complete/return', completeReturnGet);

export { router as identityRouter };
