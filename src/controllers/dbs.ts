import { Request, Response } from "express";
import { getHostname } from "../config";

export function dbsContentPageGet(req: Request, res: Response): void {
  if (req.session) {
    req.session.journey = {
      nextPage: `${getHostname()}/dbs/apply-for-a-basic-dbs-check`,
      title: "apply for a basic DBS check",
    };
  }
  res.render("dbs/request-a-basic-dbs-check");
}

export function proveYourIdentityGet(req: Request, res: Response): void {
  res.render("dbs/prove-your-identity");
}

export function proveYourIdentityPost(req: Request, res: Response): void {
  res.redirect(`${getHostname()}/identity/prove-identity-logged-out`);
}

export function applyGet(req: Request, res: Response): void {
  res.render("dbs/apply-for-a-basic-dbs-check");
}

export function otherNamesGet(req: Request, res: Response): void {
  res.render("dbs/other-names");
}

export function whatIsYourSexGet(req: Request, res: Response): void {
  res.render("dbs/what-is-your-sex");
}

export function whatIsYourSexPost(req: Request, res: Response): void {
  if (req.session) {
    req.session.dbs = {};
    req.session.dbs.sex = req.body;
  }
  res.redirect("/dbs/where-were-you-born");
}

export function whereWereYouBornGet(req: Request, res: Response): void {
  res.render("dbs/where-were-you-born");
}

export function whereWereYouBornPost(req: Request, res: Response): void {
  if (req.session) {
    req.session.dbs.whereBorn = req.body;
  }
  res.redirect("/dbs/nino");
}

export function ninoGet(req: Request, res: Response): void {
  res.render("dbs/nino");
}

export function ninoPost(req: Request, res: Response): void {
  if (req.session) {
    req.session.dbs.nino = req.body;
  }
  res.redirect("/dbs/driving-licence");
}

export function drivingLicenceGet(req: Request, res: Response): void {
  res.render("dbs/driving-licence");
}

export function drivingLicencePost(req: Request, res: Response): void {
  if (req.session) {
    req.session.dbs.drivingLicence = req.body;
  }
  res.redirect("/dbs/certificate-address-where");
}

export function certificateAddressWhereGet(req: Request, res: Response): void {
  res.render("dbs/certificate-address-where");
}

export function certificateAddressWherePost(req: Request, res: Response): void {
  if (req.session) {
    req.session.dbs.certificateAddress = req.body;
  }
  res.redirect("/dbs/email-address");
}

export function emailAddressGet(req: Request, res: Response): void {
  res.render("dbs/email-address");
}

export function emailAddressPost(req: Request, res: Response): void {
  if (req.session) {
    req.session.dbs.email = req.body;
  }
  res.redirect("/dbs/mobile-number");
}

export function mobileNumberGet(req: Request, res: Response): void {
  res.render("dbs/mobile-number");
}

export function mobileNumberPost(req: Request, res: Response): void {
  if (req.session) {
    req.session.dbs.mobile = req.body;
  }
  res.redirect("/dbs/who-paying");
}

export function whoIsPayingGet(req: Request, res: Response): void {
  res.render("dbs/who-paying");
}

export function whoIsPayingPost(req: Request, res: Response): void {
  if (req.session) {
    req.session.dbs.paying = req.body;
  }
  res.redirect("/dbs/check-your-details");
}

export function checkYourDetailsGet(req: Request, res: Response): void {
  if (req.session) {
    res.render("dbs/check-your-details", {
      mobileNumber: req.session.dbs.mobile.number,
      emailAddress: req.session.dbs.email.email,
      whoPaying: req.session.dbs.paying.mobile,
    });
  }
}

export function checkYourDetailsPost(req: Request, res: Response): void {
  res.redirect("/dbs/review-your-application");
}

export function reviewYourApplicationGet(req: Request, res: Response): void {
  res.render("dbs/review-your-application");
}

export function reviewYourApplicationPost(req: Request, res: Response): void {
  res.redirect("/dbs/disclaimer");
}

export function disclaimerGet(req: Request, res: Response): void {
  res.render("dbs/disclaimer");
}

export function disclaimerPost(req: Request, res: Response): void {
  res.redirect("/end");
}
