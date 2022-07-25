import { Person } from "./commonComponents";

export type IdentityVectorOfTrust = "P1" | "P2" | "P3" | "P4";

export interface Credentials {
  iss?: string;
  sub?: string;
  vc?: VerifiableIdentityCredential;
  vot?: IdentityVectorOfTrust;
  [k: string]: unknown;
}

export interface VerifiableIdentityCredential {
  "@context"?: string[];
  credentialSubject?: Person;
  type?: VerifiableIdentityCredentialType[];
}

export type VerifiableIdentityCredentialType =
  | "VerifiableIdentityCredential"
  | "VerifiableCredential";