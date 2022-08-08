import express from "express";
import { enterNinoGet, enterNinoPost } from "../controllers/nino";

const router = express.Router();

router.get("/enter-your-number", enterNinoGet);
router.post("/enter-your-number", enterNinoPost);

export default router;
