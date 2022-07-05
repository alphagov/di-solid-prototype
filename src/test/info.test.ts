import { describe } from "mocha";
import { expect } from "./utils/test";
import { buildClientIdDocument, ClientIdDocument } from "../controllers/info"
import { getHostname } from "../config"

describe("buildClientIdDocument", () => {
  let clientId: ClientIdDocument;

  beforeEach(() => {
    clientId = buildClientIdDocument();
  })

  it("contains a context of 'https://www.w3.org/ns/solid/oidc-context.jsonld'", () => {
    expect(clientId["@context"]).to.include("https://www.w3.org/ns/solid/oidc-context.jsonld")
  })

  it("sets the client_uri to the app's hostname", () => {
    expect(clientId["client_uri"]).to.eq(getHostname())
  })

  it("sets the client_id to /info/id", () => {
    expect(clientId["client_id"]).to.eq(`${getHostname()}/info/id`)
  })
})
