import { Request, Response } from "express";
import {
  getSessionFromStorage,
  Session,
} from "@inrupt/solid-client-authn-node";

import {
  getHostname,
  getClientId,
  getEssServiceURI,
  EssServices,
} from "../config";
import { createProfileAndPod } from "../lib/pod";

export function loginGet(req: Request, res: Response): void {
  const session = new Session();
  if (req.session) {
    req.session.sessionId = session.info.sessionId;
    if (req.query.returnUri) {
      req.session.returnUri = req.query.returnUri;
    }
  }
  const redirectToSolidIdentityProvider = (url: string) => {
    res.redirect(url);
  };
  session.login({
    redirectUrl: `${getHostname()}/login/callback`,
    clientId: getClientId("production"),
    oidcIssuer: getEssServiceURI(EssServices.OpenId),
    handleRedirect: redirectToSolidIdentityProvider,
  });
}

export async function callbackGet(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  await session?.handleIncomingRedirect(`${getHostname()}${req.originalUrl}`);

  if (session?.info.isLoggedIn && session.info.webId) {
    const response = await session.fetch(session.info.webId);
    if (response.status === 404) {
      await createProfileAndPod(session);
    }

    if (req.session && req.session.returnUri) {
      const { returnUri } = req.session;
      delete req.session.returnUri;
      res.redirect(returnUri);
    } else {
      res.redirect("/identity");
    }
  }
}
