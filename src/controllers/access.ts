import { Request, Response } from "express";
import { getSessionFromStorage, Session } from "@inrupt/solid-client-authn-node";
import {
  buildThing,
  createSolidDataset,
  createThing,
  getPodUrlAll,
  getSolidDataset,
  setThing,
  saveSolidDatasetAt,
  getThing,
  Thing,
  getDatetime,
  SolidDataset,
} from "@inrupt/solid-client";
import { RDF, DCTERMS } from "@inrupt/vocab-common-rdf";

import { SessionError } from "../errors";

const GOV_UK_AccessLogEntry = "https://vocab.account.gov.uk/AccessLogEntry";

export async function accessGet(req: Request, res: Response): Promise<void> {
  res.render('access/show')
}

export async function accessPost(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  if (session != undefined) {

    const datasetUri = await getDatasetUri(session);
    console.log(`About to try and read resource from Pod at: [${datasetUri}]`);

    const dataset = await getOrCreateDataset(session, datasetUri);

    // Rather than create a random 'name' for the Thing in this resource, we
    // can just use the dataset/resource's full IRI instead (which is not
    // strictly necessary, but is cleaner).
    const accessLogEntry = buildThing(createThing({ url: datasetUri }))
      .addDatetime(DCTERMS.created, new Date())
      .addUrl(RDF.type, GOV_UK_AccessLogEntry)
      .build();

    const updatedDataset = setThing(dataset, accessLogEntry);
    console.log(`Saving resource to Pod at: [${datasetUri}]`);

    await saveSolidDatasetAt(
      datasetUri,
      updatedDataset,
      { fetch: session.fetch}
    )
    res.redirect('/access-logs');
  } else {
    throw new SessionError();
  }
}

async function getOrCreateDataset(session: Session, datasetUri: string): Promise<SolidDataset> {
  try {
    const dataset = await getSolidDataset(datasetUri, {fetch: session.fetch});
    console.log(`Successfully read Pod resource at: [${datasetUri}]...`);

    // We know what to look for here (i.e., we know the IRI of the Thing (it's
    // the same as our Resource/dataset IRI), and we know to look for a
    // DCTERMS.created property).
    const created = getDatetime(getThing(dataset, datasetUri) as Thing, DCTERMS.created);
    console.log(`Previous DCTERMS.created value: [${created}]`);

    return dataset
  } catch (fetchError) {
    console.log(`Failed to fetch (a 404 is fine, as this could be our first time with this Pod!) resource at [${datasetUri}] - error: [${fetchError}]`);
    const dataset = createSolidDataset();
    return dataset
  }
}

async function getDatasetUri(session: Session) {
  if (session.info.webId) {
    const podUri = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
    return `${podUri[0]}private/demo/access-log`;
  } else {
    throw new SessionError();
  }
}

// Not needed at the moment, but causes TS warning if not commented out, so
// leaving here in case you wish to re-instate it later.
// function generateId() {
//   return Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5);
// }
