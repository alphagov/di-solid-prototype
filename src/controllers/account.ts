import { Request, Response } from "express";
import {
  getSessionFromStorage,
  Session,
} from "@inrupt/solid-client-authn-node";

import { VerifiableCredential } from "@inrupt/solid-client-vc";

import {
  approveAccessRequest,
  denyAccessRequest,
} from "@inrupt/solid-client-access-grants";

import { deleteFile } from "@inrupt/solid-client";

import { getCheckStoragePath } from "../config";
import {
  hasSavedIdentityChecks,
  getDatasetUri,
  getCredentialMetadataFromPod,
} from "../lib/pod";

async function kvbRDFUri(session: Session): Promise<string> {
  return getDatasetUri(session, `${getCheckStoragePath()}/kbv/metadata`);
}

async function passportRDFUri(session: Session): Promise<string> {
  return getDatasetUri(session, `${getCheckStoragePath()}/passport/metadata`);
}

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
    const hasVcs = await hasSavedIdentityChecks(session);
    if (hasVcs) {
      const kvbMetadata = await getCredentialMetadataFromPod(
        session,
        await kvbRDFUri(session)
      );
      const passportMetadata = await getCredentialMetadataFromPod(
        session,
        await passportRDFUri(session)
      );

      res.render("account/your-proof-of-identity", {
        hasSavedIdentityChecks: hasVcs,
        kvbMetadata,
        passportMetadata,
      });
    }
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
    const kvbRDF = await kvbRDFUri(session);
    const kvbBlob = await getDatasetUri(
      session,
      `${getCheckStoragePath()}/kbv/check`
    );
    const passportRDF = await passportRDFUri(session);
    const passportBlob = await getDatasetUri(
      session,
      `${getCheckStoragePath()}/passport/check`
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

const isVerifiableCredential = (vc: any): vc is VerifiableCredential =>
  typeof vc === "object" && "credentialSubject" in vc;

const isString = (jwt: any): jwt is string => typeof jwt === "string";

function decodeAccessRequestVC(encodedJwt: string): VerifiableCredential {
  if (!encodedJwt) {
    throw new Error("no encoded token found");
  }

  const buff = Buffer.from(encodedJwt, "base64");
  const decodedToken = JSON.parse(buff.toString("utf-8"));

  if (!isVerifiableCredential(decodedToken)) {
    throw new Error("invalid token object");
  }
  return decodedToken;
}

function validateAccessRequestVC(
  decodedVC: VerifiableCredential
): true | false {
  // Not implimented but left here as a hint that this is logic we'd need for
  // a production service, we should validate the
  const notImplimented = true;

  if (notImplimented) {
    return true;
  }

  const err = "VC is invalid in some way";
  console.log(err);
  console.log(decodedVC);

  return false;
}

export async function accessManagementGet(
  req: Request,
  res: Response
): Promise<void> {
  const solidSession = await getSessionFromStorage(req.session?.sessionId);
  const appSession = req.session;
  if (solidSession && appSession) {
    if (req.query) {
      const { requestVc, redirectUrl, requestVcUrl } = req.query;
      if (isString(requestVc) && isString(redirectUrl)) {
        // Decode the request VC
        appSession.requestVcDecoded = decodeAccessRequestVC(requestVc);

        if (!appSession.requestVcDecoded) {
          res.redirect("account/access-management/errors/vc-not-decodable");
        }

        // Validate the VC
        if (!validateAccessRequestVC(appSession.requestVcDecoded)) {
          res.redirect("account/access-management/errors/vc-invalid");
        }

        const { credentialSubject } = appSession.requestVcDecoded;

        res.render("account/access-management", {
          credentialSubject,
          requestVc,
          requestVcUrl,
          redirectUrl,
        });
      }
    } else {
      res.redirect("account/access-management/errors/no-vc-request-found");
    }
  }
}

export async function accessManagementPost(
  req: Request,
  res: Response
): Promise<void> {
  if (req.body) {
    const solidSession = await getSessionFromStorage(req.session?.sessionId);
    const { requestVcUrl, redirectUrl, consent } = req.body;
    if (solidSession && isString(redirectUrl)) {
      if (consent === "yes") {
        const approvedVc = await approveAccessRequest(requestVcUrl, undefined, {
          fetch: solidSession.fetch,
        });
        res.redirect(`${redirectUrl}?accessGrantUrl=${approvedVc.id}`);
      }

      if (consent === "no") {
        const deniedVC = await denyAccessRequest(requestVcUrl, {
          fetch: solidSession.fetch,
        });
        res.redirect(`${redirectUrl}?accessGrantUrl=${deniedVC.id}`);
      }
    }
  }
}
