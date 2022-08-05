import { Request, Response } from "express";

export function indexGet(req: Request, res: Response): void {
  res.render("index");
}

export function journeyEndGet(req: Request, res: Response): void {
  res.render("end");
}

export default indexGet;
