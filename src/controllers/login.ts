import { Request, Response } from "express";
import { getSessionFromStorage, Session } from "@inrupt/solid-client-authn-node";

import { getPort } from "../config";

const port = getPort();

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
    redirectUrl: `http://localhost:${port}/login/callback`,
    oidcIssuer: "https://login.inrupt.com",
    clientName: "GDS Solid proof of concept app",
    handleRedirect: redirectToSolidIdentityProvider,
  });
}

export async function callbackGet(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  await session?.handleIncomingRedirect(`http://localhost:${port}${req.originalUrl}`);

  if (session?.info.isLoggedIn) {
    res.render('login/success', {webId: session?.info.webId})
  }
}
