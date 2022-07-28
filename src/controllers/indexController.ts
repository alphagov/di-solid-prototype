import { Request, Response } from "express";

export async function indexGet(req: Request, res: Response): Promise<void> {
  res.render("index");
}
