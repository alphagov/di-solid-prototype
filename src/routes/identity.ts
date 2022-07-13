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

import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";

const router = express.Router();

function checkYourDetailsGet(req: Request, res: Response) {
  res.render('identity/check-your-details');
}

function chooseAddressGet(req: Request, res: Response) {
  res.render('identity/choose-address');
}

function confirmDetailsGet(req: Request, res: Response) {
  res.render('identity/confirm-details');
}

function enterAddressGet(req: Request, res: Response) {
  res.render('identity/enter-address');
}

function enterPassportGet(req: Request, res: Response) {
  res.render('identity/enter-passport');
}

function findAddressGet(req: Request, res: Response) {
  res.render('identity/find-address');
}

function proveIdentityLoggedOutGet(req: Request, res: Response) {
  res.render('identity/prove-identity-logged-out');
}

function proveIdentityGet(req: Request, res: Response) {
  res.render('identity/prove-identity');
}

function useSavedProofOfIdentityGet(req: Request, res: Response) {
  res.render('identity/use-saved-proof-of-identity');
}

function securityQuestionsIntroGet(req: Request, res: Response) {
  res.render('identity/security-questions/intro');
}

function securityQuestionOneGet(req: Request, res: Response) {
  res.render('identity/security-questions/question-1');
}

function securityQuestionTwoGet(req: Request, res: Response) {
  res.render('identity/security-questions/question-2');
}

function securityQuestionThreeGet(req: Request, res: Response) {
  res.render('identity/security-questions/question-3');
}

function securityQuestionFourGet(req: Request, res: Response) {
  res.render('identity/security-questions/question-4');
}

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
