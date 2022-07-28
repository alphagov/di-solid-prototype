import { Request, Response } from "express";

export function completeSavedGet(req: Request, res: Response) {
  res.render("identity/complete/saved");
  if (req.session) {
    res.render("identity/complete/saved", {
      doThing: req.session.journey.title,
      doThingAction: req.session.journey.nextPage,
      doThinglink: req.session.journey.nextPage,
    });
  }
}

export function completeReturnGet(req: Request, res: Response) {
  res.render("identity/complete/return");
}

export function identityConfirmedGet(req: Request, res: Response) {
  if (req.session) {
    const journeyDetails = req.session.journey;
    delete req.session.journey;
    res.render("identity/complete/identity-confirmed", {
      doThing: journeyDetails.title,
      doThingAction: journeyDetails.nextPage,
    });
  }
}
