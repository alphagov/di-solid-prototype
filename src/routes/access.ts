import express from "express";
import { Request, Response, NextFunction } from "express";
import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";

import { accessGet, accessPost } from "../controllers/access"

const router = express.Router();

async function redirectIfNotLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.session == undefined) { res.redirect("/login") }
  const session = await getSessionFromStorage(req.session?.sessionId);

  if (!session?.info.isLoggedIn) {
    res.redirect("/login");
  } else {
    next()
  }
}

router.use((req, res, next) => {
  redirectIfNotLoggedIn(req, res, next);
})

router.get('/', accessGet);
router.post('/', accessPost);

export {router as accessRouter};
