import express from "express";
import indexGet from "../controllers";

const router = express.Router();

/* GET home page. */
router.get("/", indexGet);

export default router;
