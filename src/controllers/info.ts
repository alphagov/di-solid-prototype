import { Request, Response } from "express";
import { getHostname } from "../config";

export function idGet(req: Request, res: Response) {
  res.json(buildClientIdDocument())
}

export function buildClientIdDocument(): ClientIdDocument {
 return {
    "@context": [
      "https://www.w3.org/ns/solid/oidc-context.jsonld"
    ],
    "client_id": `${getHostname()}/info/id`,
    "client_name": "GDS Solid proof of concept app",
    "client_uri": `${getHostname()}`,
    "post_logout_redirect_uris": [
      `${getHostname()}`
    ],
    "redirect_uris": [
      `${getHostname()}/login/callback`
    ]
  }
}

export type ClientIdDocument = {
  '@context': string[];
  client_id: string;
  client_name: string;
  client_uri: string;
  post_logout_redirect_uris: string[];
  redirect_uris: string[];
}
