import { Request, Response, NextFunction } from "express";

import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";
import { getHostname } from "../../config";

async function redirectIfNotLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = await getSessionFromStorage(req.session?.sessionId);

  if (!session?.info.isLoggedIn) {
    res.redirect(`${getHostname()}/login?returnUri=${req.originalUrl}`);
  } else {
    next();
  }
}

export default redirectIfNotLoggedIn;
