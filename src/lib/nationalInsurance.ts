import { buildThing, createThing } from "@inrupt/solid-client";
import type CookieSessionInterfaces from "cookie-session";
import { RDF } from "@inrupt/vocab-common-rdf";

import { Blob } from "node:buffer";
import {
  CheckArtifacts,
  DWP_NATIONAL_INSURANCE_NUMBER,
  generateJWT,
  GOV_UK_CREDENTIAL,
  GOV_UK_HAS_CREDENTIAL,
  GOV_UK_VC_DESCRIPTION,
  GOV_UK_VC_CREATED_AT,
} from "./credentials";

function buildNiNumberJWT(
  session: CookieSessionInterfaces.CookieSessionObject
): string {
  const payload = {
    nationalInsuranceNumber: session.nino,
  };

  return generateJWT(payload, session.webId);
}

export default function buildNiNumberArtifacts(
  session: CookieSessionInterfaces.CookieSessionObject,
  containerUri: string
): CheckArtifacts {
  const fileUri = `${containerUri}/ni/check`;
  const metadataUri = `${containerUri}/ni/metadata`;

  const file = new Blob([buildNiNumberJWT(session)], {
    type: "application/json",
  });

  const metadata = buildThing(createThing({ url: metadataUri }))
    .addUrl(RDF.type, GOV_UK_CREDENTIAL)
    .addUrl(GOV_UK_HAS_CREDENTIAL, fileUri)
    .addStringNoLocale(DWP_NATIONAL_INSURANCE_NUMBER, session.nino)
    .addStringEnglish(GOV_UK_VC_DESCRIPTION, "National Insurance Number")
    .addDatetime(GOV_UK_VC_CREATED_AT, new Date())
    .build();

  return {
    file,
    fileUri,
    metadata,
    metadataUri,
  };
}
