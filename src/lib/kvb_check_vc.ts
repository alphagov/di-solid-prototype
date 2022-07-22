import {
  buildThing,
  createThing,
} from "@inrupt/solid-client";

import { RDF } from "@inrupt/vocab-common-rdf";

import { 
  evidenceSuccessful,
  generateJWT,
  getBirthDate,
  getNameParts,
  getPostalAddress,
  GOV_UK_CREDENTIAL,
  GOV_UK_hasCredential
} from "../lib/credential_helpers";

import { CheckArtifacts } from "../lib/credential_helpers";

import {
  NamePart,
  PostalAddress,
} from "../components/vocabularies/CommonComponents";

import { Credential, IdentityCheck } from "../components/vocabularies/IdentityCheckCredential";

// eslint-disable-next-line no-shadow
import { Blob } from "node:buffer";

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
          nameParts: nameParts,
        },
      ],
      birthDate: [
        {
          value: birthDate,
        },
      ],
      address: addressDetails,
    },
    evidence: evidence,
  };
}

function buildKbvCheck(session: CookieSessionInterfaces.CookieSessionObject): string {
  const payload = kbvCheckVC(
    getNameParts(session),
    getBirthDate(session),
    getPostalAddress(session),
    evidenceSuccessful()
  )

  return generateJWT(payload, session.webId)
}

export function buildKbvCheckArtifacts(
  session: CookieSessionInterfaces.CookieSessionObject,
  containerUri: string
): CheckArtifacts {
  const fileUri = `${containerUri}/kbv/check`;
  const metadataUri = `${containerUri}/kbv/metadata`;

  const file = new Blob([buildKbvCheck(session)], { type: "application/json" })

  const metadata = buildThing(
    createThing({ url: metadataUri })
  )
  .addUrl(RDF.type, GOV_UK_CREDENTIAL)
  .addUrl(GOV_UK_hasCredential, fileUri)
  .build();

  return {
    file: file,
    fileUri: fileUri,
    metadata: metadata,
    metadataUri: metadataUri
  }
}
