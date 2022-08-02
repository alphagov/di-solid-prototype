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

export function accountActivityGet(req: Request, res: Response): void {
  res.render("account/activity");
}

export function accountHomeGet(req: Request, res: Response): void {
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

export function deleteYourProofOfIdGet(req: Request, res: Response): void {
  res.render("account/delete-proof-of-identity");
}

export async function deleteYourProofOfIdPost(
  req: Request,
  res: Response
): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  if (session) {
    const kvbRDF = await getDatasetUri(
      session,
      "private/govuk/identity/poc/credentials/vcs/kbv/metadata"
    );
    const kvbBlob = await getDatasetUri(
      session,
      "private/govuk/identity/poc/credentials/vcs/kbv/check"
    );
    const passportRDF = await getDatasetUri(
      session,
      "private/govuk/identity/poc/credentials/vcs/passport/metadata"
    );
    const passportBlob = await getDatasetUri(
      session,
      "private/govuk/identity/poc/credentials/vcs/passport/check"
    );
    try {
      await deleteFile(kvbRDF, { fetch: session.fetch });
      console.log(`Deleted:: ${kvbRDF}`);
    } catch (err) {
      console.error(err);
    }

    try {
      await deleteFile(kvbBlob, { fetch: session.fetch });
      console.log(`Deleted:: ${kvbBlob}`);
    } catch (err) {
      console.error(err);
    }

    try {
      await deleteFile(passportRDF, { fetch: session.fetch });
      console.log(`Deleted:: ${passportRDF}`);
    } catch (err) {
      console.error(err);
    }

    try {
      await deleteFile(passportBlob, { fetch: session.fetch });
      console.log(`Deleted:: ${passportBlob}`);
    } catch (err) {
      console.error(err);
    }
  }

  res.redirect("/account/settings/your-proof-of-identity");
}
