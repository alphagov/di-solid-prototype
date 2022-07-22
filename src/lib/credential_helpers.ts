import { randomUUID } from 'crypto'
import { Credential, IdentityCheck } from "../components/vocabularies/IdentityCheckCredential"
import { getClientId, getJwtSigningKey } from "../config";
import { default as jwt } from "jsonwebtoken";

export function evidenceSuccessful(): IdentityCheck[] {
    return [
      {
        type: "IdentityCheck",
        txn: randomUUID(),
        strengthScore: 4,
        validityScore: 2,
      },
    ];
  }
  
export function evidenceFailed(): IdentityCheck[] {
  return [
    {
      type: "IdentityCheck",
      txn: randomUUID(),
      strengthScore: 4,
      validityScore: 0,
      ci: ["D02"],
    },
  ];
}

export function evidenceWarning(): IdentityCheck[] {
  return [
    {
      type: "IdentityCheck",
      txn: randomUUID(),
      strengthScore: 4,
      validityScore: 2,
      ci: ["D03"],
    },
  ];
}

export function generateJWT(payload: Credential, subject: string) {
  const token = jwt.sign(
    {
      vc: payload
    },
    getJwtSigningKey(),
    {
      'expiresIn': '1y',
      'issuer': getClientId(),
      'subject': subject
    }
  )
  return token
}
  