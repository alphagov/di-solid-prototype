export function getPort() {
  return process.env.PORT || 3000;
}

export function getSessionKeys() {
  return ["key1", "key2"];
}

export function getDeployedDomain() {
  return 'prototype.solid.integration.account.gov.uk'
}

export function getHostname() {
  const hostname = process.env.NODE_ENV == 'production' ? getDeployedDomain() : `localhost:${getPort()}`
  return `${getProtocol()}://${hostname}`;
}

export function getProtocol() {
  return process.env.NODE_ENV == 'production' ? 'https' : 'http';
}

export function getClientId() {
  return `${getHostname()}/info/id`
}
