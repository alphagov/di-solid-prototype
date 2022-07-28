import express from "express";
import { indexGet } from "../controllers/indexController";

const router = express.Router();

/* GET home page. */
router.get("/", indexGet);

export { router as indexRouter };
