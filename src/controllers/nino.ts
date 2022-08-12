import {
  getSessionFromStorage,
  Session,
} from "@inrupt/solid-client-authn-node";
import {
  issueAccessRequest,
  AccessRequest,
  redirectToAccessManagementUi,
} from "@inrupt/solid-client-access-grants";
import { Request, Response } from "express";
import { getHostname } from "../config";
import SessionError from "../errors";
import { getDatasetUri, writeCheckToPod } from "../lib/pod";
import buildNiNumberArtifacts from "../lib/nationalInsurance";

type WebId = string;
type Uri = string;

async function fakeOIDCLogin(): Promise<Session> {
  const session = new Session();
  return session
    .login({
      // 2. Use the authenticated credentials to log in the session.
      clientId: "cd68b569-0b92-42dd-9993-879909502979",
      clientSecret: "7bd94621-21bf-4703-b9a2-5691d886854d",
      oidcIssuer: "https://openid.ess.solid.integration.account.gov.uk/",
    })
    .then(() => session);
}

function requestAccessToWriteNino(
  ninoContainerUri: Uri,
  resourceOwner: WebId,
  requestorSession: Session
): Promise<AccessRequest | null> {
  // DWP sets the requested access (if granted) to expire in 5 minutes.
  const accessExpiration = new Date(Date.now() + 5 * 60000);
  const accessEndpoint = `https://vc.ess.solid.integration.account.gov.uk`;

  // Call `issueAccessRequest` to create an access request
  return issueAccessRequest(
    {
      access: { write: true },
      resourceOwner,
      resources: [ninoContainerUri],
      expirationDate: accessExpiration,
      purpose: [`${getHostname()}/purposes#write-nino`],
    },
    { fetch: requestorSession.fetch, accessEndpoint } // From the requestor's (i.e., DWP's) authenticated session
  );
}

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

export async function verifiedNinoPost(
  req: Request,
  res: Response
): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);

  if (session && req.session) {
    req.session.webId = session.info.webId;
    const containerUri = await getDatasetUri(
      session,
      "private/govuk/identity/poc/credentials/vcs"
    );

    const niNumberArtifacts = buildNiNumberArtifacts(req.session, containerUri);
    await writeCheckToPod(session, niNumberArtifacts);

    res.redirect("/nino/youve-saved-your-number");
  } else {
    throw new SessionError();
  }
}

export function savedNinoGet(req: Request, res: Response): void {
  res.render("nino/youve-saved-your-number");
}

export async function beginAccessGrantsFlow(
  req: Request,
  res: Response
): Promise<void> {
  const resourceOwnerSession = await getSessionFromStorage(
    req.session?.sessionId
  );

  if (resourceOwnerSession) {
    const resourceOwnerWebId = resourceOwnerSession.info.webId;
    if (resourceOwnerWebId) {
      const ninoContainerUri = await getDatasetUri(
        resourceOwnerSession,
        "private/govuk/identity/poc/credentials/national-insurance-number/"
      );

      const requestorSession = await fakeOIDCLogin();

      const accessRequest = await requestAccessToWriteNino(
        ninoContainerUri,
        resourceOwnerWebId,
        requestorSession
      );

      if (accessRequest) {
        await redirectToAccessManagementUi(
          accessRequest.id,
          `${getHostname()}/nino/save-number`,
          {
            redirectCallback: (url) => {
              res.redirect(url);
            },
            fallbackAccessManagementUi: `${getHostname()}/account/access-management`,
            fetch: resourceOwnerSession.fetch,
          }
        );
      }
    }
  }
}
export function continueGet(req: Request, res: Response): void {
  if (req.session) {
    res.redirect(req.session.ninoReturnUri);
  } else {
    res.redirect("/");
  }
}
