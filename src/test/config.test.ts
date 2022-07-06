import { describe } from "mocha";
import { expect } from "./utils/test";
import { getClientId, getDeployedDomain, getHostname } from "../config"

describe("config", () => {
  describe("getClientId", () => {
    it("returns the expected client ID URI", () => {
      const clientId = getClientId();
      expect(clientId).to.eq(`${getHostname()}/info/id`)
    })

    it("returns the production URI when `environment` is set", () => {
      const clientId = getClientId('production');
      expect(clientId).to.eq(`https://${getDeployedDomain()}/info/id`)
    })
  })
})
