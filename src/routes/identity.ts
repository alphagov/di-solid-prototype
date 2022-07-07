import express from "express";
import { saveGet, savePost } from "../controllers/identity/save"

const router = express.Router();

/* GET Save your identity page. */
router.get('/save', saveGet);
router.post('/save', savePost);

export { router as identityRouter };
