import { Session } from '@inrupt/solid-client-authn-node';
import {
  createSolidDataset,
  getPodUrlAll,
  getSolidDataset,
  SolidDataset,
  setThing,
  saveSolidDatasetAt,
  overwriteFile,
  getSourceUrl,
} from "@inrupt/solid-client";
import { getEssServiceURI, EssServices } from '../config';
import { SessionError } from "../errors";
import { CheckArtifacts } from '../lib/credential_helpers';

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

export async function createProfileAndPod(session: Session) {
  if (session.info.webId) {
    await session.fetch(session.info.webId, {method: 'POST'})
    const provision = await (await session.fetch(getEssServiceURI(EssServices.Provision), {method: 'POST'})).json()

    await session.fetch(
      `${session.info.webId}/provision`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          '@context': {
            'id':'@id',
            'storage':{
               '@type':'@id',
               '@id':'http://www.w3.org/ns/pim/space#storage'
            },
            'profile':{
               '@type':'@id',
               '@id':'http://xmlns.com/foaf/0.1/isPrimaryTopicOf'
            }
         },
         'id': session.info.webId,
         'profile': provision['profile'],
         'storage': provision['storage']
        })
      }
    )
  }
}

export async function getOrCreateDataset(session: Session, datasetUri: string): Promise<SolidDataset> {
  try {
    const dataset = await getSolidDataset(datasetUri, {fetch: session.fetch});
    return dataset;
  } catch (fetchError) {
    const dataset = createSolidDataset();
    return dataset;
  }
}

export async function getDatasetUri(session: Session, containerPath: string) {
  if (session.info.webId && containerPath) {
    const podUri = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
    return `${podUri[0]}${containerPath}`;
  } else {
    throw new SessionError();
  }
}

export async function writeCheckToPod(session: Session, checkArtifacts: CheckArtifacts) {
  await writeFileToPod(checkArtifacts.file, checkArtifacts.fileUri, session)
  const metadataDataset = await getOrCreateDataset(session, checkArtifacts.metadataUri);
  const updatedDataset = setThing(metadataDataset, checkArtifacts.metadata);
  await saveSolidDatasetAt(
    checkArtifacts.metadataUri,
    updatedDataset,
    { fetch: session.fetch }
  )

  console.log(`Saved resources (Blob [${checkArtifacts.fileUri}] and it's metadata [${checkArtifacts.metadataUri}]) to Pod`);
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
