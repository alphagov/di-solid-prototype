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
// eslint-disable-next-line import/no-unresolved
import * as _RDF from "@rdfjs/types";
import { getOrCreateDataset, getDatasetUri } from "../lib/pod";

import SessionError from "../errors";

const GOV_UK_ACCESS_LOG_ENTRY = "https://vocab.account.gov.uk/AccessLogEntry";

// The GDS ESS Fragments service.
const GOV_UK_GDS_ESS_ENDPOINT_FRAGMENT =
  "https://fragments.ess.solid.integration.account.gov.uk/qpf?storage=";
// The Pod Spaces ESS Fragments service.
// const GOV_UK_GDS_ESS_ENDPOINT_FRAGMENT = "https://fragments.inrupt.com/qpf?storage=";

const { QueryEngine } = require("@comunica/query-sparql-solid");

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

      // Just here to show-by-example...
      // Query and iterate over all triples from our user's WebID Profile
      // Document...
      try {
        console.log(
          `Querying for triples from WebID Profile Document specifically...`
        );
        const myEngine = new QueryEngine();
        const webIdProfileDocStream = await myEngine.queryBindings(
          `
          SELECT * WHERE {
              ?s ?p ?o
          } LIMIT 100`,
          {
            sources: [session.info.webId], // Sets WebID profile document as query source.
          }
        );

        console.log(`Showing resulting triples:`);
        webIdProfileDocStream.on("data", (binding: _RDF.Bindings) => {
          console.log(
            `SPARQL: s [${binding.get("s")!.value}] p [${
              binding.get("p")!.value
            }] o [${binding.get("o")!.value}]`
          );
        });

        await new Promise<void>((resolve) => {
          webIdProfileDocStream.on("end", () => {
            console.log(`End of result stream.`);
            resolve();
          });
        });
      } catch (error) {
        const msg = `ERROR trying query user's WebID Profile Document at [${session.info.webId}]: ${error}`;
        console.log(msg);
      }

      // Just here to show-by-example...
      // Query just for the `pim:storage` value from the user's WebID Profile
      // Document...
      let storageIri;
      let storageStream;
      try {
        console.log(`Querying for 'pim:storage' specifically...`);
        const myEngine = new QueryEngine();
        storageStream = await myEngine.queryBindings(
          `
          PREFIX pim: <http://www.w3.org/ns/pim/space#>
          SELECT ?storageIri WHERE {
              <${session.info.webId}> pim:storage ?storageIri
          }`,
          {
            sources: [session.info.webId], // Sets WebID profile document as query source.
          }
        );

        const storageBindings = await storageStream.toArray();
        if (storageBindings && storageBindings.length !== 1) {
          console.log(
            `Expected one, and only one, value for 'pim:storage' for WebID [${session.info.webId}], but got [${storageBindings.length}] values!`
          );
        } else {
          storageIri = storageBindings[0].get("storageIri").value;
          console.log(`Storage IRI: [${storageIri}]`);
        }
      } catch (error) {
        const msg = `ERROR trying query this user's WebID Profile Document (at [${session.info.webId}]) for the location of their Pod storage: ${error}`;
        console.log(msg);
      }

      let logStream;
      try {
        // Query for data from the user's Pod storage...
        const qpfEndpoint = `${GOV_UK_GDS_ESS_ENDPOINT_FRAGMENT}${encodeURIComponent(
          storageIri
        )}`;
        console.log(
          `Querying for last Access Log timestamp [${qpfEndpoint}]...`
        );
        console.log(
          `Session logged in: [${session.info.isLoggedIn}], WebID: [${session.info.webId}], ...`
        );

        const myEngine = new QueryEngine();
        logStream = await myEngine.queryBindings(
          `
          PREFIX dcterms: <http://purl.org/dc/terms/>
          SELECT ?lastAccessLogTimestamp WHERE {
            GRAPH ?g {
              ?s a <https://vocab.account.gov.uk/AccessLogEntry> .
              ?s dcterms:created ?lastAccessLogTimestamp .
            }
          }`,
          {
            sources: [qpfEndpoint],
            "@comunica/actor-http-inrupt-solid-client-authn:session": session,
            httpTimeout: 5000,
            logLevel: "debug",
          }
        );

        try {
          const logBindings = await logStream.toArray();
          if (logBindings && logBindings.length === 1) {
            const lastAccessLogTimestamp = logBindings[0].get(
              "lastAccessLogTimestamp"
            ).value;
            console.log(
              `Last Access Log timestamp: [${lastAccessLogTimestamp}]`
            );
          } else {
            console.log(
              `Got [${logBindings.length}] access log entries - expected just 1!`
            );
          }
        } catch (error) {
          const msg = `ERROR processing result stream from Access Log query: ${error}`;
          console.log(msg);
        }
      } catch (error) {
        const msg = `ERROR querying for Access Logs: ${error}`;
        console.log(msg);
      }

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
