import { Request, Response } from "express";

export function completeSavedGet(req: Request, res: Response) {
  res.render("identity/complete/saved");
}

export function completeReturnGet(req: Request, res: Response) {
  res.render("identity/complete/return");
}
