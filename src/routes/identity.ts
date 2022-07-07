import express from "express";
import { saveGet } from "../controllers/identity/save"

const router = express.Router();

/* GET Save your identity page. */
router.get('/save', saveGet);

export { router as identityRouter };
