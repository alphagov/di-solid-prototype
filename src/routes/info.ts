import express from "express";
import { idGet } from "../controllers/info"

const router = express.Router();

router.get('/id', idGet);

export {router as infoRouter};
