export function getPort() {
  return process.env.LOGS_LEVEL || 3000;
}

export function getSessionKeys() {
  return ["key1", "key2"];
}
