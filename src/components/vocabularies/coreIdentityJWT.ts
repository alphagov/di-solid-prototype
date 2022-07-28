import { Person } from "./commonComponents";

export type IdentityVectorOfTrust = "P1" | "P2" | "P3" | "P4";

export type VerifiableIdentityCredentialType =
  | "VerifiableIdentityCredential"
  | "VerifiableCredential";

export interface VerifiableIdentityCredential {
  "@context"?: string[];
  credentialSubject?: Person;
  type?: VerifiableIdentityCredentialType[];
}

export interface Credentials {
  iss?: string;
  sub?: string;
  vc?: VerifiableIdentityCredential;
  vot?: IdentityVectorOfTrust;
  [k: string]: unknown;
}
