export type NamePartType = "GivenName" | "FamilyName";

export interface NamePart {
  type?: NamePartType;
  validFrom?: string;
  validUntil?: string;
  value?: string;
}

export interface Name {
  nameParts?: NamePart[];
  validFrom?: string;
  validUntil?: string;
}

export interface PostalAddress {
  addressCountry?: string;
  addressLocality?: string;
  buildingName?: string;
  buildingNumber?: string;
  departmentName?: string;
  dependentAddressLocality?: string;
  dependentStreetName?: string;
  doubleDependentAddressLocality?: string;
  organisationName?: string;
  postalCode?: string;
  streetName?: string;
  subBuildingName?: string;
  uprn?: string;
  validFrom?: string;
  validUntil?: string;
}

export interface BirthDate {
  validFrom?: string;
  validUntil?: string;
  value?: string;
}

/**
 * Document Types
 */

export interface PassportDetails {
  documentNumber?: string;
  expiryDate?: string;
  validFrom?: string;
  validUntil?: string;
}

export interface DrivingPermitDetails {
  documentNumber?: string;
  expiryDate?: string;
  validFrom?: string;
  validUntil?: string;
}

export interface Person {
  address?: PostalAddress[];
  birthDate?: BirthDate[];
  drivingPermit?: DrivingPermitDetails[];
  name?: Name[];
  passport?: PassportDetails[];
}
