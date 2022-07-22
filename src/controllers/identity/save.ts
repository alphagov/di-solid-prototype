import { Request, Response } from "express";
import { passportCheckVC } from "../../lib/passport_check_vc";
import { evidenceSuccessful } from "../../lib/credential_helpers";
import { getSessionFromStorage, Session } from "@inrupt/solid-client-authn-node";
import {
  NamePart,
} from "../../components/vocabularies/CommonComponents";
import { getClientId, getJwtSigningKey } from "../../config";
import { default as jwt } from "jsonwebtoken";

import {
  buildThing,
  createThing,
  setThing,
  saveSolidDatasetAt,
  overwriteFile,
  getSourceUrl,
 } from "@inrupt/solid-client";

import {
  getOrCreateDataset,
  getDatasetUri,
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

export function saveGet(req: Request, res: Response) {
  res.render('identity/save');
}

export async function savePost(req: Request, res: Response): Promise<void> {
  const GOV_UK_CREDENTIAL = "https://vocab.account.gov.uk/GovUKCredential";
  const GOV_UK_hasCredential = "https://vocab.account.gov.uk/hasCredential";
  const session = await getSessionFromStorage(req.session?.sessionId);

  if (session != undefined && req.session) {
    const containerUri = await getDatasetUri(session, "private/govuk/identity/poc/credentials-pat/vcs");
    const metadataUri = `${containerUri}/vc-metadata`
    const metadataDataset = await getOrCreateDataset(session, metadataUri);
    const blobUri = `${containerUri}/vc-blob`;
    const vcFile = new Blob([await buildPassportCheck(req.session)], { type: "application/json" })
    await writeFileToPod(vcFile, blobUri, session)

    const reusableIdentityCredential = buildThing(
      createThing({ url: metadataUri })
    )
    .addUrl(RDF.type, GOV_UK_CREDENTIAL)
    .addUrl(GOV_UK_hasCredential, blobUri)
    .build();

    const updatedDataset = setThing(metadataDataset, reusableIdentityCredential);
    console.log(`Saving resources (Blob [${blobUri}] and it's metadata [${metadataUri}]) to Pod in container: [${containerUri}]`);

    await saveSolidDatasetAt(
      metadataUri,
      updatedDataset,
      { fetch: session.fetch }
    )

    // @TODO All the above will amount to saving the passport check.
    // It needs some of the linke data GOV_UK_* updated to reflect that
    // Also we then need to repeat this below, but generating a second JWT that represents
    // The KVB check... That will need a _new_ function here similar to buildPassportIdentityCheck()
    // but can import from kvb_check_vc.ts, then we'll need more linked data.
    // After that's complete we can then redirect to saved!

    res.redirect('/identity/complete/saved');
  } else {
    throw new SessionError();
  }
}

// Upload File to the targetFileURL.
// If the targetFileURL exists, overwrite the file.
// If the targetFileURL does not exist, create the file at the location.
async function writeFileToPod(file: Blob, targetFileURL: string, session: Session ) {
  try {
    const savedFile = await overwriteFile(
      targetFileURL,                                      // URL for the file.
      // We need to explicitly convert our 'Blob' into a Buffer here (see
      // detailed comment on our 'import { Blob }' code above).
      Buffer.from(await file.arrayBuffer()),
      // file,                                               // File
      { contentType: file.type, fetch: session.fetch }    // mimetype if known, fetch from the authenticated session
    );
    console.log(`File saved at ${getSourceUrl(savedFile)}`);

  } catch (error) {
    console.error(error);
  }
}

async function buildPassportCheck(session: CookieSessionInterfaces.CookieSessionObject): Promise<string> {
  const firstName: string = session.passport["first-name"]
  const middleName: string = session.passport["middle-name"]
  const surname: string = session.passport["surname"]

  const nameParts: NamePart[] = [
    {
      "value": firstName,
      "type": "GivenName",
    },
    {
      "value": middleName,
      "type": "GivenName",
    },
    {
      "value": surname,
      "type": "FamilyName",
    },
  ]

  const byear = session.passport["date-of-birth-year"]
  const bmonth = session.passport["date-of-birth-year"]
  const bday = session.passport["date-of-birth-day"]
  const birthDate = `${byear}-${bmonth}-${bday}`
  
  const eyear = session.passport["date-of-birth-year"]
  const emonth = session.passport["date-of-birth-year"]
  const eday = session.passport["date-of-birth-day"]
  const passportDetails = {
    "documentNumber": session.passport["passport-number"],
    "expiryDate": `${eyear}-${emonth}-${eday}`
  }

  const payload = {
    vc: passportCheckVC(
      nameParts,
      birthDate,
      passportDetails,
      evidenceSuccessful()
    )
  }

  //Fetch user's WebID from their session
  const solidSession = await getSessionFromStorage(session.sessionId);
  const webId = solidSession?.info.webId

  const token = jwt.sign(
    payload,
    getJwtSigningKey(),
    {
      'expiresIn': '1y',
      'issuer': getClientId(),
      'subject': webId
    }
  )

  return token
}
