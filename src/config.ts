export function getPort() {
  return process.env.PORT || 3000;
}

export function getSessionKeys() {
  return ["key1", "key2"];
}

export function getGdsEssDomain() {
  return "solid.integration.account.gov.uk";
}

export function getDeployedDomain() {
  return "prototype.solid.integration.account.gov.uk";
}

export function getProtocol() {
  return process.env.NODE_ENV === "production" ? "https" : "http";
}

export function getHostname() {
  const hostname =
    process.env.NODE_ENV === "production"
      ? getDeployedDomain()
      : `localhost:${getPort()}`;
  return `${getProtocol()}://${hostname}`;
}

export function getClientId(environment?: string) {
  let hostname: string;
  if (environment && environment === "production") {
    hostname = `https://${getDeployedDomain()}`;
  } else {
    hostname = getHostname();
  }
  return `${hostname}/info/id`;
}

export function getJwtSigningKey() {
  // This is a prototype, so we're not worried about the security of our key
  return "not-a-secret-key";
}

export enum EssServices {
  Authorization = "authorization",
  Provision = "provision",
  Storage = "storage",
  OpenId = "openid",
  Id = "id",
  Uma = "uma",
  Vc = "vc",
}

export function getEssServiceURI(service: EssServices) {
  return `https://${service}.ess.solid.integration.account.gov.uk`;
}

export function getCheckStoragePath(): string {
  return "private/govuk/identity/poc/credentials/vcs";
}

export function getEssFragmentIndexerWebId() {
  return `https://fragments-indexer.ess.${getGdsEssDomain()}/id`;
}
