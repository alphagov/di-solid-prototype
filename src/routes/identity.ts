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
  securityQuestionFourGet,
  checkYourDetailsPost,
  chooseAddressPost,
  confirmDetailsPost,
  enterAddressPost,
  enterPassportPost,
  findAddressPost,
  proveIdentityPost,
  proveIdentityLoggedOutPost,
  useSavedProofOfIdentityPost,
  securityQuestionsIntroPost,
  securityQuestionOnePost,
  securityQuestionTwoPost,
  securityQuestionThreePost,
  securityQuestionFourPost,
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
router.post('/check-your-details', checkYourDetailsPost);

router.get('/choose-address', chooseAddressGet);
router.post('/choose-address', chooseAddressPost);

router.get('/confirm-details', confirmDetailsGet);
router.post('/confirm-details', confirmDetailsPost);

router.get('/enter-address', enterAddressGet);
router.post('/enter-address', enterAddressPost);

router.get('/enter-passport', enterPassportGet);
router.post('/enter-passport', enterPassportPost);

router.get('/find-address', findAddressGet);
router.post('/find-address', findAddressPost);

router.get('/prove-identity', proveIdentityGet);
router.post('/prove-identity', proveIdentityPost);

router.get('/prove-identity-logged-out', proveIdentityLoggedOutGet);
router.post('/prove-identity-logged-out', proveIdentityLoggedOutPost);

router.get('/use-saved-proof-of-identity', useSavedProofOfIdentityGet);
router.post('/use-saved-proof-of-identity', useSavedProofOfIdentityPost);

router.get('/security-questions/intro', securityQuestionsIntroGet);
router.post('/security-questions/intro', securityQuestionsIntroPost);

router.get('/security-questions/question-1', securityQuestionOneGet);
router.post('/security-questions/question-1', securityQuestionOnePost);

router.get('/security-questions/question-2', securityQuestionTwoGet);
router.post('/security-questions/question-2', securityQuestionTwoPost);

router.get('/security-questions/question-3', securityQuestionThreeGet);
router.post('/security-questions/question-3', securityQuestionThreePost);

router.get('/security-questions/question-4', securityQuestionFourGet);
router.post('/security-questions/question-4', securityQuestionFourPost);


/* IPV Core completion pages */
router.get('/complete/saved', completeSavedGet);
router.get('/complete/return', completeReturnGet);

export { router as identityRouter };
