import { Request, Response } from "express";

export function enterNinoGet(req: Request, res: Response): void {
  res.render("nino/enter-your-number");
}

export function enterNinoPost(req: Request, res: Response): void {
  res.redirect("/nino/enter-your-number");
}
