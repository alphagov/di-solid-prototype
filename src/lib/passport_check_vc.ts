import {
  NamePart,
  PassportDetails,
} from "../components/vocabularies/CommonComponents";

import { IdentityCheckCredential } from "../components/vocabularies/identityCheckCredentialJWT";
import { IdentityCheck } from "../components/vocabularies/IdentityCheckCredential"

export function passportCheckVC(
  nameParts: NamePart[],
  birthDate: string,
  passportDetails: PassportDetails,
  evidence: IdentityCheck[]
): IdentityCheckCredential {
  return {
    type: ["VerifiableCredential", "IdentityCheckCredential"],
    credentialSubject: {
      name: [
        {
          nameParts: nameParts,
        },
      ],
      birthDate: [
        {
          value: birthDate,
        },
      ],
      passport: [passportDetails],
    },
    evidence: evidence
  };
}
