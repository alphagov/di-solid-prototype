import { buildThing, createThing } from "@inrupt/solid-client";

import { RDF } from "@inrupt/vocab-common-rdf";

import {
  CheckArtifacts,
  evidenceSuccessful,
  generateJWT,
  getBirthDate,
  getNameParts,
  GOV_UK_CREDENTIAL,
  GOV_UK_hasCredential,
} from "../lib/credentials";

import {
  NamePart,
  PassportDetails,
} from "../components/vocabularies/commonComponents";

import {
  Credential,
  IdentityCheck,
} from "../components/vocabularies/identityCheckCredential";

// eslint-disable-next-line no-shadow
import { Blob } from "node:buffer";

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
    evidence: evidence,
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
    .addUrl(GOV_UK_hasCredential, fileUri)
    .build();

  return {
    file: file,
    fileUri: fileUri,
    metadata: metadata,
    metadataUri: metadataUri,
  };
}
