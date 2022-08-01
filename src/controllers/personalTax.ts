import { Request, Response } from "express";

export async function signInOrSetUpGet(
  req: Request,
  res: Response
): Promise<void> {
  res.render("personal-tax/sign-in-or-set-up");
}

export async function homeGet(req: Request, res: Response): Promise<void> {
  res.render("personal-tax/home");
}

export async function signInOrSetUpPost(
  req: Request,
  res: Response
): Promise<void> {
  res.redirect("/personal-tax/choose-paperless");
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
