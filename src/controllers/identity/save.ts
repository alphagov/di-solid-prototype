import { Request, Response } from "express";
import { credentials } from "../../lib/credentials";
import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";
import {
  buildThing,
  createThing,
  setThing,
  saveSolidDatasetAt,
  overwriteFile,
} from "@inrupt/solid-client";

import {
  getOrCreateDataset,
  getDatasetUri,
} from "../../lib/pod"

import { SessionError } from "../../errors";

import { RDF, DCTERMS } from "@inrupt/vocab-common-rdf";

export function saveGet(req: Request, res: Response) {
  res.render('identity/save');
}

export async function savePost(req: Request, res: Response): Promise<void> {
  const GOV_UK_CREDENTIAL = "https://vocab.account.gov.uk/GovUKCredential";
  const session = await getSessionFromStorage(req.session?.sessionId);
  
  if (session != undefined) {
    const datasetUri = await getDatasetUri(session, "private/govuk/identity/poc/credentials");
    const dataset = await getOrCreateDataset(session, datasetUri);

    const blobUri = await getDatasetUri(session, "private/govuk/identity/poc/credentials/vcs/");
    const savedFile = await overwriteFile(
      blobUri,
      new Blob([JSON.stringify(credentials())], { type: "application/json" }),
      { contentType: "application/json", fetch: fetch }
    )

    const reusableIdentityCredential = buildThing(
      createThing({ url: datasetUri })
    )
    .addUrl(RDF.type, GOV_UK_CREDENTIAL)
    .addUrl(GOV_UK_CREDENTIAL, blobUri)
    .build();

    const updatedDataset = setThing(dataset, reusableIdentityCredential);
    console.log(`Saving resource to Pod at: [${datasetUri}]`);

    await saveSolidDatasetAt(
      datasetUri,
      updatedDataset,
      { fetch: session.fetch }
    )
    res.redirect('/identity/complete/return');
  } else {
    throw new SessionError();
  }
}
