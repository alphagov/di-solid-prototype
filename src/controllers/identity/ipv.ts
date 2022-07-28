import { Request, Response } from "express";
import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";
import { hasSavedIdentityChecks } from "../../lib/pod";

export async function proveIdentityStartGet(req: Request, res: Response) {
  const session = await getSessionFromStorage(req.session?.sessionId);
  if (session) {
    if (await hasSavedIdentityChecks(session)) {
      res.redirect("/identity/use-saved-proof-of-identity");
    } else res.redirect("identity/prove-identity");
  }
}

/* Prove your Identity */
export function proveIdentityLoggedOutGet(req: Request, res: Response) {
  res.render("identity/prove-identity-logged-out");
}

export function proveIdentityLoggedOutPost(req: Request, res: Response) {
  if (req.body["prove-identity-options"] == "account") {
    res.redirect("/identity");
  } else if (req.body["prove-identity-options"] == "in-person") {
    res.redirect("/identity/check-in-person");
  }
}

export function proveIdentityGet(req: Request, res: Response) {
  res.render("identity/prove-identity");
}

/* Enter your Passport details exactly as they appear on your Passport */
export function enterPassportGet(req: Request, res: Response) {
  res.render("identity/enter-passport");
}

export function enterPassportPost(req: Request, res: Response) {
  if (req.session) {
    req.session.passport = req.body;
  }
  res.redirect("/identity/find-address");
}

/* Find your Address */
export function findAddressGet(req: Request, res: Response) {
  res.render("identity/find-address");
}

export function findAddressPost(req: Request, res: Response) {
  if (req.session) {
    if (!req.session.address) {
      req.session.address = {};
    }
    req.session.address = req.body;
  }
  res.redirect("/identity/choose-address");
}

/* Choose your Address */
export function chooseAddressGet(req: Request, res: Response) {
  if (req.session && req.session.address) {
    const postCode = req.session.address["address-postcode"].toUpperCase();
    res.render("identity/choose-address", { postCode: postCode });
  }
}

export function chooseAddressPost(req: Request, res: Response) {
  res.redirect("/identity/enter-address");
}

/* Enter your Address */
export function enterAddressGet(req: Request, res: Response) {
  if (req.session) {
    const postCode = req.session.address["address-postcode"].toUpperCase();
    res.render("identity/enter-address", { postCode: postCode });
  }
}

export function enterAddressPost(req: Request, res: Response) {
  if (req.session) {
    req.session.address = {
      "address-postcode": req.session.address["address-postcode"].toUpperCase(),
      ...req.body,
    };
  }
  res.redirect("/identity/confirm-details");
}

/* Confirm your Details */
export function confirmDetailsGet(req: Request, res: Response) {
  if (req.session) {
    res.render("identity/confirm-details", {
      postCode: req.session.address["address-postcode"].toUpperCase(),
      startedYear: req.session.address.year,
    });
  }
}

export function confirmDetailsPost(req: Request, res: Response) {
  if (req.session) {
    req.session.confirmed = true;
  }
  res.redirect("/identity/check-your-details");
}

/* Check your Details */
export function checkYourDetailsGet(req: Request, res: Response) {
  res.render("identity/check-your-details");
}

/* Security Question Flow */
export function securityQuestionsIntroGet(req: Request, res: Response) {
  res.render("identity/security-questions/intro");
}

/* Security Question 1 */
export function securityQuestionOneGet(req: Request, res: Response) {
  res.render("identity/security-questions/question-1");
}

/* Security Question 2 */
export function securityQuestionTwoGet(req: Request, res: Response) {
  res.render("identity/security-questions/question-2");
}

/* Security Question 3 */
export function securityQuestionThreeGet(req: Request, res: Response) {
  res.render("identity/security-questions/question-3");
}

/* Security Question 4 */
export function securityQuestionFourGet(req: Request, res: Response) {
  res.render("identity/security-questions/question-4");
}

/* Security Question State Machine */
export function securityQuestionPost(req: Request, res: Response) {
  if (req.session) {
    req.session.kvb = {
      ...req.session.kvb,
      ...req.body,
    };
    if (!req.session.kvb["mortgage-amount"]) {
      res.redirect("/identity/security-questions/question-1");
    } else if (!req.session.kvb["mobile-contract-value"]) {
      res.redirect("/identity/security-questions/question-2");
    } else if (!req.session.kvb["mobile-contract-start"]) {
      res.redirect("/identity/security-questions/question-3");
    } else if (!req.session.kvb["loan"]) {
      res.redirect("/identity/security-questions/question-4");
    } else {
      res.redirect("/identity/save");
    }
  }
}

export function checkInPersonGet(req: Request, res: Response) {
  res.render("identity/check-in-person");
}

export function useSavedProofOfIdentityGet(req: Request, res: Response) {
  res.render("identity/use-saved-proof-of-identity");
}
