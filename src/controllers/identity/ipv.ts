import { Request, Response } from "express";

/* Prove your Identity */
export function proveIdentityLoggedOutGet(req: Request, res: Response) {
  res.render("identity/prove-identity-logged-out");
}

export function proveIdentityLoggedOutPost(req: Request, res: Response) {
  if (req.body["prove-identity-options"] == "account") {
    res.redirect("/identity/prove-identity");
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

