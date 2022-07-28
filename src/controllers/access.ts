import { Request, Response } from "express";
import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";

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
import { RDF, DCTERMS } from "@inrupt/vocab-common-rdf";
import { getOrCreateDataset, getDatasetUri } from "../lib/pod";

import SessionError from "../errors";

const GOV_UK_ACCESS_LOG_ENTRY = "https://vocab.account.gov.uk/AccessLogEntry";

export async function accessGet(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  if (session) {
    const datasetUri = await getDatasetUri(
      session,
      "private/govuk/identity/poc/access-log"
    );
    try {
      const dataset = await getSolidDataset(datasetUri, {
        fetch: session.fetch,
      });
      const created = getDatetime(
        getThing(dataset, datasetUri) as Thing,
        DCTERMS.created
      );

      res.render("access/show", { created });
    } catch (fetchError) {
      res.render("access/show");
    }
  }
}

export async function accessPost(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);
  if (session) {
    const datasetUri = await getDatasetUri(
      session,
      "private/govuk/identity/poc/access-log"
    );
    const dataset = await getOrCreateDataset(session, datasetUri);

    const accessLogEntry = buildThing(createThing({ url: datasetUri }))
      .addDatetime(DCTERMS.created, new Date())
      .addUrl(RDF.type, GOV_UK_ACCESS_LOG_ENTRY)
      .build();

    const updatedDataset = setThing(dataset, accessLogEntry);
    console.log(`Saving resource to Pod at: [${datasetUri}]`);

    await saveSolidDatasetAt(datasetUri, updatedDataset, {
      fetch: session.fetch,
    });
    res.redirect("/access-logs");
  } else {
    throw new SessionError();
  }
}
