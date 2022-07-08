import { Session } from '@inrupt/solid-client-authn-node';
import { getEssServiceURI, EssServices } from '../config';
import { SessionError } from "../errors";
import {
  createSolidDataset,
  getPodUrlAll,
  getSolidDataset,
  SolidDataset,
} from "@inrupt/solid-client";


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