import { Request, Response } from "express";
import { getSessionFromStorage, Session } from "@inrupt/solid-client-authn-node";

import { getHostname, getClientId, getEssServiceURI, EssServices } from "../config";
import { createProfileAndPod } from "../lib/pod";


import { GDS_POC_MESSAGE, getLocalStore, CONTEXT_KEY_LOCALE } from "@inrupt/vocab-gds-poc-bundle-all-solidcommonvocab";

// Super-simple list of supported languages (i.e., translations for messages
// we have provided in our GDS-PoC-specific messages vocabulary).
const supportedLanguages = [ "en", "cy", "es" ];

// Super-simple way of iterating over and choosing the 'current' language we
// wish our messages to be presented to the user - i.e., literally just hit
// <Ctrl-R> to refresh the screen will iterate to the 'next supported
// language'...
let langToggleOnRefresh = 0;

export async function loginGet(req: Request, res: Response): Promise<void> {
  const langTag = supportedLanguages[langToggleOnRefresh++ % supportedLanguages.length];
  getLocalStore().setItem(CONTEXT_KEY_LOCALE, langTag);

  res.render('login/start', { GDS_POC_MESSAGE, langTag });
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
    res.render('login/success', { GDS_POC_MESSAGE, webId: session.info.webId })
  }
}
