import { Request, Response } from "express";
import { getHostname } from "../config";

export async function dbsContentPageGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/request-a-basic-dbs-check');
}

export async function proveYourIdentityGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/prove-your-identity');
}

export function proveYourIdentityPost(req: Request, res: Response): void {
  res.redirect(`${getHostname()}/identity/prove-identity-logged-out`);
}

export async function applyGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/apply-for-a-basic-dbs-check');
}

export async function otherNamesGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/other-names');
}

export async function whatIsYourSexGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/what-is-your-sex');
}

export async function whereWereYouBornGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/where-were-you-born');
}

export async function ninoGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/nino');
}

export async function drivingLicenceGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/driving-licence');
}

export async function certificateAddressWhereGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/certificate-address-where');
}

export async function emailAddressGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/email-address');
}

export async function mobileNumberGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/mobile-number');
}

export async function whoIsPayingGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/who-paying');
}

export async function checkYourDetailsGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/check-your-details');
}

export async function reviewYourApplicationGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/review-your-application');
}

export async function disclaimerGet(req: Request, res: Response): Promise<void> {
  res.render('dbs/disclaimer');
}
