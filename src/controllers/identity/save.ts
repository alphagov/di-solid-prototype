import { Request, Response } from "express";
import { passportCheckVC } from "../../lib/passport_check_vc";
import { kbvCheckVC } from "../../lib/kvb_check_vc"
import { 
  evidenceSuccessful,
  generateJWT,
  getBirthDate,
  getNameParts,
  getPostalAddress
} from "../../lib/credential_helpers";
import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";

import {
  buildThing,
  createThing,
  Thing,
 } from "@inrupt/solid-client";

import {
  getDatasetUri,
  writeCheckToPod,
} from "../../lib/pod"

import { SessionError } from "../../errors";

import { RDF } from "@inrupt/vocab-common-rdf";
// We need to explicitly import the Node.js implementation of 'Blob' here
// because it's not a global in Node.js (whereas it is global in the browser).
// We may also need to explicitly convert our usage of 'Blob' into a Buffer
// instead of using it as a 'Blob', because the Node.js 'Blob' implementation
// has no 'stream()' method, whereas the browser implementation does -
// otherwise using one instance where the other is expected will throw an
// error like this:
//   error TS2345: Argument of type 'Blob' is not assignable to parameter of type 'Blob | Buffer'.
//     Type 'import("buffer").Blob' is not assignable to type 'Blob'.
//       The types returned by 'stream()' are incompatible between these types.
//         Type 'unknown' is not assignable to type 'ReadableStream<any>'.
// Both the Node.js and the browser implementations of 'Blob' support the
// '.arrayBuffer()' method, and the `solid-client-js` functions that expect
// 'Blob's (like `overwriteFile()`) can accept both native 'Blob's and
// 'Buffer's, so always converting any 'Blob' instances we have into 'Buffer's
// allows those functions to work safely with both Node.js and browser
// 'Blob's.
// eslint-disable-next-line no-shadow
import { Blob } from "node:buffer";

const GOV_UK_CREDENTIAL = "https://vocab.account.gov.uk/GovUKCredential";
const GOV_UK_hasCredential = "https://vocab.account.gov.uk/hasCredential";

export function saveGet(req: Request, res: Response) {
  res.render('identity/save');
}

export async function savePost(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);

  if (session != undefined && req.session) {
    req.session.webId = session.info.webId
    const containerUri = await getDatasetUri(session, "private/govuk/identity/poc/credentials-pat/vcs");
    
    const passportArtifacts = await buildPassportCheckArtifacts(req.session, containerUri);
    await writeCheckToPod(session, passportArtifacts)

    const kbvArtifacts = await buildKbvCheckArtifacts(req.session, containerUri)
    await writeCheckToPod(session, kbvArtifacts)

    res.redirect('/identity/complete/saved');
  } else {
    throw new SessionError();
  }
}

function buildPassportCheck(session: CookieSessionInterfaces.CookieSessionObject): string {
  
  const eyear = session.passport["date-of-birth-year"]
  const emonth = session.passport["date-of-birth-year"]
  const eday = session.passport["date-of-birth-day"]
  const passportDetails = {
    "documentNumber": session.passport["passport-number"],
    "expiryDate": `${eyear}-${emonth}-${eday}`
  }

  const payload = passportCheckVC(
    getNameParts(session),
    getBirthDate(session),
    passportDetails,
    evidenceSuccessful()
  )

  return generateJWT(payload, session.webId)
}

async function buildPassportCheckArtifacts(
  session: CookieSessionInterfaces.CookieSessionObject,
  containerUri: string
): Promise<CheckArtifacts> {
  const fileUri = `${containerUri}/passport/check`;
  const metadataUri = `${containerUri}/passport/metadata`;

  const file = new Blob([buildPassportCheck(session)], { type: "application/json" })

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
export interface CheckArtifacts {
  file: Blob,
  fileUri: string,
  metadata: Thing,
  metadataUri: string
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

async function buildKbvCheckArtifacts(
  session: CookieSessionInterfaces.CookieSessionObject,
  containerUri: string
): Promise<CheckArtifacts> {
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
