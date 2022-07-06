export function getPort() {
  return process.env.LOGS_LEVEL || 3000;
}

export function getSessionKeys() {
  return ["key1", "key2"];
}

export function getHostname() {
  const hostname = process.env.NODE_ENV == 'production' ? 'prototype.solid.integration.account.gov.uk' : `localhost:${getPort()}`
  return `${getProtocol()}://${hostname}`;
}

export function getProtocol() {
  return process.env.NODE_ENV == 'production' ? 'https' : 'http';
}

export function getClientId() {
  return `${getHostname()}/info/id`
}
