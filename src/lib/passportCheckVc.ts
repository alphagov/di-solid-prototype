import { buildThing, createThing } from "@inrupt/solid-client";
import type CookieSessionInterfaces from "cookie-session";
import { RDF } from "@inrupt/vocab-common-rdf";

import { Blob } from "node:buffer";
import {
  CheckArtifacts,
  evidenceSuccessful,
  generateJWT,
  getBirthDate,
  getNameParts,
  GOV_UK_CREDENTIAL,
  GOV_UK_HAS_CREDENTIAL,
  GOV_UK_VC_DESCRIPTION,
} from "./credentials";

import {
  NamePart,
  PassportDetails,
} from "../components/vocabularies/commonComponents";

import {
  Credential,
  IdentityCheck,
} from "../components/vocabularies/identityCheckCredential";

export function passportCheckVC(
  nameParts: NamePart[],
  birthDate: string,
  passportDetails: PassportDetails,
  evidence: IdentityCheck[]
): Credential {
  return {
    type: ["VerifiableCredential", "IdentityCheckCredential"],
    credentialSubject: {
      name: [
        {
          nameParts,
        },
      ],
      birthDate: [
        {
          value: birthDate,
        },
      ],
      passport: [passportDetails],
    },
    evidence,
  };
}

function buildPassportCheck(
  session: CookieSessionInterfaces.CookieSessionObject
): string {
  const eyear = session.passport["date-of-birth-year"];
  const emonth = session.passport["date-of-birth-year"];
  const eday = session.passport["date-of-birth-day"];
  const passportDetails = {
    documentNumber: session.passport["passport-number"],
    expiryDate: `${eyear}-${emonth}-${eday}`,
  };

  const payload = passportCheckVC(
    getNameParts(session),
    getBirthDate(session),
    passportDetails,
    evidenceSuccessful()
  );

  return generateJWT(payload, session.webId);
}

export function buildPassportCheckArtifacts(
  session: CookieSessionInterfaces.CookieSessionObject,
  containerUri: string
): CheckArtifacts {
  const fileUri = `${containerUri}/passport/check`;
  const metadataUri = `${containerUri}/passport/metadata`;

  const file = new Blob([buildPassportCheck(session)], {
    type: "application/json",
  });

  const metadata = buildThing(createThing({ url: metadataUri }))
    .addUrl(RDF.type, GOV_UK_CREDENTIAL)
    .addUrl(GOV_UK_HAS_CREDENTIAL, fileUri)
    .addStringEnglish(GOV_UK_VC_DESCRIPTION, "Passport Based Identity Check")
    .build();

  return {
    file,
    fileUri,
    metadata,
    metadataUri,
  };
}
