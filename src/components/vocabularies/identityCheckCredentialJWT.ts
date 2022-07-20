import { Person } from "./CommonComponents";

import {
  IdentityCheck,
  IdentityCheckCredentialType,
} from "./IdentityCheckCredential";

export interface Credentials {
  iss?: string;
  sub?: string;
  vc?: IdentityCheckCredential;
  [k: string]: unknown;
}

export interface IdentityCheckCredential {
  "@context"?: string[];
  credentialSubject?: Person;
  evidence?: IdentityCheck[];
  type?: IdentityCheckCredentialType[];
}
