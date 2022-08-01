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

export function whereWereYouBornGet(req: Request, res: Response): void {
  res.render("dbs/where-were-you-born");
}

export function ninoGet(req: Request, res: Response): void {
  res.render("dbs/nino");
}

export function drivingLicenceGet(req: Request, res: Response): void {
  res.render("dbs/driving-licence");
}

export function certificateAddressWhereGet(req: Request, res: Response): void {
  res.render("dbs/certificate-address-where");
}

export function emailAddressGet(req: Request, res: Response): void {
  res.render("dbs/email-address");
}

export function mobileNumberGet(req: Request, res: Response): void {
  res.render("dbs/mobile-number");
}

export function whoIsPayingGet(req: Request, res: Response): void {
  res.render("dbs/who-paying");
}

export function checkYourDetailsGet(req: Request, res: Response): void {
  res.render("dbs/check-your-details");
}

export function reviewYourApplicationGet(req: Request, res: Response): void {
  res.render("dbs/review-your-application");
}

export function disclaimerGet(req: Request, res: Response): void {
  res.render("dbs/disclaimer");
}
