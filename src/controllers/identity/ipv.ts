import { Request, Response } from "express";

export function checkYourDetailsGet(req: Request, res: Response) {
  res.render("identity/check-your-details");
}

export function chooseAddressGet(req: Request, res: Response) {
  res.render("identity/choose-address");
}

export function confirmDetailsGet(req: Request, res: Response) {
  res.render("identity/confirm-details");
}

export function enterAddressGet(req: Request, res: Response) {
  res.render("identity/enter-address");
}

export function enterPassportGet(req: Request, res: Response) {
  res.render("identity/enter-passport");
}

export function findAddressGet(req: Request, res: Response) {
  res.render("identity/find-address");
}

export function proveIdentityLoggedOutGet(req: Request, res: Response) {
  res.render("identity/prove-identity-logged-out");
}

export function proveIdentityGet(req: Request, res: Response) {
  res.render("identity/prove-identity");
}

export function useSavedProofOfIdentityGet(req: Request, res: Response) {
  res.render("identity/use-saved-proof-of-identity");
}

export function securityQuestionsIntroGet(req: Request, res: Response) {
  res.render("identity/security-questions/intro");
}

export function securityQuestionOneGet(req: Request, res: Response) {
  res.render("identity/security-questions/question-1");
}

export function securityQuestionTwoGet(req: Request, res: Response) {
  res.render("identity/security-questions/question-2");
}

export function securityQuestionThreeGet(req: Request, res: Response) {
  res.render("identity/security-questions/question-3");
}

export function securityQuestionFourGet(req: Request, res: Response) {
  res.render("identity/security-questions/question-4");
}
