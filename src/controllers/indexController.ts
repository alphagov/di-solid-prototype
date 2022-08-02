import { Request, Response } from "express";

function indexGet(req: Request, res: Response): void {
  res.render("index");
}

export default indexGet;
