import express from "express";
import { Request, Response, NextFunction } from "express";
import {
    saveGet,
    savePost,
} from "../controllers/identity/save"

import {
    completeSavedGet,
    completeReturnGet,
} from "../controllers/identity/complete"

import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";

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

router.use((req: Request, res: Response, next: NextFunction) => {
    redirectIfNotLoggedIn(req, res, next);
})

/* Save your identity page. */
router.get('/save', saveGet);
router.post('/save', savePost);

/* IPV Core completion pages */
router.get('/complete/saved', completeSavedGet);
router.get('/complete/return', completeReturnGet);

export { router as identityRouter };
