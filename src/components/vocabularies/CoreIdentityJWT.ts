export type NamePartType = "GivenName" | "FamilyName"
export type VerifiableIdentityCredentialType =
  | "VerifiableIdentityCredential"
  | "VerifiableCredential"
export type IdentityVectorOfTrust = "P1" | "P2" | "P3" | "P4"

export interface Credentials {
  iss?: string
  sub?: string
  vc?: VerifiableIdentityCredential
  vot?: IdentityVectorOfTrust
  [k: string]: unknown
}
export interface VerifiableIdentityCredential {
  "@context"?: string[]
  credentialSubject?: Person
  type?: VerifiableIdentityCredentialType[]
}
export interface Person {
  address?: PostalAddress[]
  birthDate?: BirthDate[]
  drivingPermit?: DrivingPermitDetails[]
  name?: Name[]
  passport?: PassportDetails[]
}
export interface PostalAddress {
  addressCountry?: string
  addressLocality?: string
  buildingName?: string
  buildingNumber?: string
  departmentName?: string
  dependentAddressLocality?: string
  dependentStreetName?: string
  doubleDependentAddressLocality?: string
  organisationName?: string
  postalCode?: string
  streetName?: string
  subBuildingName?: string
  uprn?: string
  validFrom?: string
  validUntil?: string
}
export interface BirthDate {
  validFrom?: string
  validUntil?: string
  value?: string
}
export interface DrivingPermitDetails {
  documentNumber?: string
  expiryDate?: string
  validFrom?: string
  validUntil?: string
}
export interface Name {
  nameParts?: NamePart[]
  validFrom?: string
  validUntil?: string
}
export interface NamePart {
  type?: NamePartType
  validFrom?: string
  validUntil?: string
  value?: string
}
export interface PassportDetails {
  documentNumber?: string
  expiryDate?: string
  validFrom?: string
  validUntil?: string
}
