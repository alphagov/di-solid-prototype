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
  getPostalAddress,
  GOV_UK_CREDENTIAL,
  GOV_UK_HAS_CREDENTIAL,
} from "./credentials";

import {
  NamePart,
  PostalAddress,
} from "../components/vocabularies/commonComponents";

import {
  Credential,
  IdentityCheck,
} from "../components/vocabularies/identityCheckCredential";

// eslint-disable-next-line no-shadow

export function kbvCheckVC(
  nameParts: NamePart[],
  birthDate: string,
  addressDetails: PostalAddress[],
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
      address: addressDetails,
    },
    evidence,
  };
}

function buildKbvCheck(
  session: CookieSessionInterfaces.CookieSessionObject
): string {
  const payload = kbvCheckVC(
    getNameParts(session),
    getBirthDate(session),
    getPostalAddress(session),
    evidenceSuccessful()
  );

  return generateJWT(payload, session.webId);
}

export function buildKbvCheckArtifacts(
  session: CookieSessionInterfaces.CookieSessionObject,
  containerUri: string
): CheckArtifacts {
  const fileUri = `${containerUri}/kbv/check`;
  const metadataUri = `${containerUri}/kbv/metadata`;

  const file = new Blob([buildKbvCheck(session)], { type: "application/json" });

  const metadata = buildThing(createThing({ url: metadataUri }))
    .addUrl(RDF.type, GOV_UK_CREDENTIAL)
    .addUrl(GOV_UK_HAS_CREDENTIAL, fileUri)
    .build();

  return {
    file,
    fileUri,
    metadata,
    metadataUri,
  };
}
