import { describe } from "mocha";
import { expect } from "./utils/test";
import { buildClientIdDocument, ClientIdDocument } from "../controllers/info";
import { getHostname, getClientId } from "../config";

describe("buildClientIdDocument", () => {
  let clientId: ClientIdDocument;

  beforeEach(() => {
    clientId = buildClientIdDocument();
  });

  it("contains a context of 'https://www.w3.org/ns/solid/oidc-context.jsonld'", () => {
    expect(clientId["@context"]).to.include(
      "https://www.w3.org/ns/solid/oidc-context.jsonld"
    );
  });

  it("sets the client_uri to the app's hostname", () => {
    expect(clientId.client_uri).to.eq(getHostname());
  });

  it("sets the client_id to /info/id", () => {
    expect(clientId.client_id).to.eq(getClientId());
  });

  it("includes the values required for a refresh token and offline access", () => {
    expect(clientId.grant_types).to.include("refresh_token");
    expect(clientId.scope).to.match(/offline_access/);
  });

  it("has a valid format for scope", () => {
    expect(clientId.scope).to.match(/[\w\s]+/);
  });

  describe("when the app is deployed", () => {
    before(() => {
      process.env.NODE_ENV = "production";
      clientId = buildClientIdDocument();
    });

    after(() => {
      process.env.NODE_ENV = "test";
    });

    it("always includes the local callback URL in redirect_uris", () => {
      expect(clientId.redirect_uris).to.include(
        "http://localhost:3000/login/callback"
      );
    });
  });
});
