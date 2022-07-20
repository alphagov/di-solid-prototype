import { Request, Response } from "express";
import { credentials } from "../../lib/credentials";
import { getSessionFromStorage, Session } from "@inrupt/solid-client-authn-node";
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

import { RDF } from "@inrupt/vocab-gds-poc-bundle-all-solidcommonvocab";
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
  
  if (session != undefined) {
    const containerUri = await getDatasetUri(session, "private/govuk/identity/poc/credentials-pat/vcs/");
    const metadataUri = `${containerUri}/vc-metadata`
    const metadataDataset = await getOrCreateDataset(session, metadataUri);
    const blobUri = `${containerUri}/vc-blob`;
    const vcFile = new Blob([JSON.stringify(credentials())], { type: "application/json" })
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
