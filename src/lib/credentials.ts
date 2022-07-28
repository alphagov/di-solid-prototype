import { randomUUID } from "crypto";
import type CookieSessionInterfaces from "cookie-session";
import * as jwt from "jsonwebtoken";
import { Thing } from "@inrupt/solid-client";
import { Blob } from "node:buffer";
import {
  Credential,
  IdentityCheck,
} from "../components/vocabularies/identityCheckCredential";
import { getClientId, getJwtSigningKey } from "../config";
import {
  NamePart,
  PostalAddress,
} from "../components/vocabularies/commonComponents";

export const GOV_UK_CREDENTIAL = "https://vocab.account.gov.uk/GovUKCredential";
export const GOV_UK_HAS_CREDENTIAL =
  "https://vocab.account.gov.uk/hasCredential";

// eslint-disable-next-line no-shadow
import { Blob } from "node:buffer";

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
      vc: payload,
    },
    getJwtSigningKey(),
    {
      expiresIn: "1y",
      issuer: getClientId(),
      subject: subject,
    }
  );
  return token;
}

export function getNameParts(
  session: CookieSessionInterfaces.CookieSessionObject
): NamePart[] {
  const firstName: string = session.passport["first-name"];
  const middleName: string = session.passport["middle-name"];
  const surname: string = session.passport["surname"];

  return [
    {
      value: firstName,
      type: "GivenName",
    },
    {
      value: middleName,
      type: "GivenName",
    },
    {
      value: surname,
      type: "FamilyName",
    },
  ];
}

export function getBirthDate(
  session: CookieSessionInterfaces.CookieSessionObject
): string {
  const byear = session.passport["date-of-birth-year"];
  const bmonth = session.passport["date-of-birth-year"];
  const bday = session.passport["date-of-birth-day"];
  return `${byear}-${bmonth}-${bday}`;
}

export function getPostalAddress(
  session: CookieSessionInterfaces.CookieSessionObject
): PostalAddress[] {
  return [
    {
      addressCountry: "United Kingdom",
      addressLocality: session.address["city-name"],
      buildingName: session.address["flat-name"],
      postalCode: session.address["address-postcode"],
      streetName: session.address["street-name"],
      validFrom: session.address["year"],
    },
  ];
}

export interface CheckArtifacts {
  file: Blob;
  fileUri: string;
  metadata: Thing;
  metadataUri: string;
}
