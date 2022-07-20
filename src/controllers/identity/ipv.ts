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

