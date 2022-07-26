import { Person } from "./commonComponents";

/**
 * An identifier from the OpenID Check Methods list
 */
export type CheckMethodType =
  | "vpip"
  | "vpiruv"
  | "vri"
  | "vdig"
  | "vcrypt"
  | "data"
  | "auth"
  | "token"
  | "kbv"
  | "pvp"
  | "pvr"
  | "bvp"
  | "bvr";

/**
 * Specifies the kind of fraud check performed per GPG 45
 */
export type FraudCheckType =
  | "mortality_check"
  | "dentity_theft_check"
  | "synthetic_identity_check"
  | "impersonation_risk_check";

/**
 * Describes the way a KBV question was presented to the user.
 */
export type KBVResponseModeType = "free_text" | "multiple_choice";

export type IdentityCheckCredentialType =
  | "IdentityCheckCredential"
  | "VerifiableCredential";

export interface Credential {
  "@context"?: string[];
  credentialSubject?: Person;
  evidence?: IdentityCheck[];
  type?: IdentityCheckCredentialType[];
  [k: string]: unknown;
}

export interface IdentityCheck {
  activityHistoryScore?: number;
  checkDetails?: CheckDetails[];
  ci?: string[];
  failedCheckDetails?: CheckDetails[];
  identityFraudScore?: number;
  strengthScore?: number;
  txn?: string;
  type?: "IdentityCheck";
  validityScore?: number;
  verificationScore?: number;
}
export interface CheckDetails {
  /**
   * The date of the earliest activity found for the user.
   */
  activityFrom?: string;
  /**
   * For a biometric verification process, the level corresponding to the GPG 45 verification score requirement.
   */
  biometricVerificationProcessLevel?: number;
  checkMethod?: CheckMethodType;
  fraudCheck?: FraudCheckType;
  /**
   * A measure of the level of identity confidence held by the issuer.
   */
  identityCheckLevel?: number;
  /**
   * The quality of a knowledge-based verification (KBV) question.
   */
  kbvQuality?: number;
  kbvResponseMode?: KBVResponseModeType;
  /**
   * For a photo-based verification process, the level corresponding to the GPG 45 verification score requirement.
   */
  photoVerificationProcessLevel?: number;
  /**
   * A unique transaction identifier for this part of the check, if any.
   */
  txn?: string;
}
