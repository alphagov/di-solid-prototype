import express from "express";
import { indexGet, journeyEndGet } from "../controllers";

const router = express.Router();

/* GET home page. */
router.get("/", indexGet);

router.get("/end", journeyEndGet);

export default router;
