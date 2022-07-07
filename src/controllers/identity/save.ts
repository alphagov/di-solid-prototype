import { Request, Response } from "express";

export function saveGet(req: Request, res: Response) {
    res.render('identity/save');
}
