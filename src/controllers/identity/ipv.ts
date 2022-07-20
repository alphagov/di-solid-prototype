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

/* Find your Address */
export function findAddressGet(req: Request, res: Response) {
  res.render("identity/find-address");
}

export function findAddressPost(req: Request, res: Response) {
  if (req.session) {
    if (!req.session.address) {
      req.session.address = {}
    }
    req.session.address = req.body;
  }
  res.redirect("/identity/choose-address");
}

/* Choose your Address */
export function chooseAddressGet(req: Request, res: Response) {
  if (req.session && req.session.address) {
    let postCode = req.session.address["address-postcode"].toUpperCase()
    res.render("identity/choose-address", { postCode: postCode });
  }
}

export function chooseAddressPost(req: Request, res: Response) {
  res.redirect("/identity/enter-address");
}

/* Enter your Address */
export function enterAddressGet(req: Request, res: Response) {
  if (req.session) {
    let postCode = req.session.address["address-postcode"].toUpperCase()
    res.render("identity/enter-address", { postCode: postCode });
  }
}

export function enterAddressPost(req: Request, res: Response) {
  if (req.session) {
    req.session.address = {
      "address-postcode": req.session.address["address-postcode"].toUpperCase(),
      ...req.body
    }
  }
  res.redirect("/identity/confirm-details");
}

