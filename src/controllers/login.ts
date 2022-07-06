import { Request, Response } from "express";
import { getSessionFromStorage, Session } from "@inrupt/solid-client-authn-node";

import { getHostname, getClientId } from "../config";

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
    oidcIssuer: "https://openid.ess.solid.integration.account.gov.uk/",
    clientId: getClientId('production'),
    handleRedirect: redirectToSolidIdentityProvider,
  });
}

export async function callbackGet(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  await session?.handleIncomingRedirect(`${getHostname()}${req.originalUrl}`);

  if (session?.info.isLoggedIn) {
    res.render('login/success', {webId: session?.info.webId})
  }
}
