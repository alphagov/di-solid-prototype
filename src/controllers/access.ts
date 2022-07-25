import { Request, Response } from "express";
import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";
import {
  getOrCreateDataset,
  getDatasetUri,
} from "../lib/pod"

import {
  buildThing,
  createThing,
  getSolidDataset,
  setThing,
  saveSolidDatasetAt,
  getThing,
  Thing,
  getDatetime,
} from "@inrupt/solid-client";
import { RDF, DCTERMS, GDS_POC_MESSAGE } from "@inrupt/vocab-gds-poc-bundle-all-solidcommonvocab";

import { SessionError } from "../errors";

const GOV_UK_AccessLogEntry = "https://vocab.account.gov.uk/AccessLogEntry";

export async function accessGet(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  if (session != undefined) {
    const datasetUri = await getDatasetUri(session, "private/govuk/identity/poc/access-log");
    try {
      const dataset = await getSolidDataset(datasetUri, {fetch: session.fetch});
      const created = getDatetime(getThing(dataset, datasetUri) as Thing, DCTERMS.created);

      res.render('access/show', { GDS_POC_MESSAGE, created })
    } catch (fetchError) {
      res.render('access/show', { GDS_POC_MESSAGE })
    }
  }
}

export async function accessPost(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  if (session != undefined) {

    const datasetUri = await getDatasetUri(session, "private/govuk/identity/poc/access-log");
    const dataset = await getOrCreateDataset(session, datasetUri);

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
