import express from "express";

import redirectIfNotLoggedIn from "../lib/middleware/redirectIfNotLoggedIn";
import { accessGet, accessPost } from "../controllers/access";

const router = express.Router();

router.use((req, res, next) => {
  redirectIfNotLoggedIn(req, res, next);
});

router.get("/", accessGet);
router.post("/", accessPost);

export default router;
