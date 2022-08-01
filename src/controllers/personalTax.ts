import { Request, Response } from "express";
import { getHostname } from "../config";

export async function homeGet(req: Request, res: Response): Promise<void> {
  res.render("personal-tax/home");
}

export async function signInOrSetUpGet(
  req: Request,
  res: Response
): Promise<void> {
  if (req.session) {
    req.session.journey = {
      nextPage: `${getHostname()}/personal-tax/choose-paperless`,
      title: "apply for personal tax account",
    };
  }
  res.render("personal-tax/sign-in-or-set-up");
}

export async function signInOrSetUpPost(
  req: Request,
  res: Response
): Promise<void> {
  res.redirect("/identity");
}

export async function choosePaperlessGet(
  req: Request,
  res: Response
): Promise<void> {
  res.render("personal-tax/choose-paperless");
}

export async function choosePaperlessPost(
  req: Request,
  res: Response
): Promise<void> {
  res.redirect("/personal-tax/home");
}
