import { Request, Response } from "express";

async function indexGet(req: Request, res: Response): Promise<void> {
  res.render("index");
}

export default indexGet;
