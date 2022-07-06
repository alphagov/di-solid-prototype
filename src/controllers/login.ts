import { Request, Response } from "express";
import { getSessionFromStorage, Session } from "@inrupt/solid-client-authn-node";

import { getHostname, getClientId, getEssServiceURI, EssServices } from "../config";
import { createProfileAndPod } from "../lib/pod";

export async function loginGet(req: Request, res: Response): Promise<void> {
  res.render('login/start');
}

export async function loginPost(req: Request, res: Response): Promise<void> {
  const session = new Session();
  if (req.session != undefined) {
    req.session.sessionId = session.info.sessionId;
  }
  const redirectToSolidIdentityProvider = (url: string) => { res.redirect(url); };
  await session.login({
    redirectUrl: `${getHostname()}/login/callback`,
    clientId: getClientId('production'),
    oidcIssuer: getEssServiceURI(EssServices.OpenId),
    handleRedirect: redirectToSolidIdentityProvider,
  });
}

export async function callbackGet(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  await session?.handleIncomingRedirect(`${getHostname()}${req.originalUrl}`);

  if (session?.info.isLoggedIn && session.info.webId) {
    const response = await session.fetch(session.info.webId)
    if (response.status == 404) {
      await createProfileAndPod(session)
    }
    res.render('login/success', {webId: session.info.webId})
  }
}
