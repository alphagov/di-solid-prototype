import { Request, Response } from "express";
import { getHostname } from "../config";

export function startGet(req: Request, res: Response): void {
  if (req.session) {
    const returnUri = req.params.returnUri
      ? req.params.returnUri
      : getHostname();

    req.session.ninoReturnUri = returnUri;
  }
  res.redirect("/nino/enter-your-number");
}

export function enterNinoGet(req: Request, res: Response): void {
  res.render("nino/enter-your-number");
}

export function enterNinoPost(req: Request, res: Response): void {
  if (req.session) {
    req.session.nino = req.body["ni-number"];
  }
  res.redirect("/nino/weve-verified-your-number");
}

export function verifiedNinoGet(req: Request, res: Response): void {
  res.render("nino/weve-verified-your-number");
}

export function verifiedNinoPost(req: Request, res: Response): void {
  res.redirect("/nino/youve-saved-your-number");
}

export function savedNinoGet(req: Request, res: Response): void {
  res.render("nino/youve-saved-your-number");
}

export function continueGet(req: Request, res: Response): void {
  if (req.session) {
    res.redirect(req.session.ninoReturnUri);
  } else {
    res.redirect("/");
  }
}
