import express from "express";
import { callbackGet, loginGet, loginPost } from "../controllers/login"

const router = express.Router();

router.get('/', loginGet);
router.post('/', loginPost);
router.get('/callback', callbackGet);

export {router as loginRouter};
