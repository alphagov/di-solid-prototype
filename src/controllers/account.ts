import { Request, Response } from "express";

export async function accountSettingsGet(
  req: Request,
  res: Response
): Promise<void> {
  res.render("account/settings");
}

export async function accountActivityGet(
  req: Request,
  res: Response
): Promise<void> {
  res.render("account/activity");
}

export async function accountHomeGet(
  req: Request,
  res: Response
): Promise<void> {
  res.render("account/home");
}

export async function yourProofOfIdGet(
  req: Request,
  res: Response
): Promise<void> {
  res.render("account/your-proof-of-identity");
}

export async function deleteYourProofOfIdGet(
  req: Request,
  res: Response
): Promise<void> {
  res.render("account/delete-proof-of-identity");
}
