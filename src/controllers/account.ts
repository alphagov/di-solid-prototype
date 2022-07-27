import { Request, Response } from "express";
import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";
import { hasSavedIdentityChecks } from "../lib/pod";

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
  const session = await getSessionFromStorage(req.session?.sessionId);

  if (session) {
    res.render("account/your-proof-of-identity", {
      hasSavedIdentityChecks: await hasSavedIdentityChecks(session),
    });
  }
}

export async function deleteYourProofOfIdGet(
  req: Request,
  res: Response
): Promise<void> {
  res.render("account/delete-proof-of-identity");
}
