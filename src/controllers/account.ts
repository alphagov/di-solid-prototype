import { Request, Response } from "express";
import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";
import { deleteFile } from "@inrupt/solid-client";
import { hasSavedIdentityChecks, getDatasetUri } from "../lib/pod";

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

export async function deleteYourProofOfIdPost(
  req: Request,
  res: Response
): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  if (session) {
    const kvbUri = await getDatasetUri(
      session,
      "private/govuk/identity/poc/credentials-pat/vcs/kbv/metadata"
    );
    const passportUri = await getDatasetUri(
      session,
      "private/govuk/identity/poc/credentials-pat/vcs/passport/metadata"
    );
    try {
      await deleteFile(kvbUri, { fetch: session.fetch });
      console.log(`Deleted:: ${kvbUri}`);
    } catch (err) {
      console.error(err);
    }

    try {
      await deleteFile(passportUri, { fetch: session.fetch });
      console.log(`Deleted:: ${passportUri}`);
    } catch (err) {
      console.error(err);
    }
  }

  res.redirect("/account/settings/your-proof-of-identity");
}
