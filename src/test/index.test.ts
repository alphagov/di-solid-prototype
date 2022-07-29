import { describe } from "mocha";
import { Request, Response } from "express";
import { sinon, expect } from "./utils/test";
import indexGet from "../controllers/indexController";

describe("indexController", () => {
  let sandbox: sinon.SinonSandbox;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {};
    res = { render: sinon.fake() };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should respond to a GET request", () => {
    indexGet(req as Request, res as Response);
    // eslint-disable-next-line no-unused-expressions
    expect(res.render).to.have.called;
  });
});
