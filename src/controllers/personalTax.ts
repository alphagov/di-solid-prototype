import { Request, Response } from "express";
import { getHostname } from "../config";

export function homeGet(req: Request, res: Response): void {
  res.render("personal-tax/home");
}

export function signInOrSetUpGet(req: Request, res: Response): void {
  if (req.session) {
    req.session.journey = {
      nextPage: `${getHostname()}/personal-tax/choose-paperless`,
      title: "apply for personal tax account",
    };
  }
  res.render("personal-tax/sign-in-or-set-up");
}

export function signInOrSetUpPost(req: Request, res: Response): void {
  res.redirect("/identity");
}

export function choosePaperlessGet(req: Request, res: Response): void {
  if (req.session) {
    delete req.session.journey;
  }
  res.render("personal-tax/choose-paperless");
}

export function choosePaperlessPost(req: Request, res: Response): void {
  res.redirect("/personal-tax/home");
}
