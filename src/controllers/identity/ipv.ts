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

export function checkYourDetailsPost(req: Request, res: Response) {
  res.redirect("/identity/choose-address");
}

export function chooseAddressPost(req: Request, res: Response) {
  res.redirect("/identity/confirm-details");
}

export function confirmDetailsPost(req: Request, res: Response) {
  res.redirect("/identity/enter-address");
}

export function enterAddressPost(req: Request, res: Response) {
  res.redirect("/identity/enter-passport");
}

export function enterPassportPost(req: Request, res: Response) {
  res.redirect("/identity/find-address");
}

export function findAddressPost(req: Request, res: Response) {
  res.redirect("/identity/prove-identity-logged-out");
}

export function proveIdentityLoggedOutPost(req: Request, res: Response) {
  res.redirect("/identity/prove-identity");
}

export function proveIdentityPost(req: Request, res: Response) {
  res.redirect("/identity/use-saved-proof-of-identity");
}

export function useSavedProofOfIdentityPost(req: Request, res: Response) {
  res.redirect("/identity/security-questions/intro");
}

export function securityQuestionsIntroPost(req: Request, res: Response) {
  res.redirect("/identity/security-questions/question-1");
}

export function securityQuestionOnePost(req: Request, res: Response) {
  res.redirect("/identity/security-questions/question-2");
}

export function securityQuestionTwoPost(req: Request, res: Response) {
  res.redirect("/identity/security-questions/question-3");
}

export function securityQuestionThreePost(req: Request, res: Response) {
  res.redirect("/identity/security-questions/question-4");
}

export function securityQuestionFourPost(req: Request, res: Response) {
  res.redirect("//complete/saved");
}
