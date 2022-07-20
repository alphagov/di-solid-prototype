import { randomUUID } from 'crypto'
import { IdentityCheck } from "../components/vocabularies/IdentityCheckCredential"

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
  