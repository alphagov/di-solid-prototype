import { Session } from "@inrupt/solid-client-authn-node";
import {
  createSolidDataset,
  getPodUrlAll,
  getSolidDataset,
  SolidDataset,
  setThing,
  saveSolidDatasetAt,
  overwriteFile,
  getSourceUrl,
  getThing,
  getDatetime,
  getStringWithLocale,
  universalAccess,
  // eslint-disable-next-line camelcase
  acp_ess_2,
  asUrl,
} from "@inrupt/solid-client";
// eslint-disable-next-line import/no-unresolved
import { WithAccessibleAcr } from "@inrupt/solid-client/dist/acp/acp";
// eslint-disable-next-line import/no-unresolved
import { AccessModes } from "@inrupt/solid-client/dist/acp/type/AccessModes";

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
import { Blob } from "node:buffer";
import { getEssServiceURI, EssServices, getCheckStoragePath } from "../config";
import SessionError from "../errors";
import { CheckArtifacts } from "./credentials";

export async function createProfileAndPod(session: Session) {
  if (session.info.webId) {
    await session.fetch(session.info.webId, { method: "POST" });
    const provision = await (
      await session.fetch(getEssServiceURI(EssServices.Provision), {
        method: "POST",
      })
    ).json();

    await session.fetch(`${session.info.webId}/provision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "@context": {
          id: "@id",
          storage: {
            "@type": "@id",
            "@id": "http://www.w3.org/ns/pim/space#storage",
          },
          profile: {
            "@type": "@id",
            "@id": "http://xmlns.com/foaf/0.1/isPrimaryTopicOf",
          },
        },
        id: session.info.webId,
        profile: provision.profile,
        storage: provision.storage,
      }),
    });
  }
}

export async function getOrCreateDataset(
  session: Session,
  datasetUri: string
): Promise<SolidDataset> {
  try {
    const dataset = await getSolidDataset(datasetUri, { fetch: session.fetch });
    return dataset;
  } catch (fetchError) {
    const dataset = createSolidDataset();
    return dataset;
  }
}

export async function getDatasetUri(session: Session, containerPath: string) {
  if (session.info.webId && containerPath) {
    const podUri = await getPodUrlAll(session.info.webId, {
      fetch: session.fetch,
    });
    return `${podUri[0]}${containerPath}`;
  }
  throw new SessionError();
}

// Upload File to the targetFileURL.
// If the targetFileURL exists, overwrite the file.
// If the targetFileURL does not exist, create the file at the location.
async function writeFileToPod(
  file: Blob,
  targetFileURL: string,
  session: Session
) {
  try {
    const savedFile = await overwriteFile(
      targetFileURL, // URL for the file.
      // We need to explicitly convert our 'Blob' into a Buffer here (see
      // detailed comment on our 'import { Blob }' code above).
      Buffer.from(await file.arrayBuffer()),
      // file,                                               // File
      { contentType: file.type, fetch: session.fetch } // mimetype if known, fetch from the authenticated session
    );
    console.log(`File saved at ${getSourceUrl(savedFile)}`);
  } catch (error) {
    console.error(error);
  }
}

export async function writeCheckToPod(
  session: Session,
  checkArtifacts: CheckArtifacts
) {
  await writeFileToPod(checkArtifacts.file, checkArtifacts.fileUri, session);
  const metadataDataset = await getOrCreateDataset(
    session,
    checkArtifacts.metadataUri
  );
  const updatedDataset = setThing(metadataDataset, checkArtifacts.metadata);
  await saveSolidDatasetAt(checkArtifacts.metadataUri, updatedDataset, {
    fetch: session.fetch,
  });

  console.log(
    `Saved resources (Blob [${checkArtifacts.fileUri}] and it's metadata [${checkArtifacts.metadataUri}]) to Pod`
  );
}

export async function hasSavedIdentityChecks(
  session: Session
): Promise<boolean> {
  try {
    await getSolidDataset(
      await getDatasetUri(session, `${getCheckStoragePath()}/kbv/metadata`),
      { fetch: session.fetch }
    );
    await getSolidDataset(
      await getDatasetUri(
        session,
        `${getCheckStoragePath()}/passport/metadata`
      ),
      { fetch: session.fetch }
    );
  } catch (FetchError) {
    return false;
  }
  return true;
}

interface CredentialMetadata {
  description: string | null;
  createdAt: Date | null;
}

export async function getCredentialMetadataFromPod(
  session: Session,
  credentialUri: string
): Promise<CredentialMetadata> {
  const credentialDataset = await getSolidDataset(credentialUri, {
    fetch: session.fetch,
  });

  const credentialThing = getThing(credentialDataset, credentialUri);

  if (credentialThing) {
    const description = await getStringWithLocale(
      credentialThing,
      "https://vocab.account.gov.uk/VCDescription",
      "en"
    );
    const createdAt = await getDatetime(
      credentialThing,
      "https://vocab.account.gov.uk/vcCreatedAt"
    );

    return {
      description,
      createdAt,
    };
  }
  return {
    description: null,
    createdAt: null,
  };
}

export const grantDefaultMemberReadAccessForResource = async (
  session: Session,
  resourceIri: string,
  agentWebId: string
): Promise<boolean | string> => {
  if (!resourceIri || !agentWebId) {
    const message = `Attempting to set default Read access to a resource requires *both* a resource IRI (got [${resourceIri}]) and an agent WebID (got [${agentWebId}]).`;
    console.log(message);
    return message;
  }

  const MATCHER_NAME = "matcher-QPFIndexer";
  const POLICY_NAME = "defaultMemberPolicy-QPFIndexer";
  try {
    // 1. Fetch the SolidDataset with its Access Control Resource (ACR).
    // eslint-disable-next-line camelcase
    const resourceWithAcr = await acp_ess_2.getSolidDatasetWithAcr(
      resourceIri, // Resource whose ACR to set up.
      { fetch: session.fetch } // fetch from the authenticated session.
    );

    // 2. Initialize a new Matcher.
    // eslint-disable-next-line camelcase
    let matcher = acp_ess_2.createResourceMatcherFor(
      resourceWithAcr as WithAccessibleAcr,
      MATCHER_NAME
    );

    // 3. For the matcher, specify the agent.
    // eslint-disable-next-line camelcase
    matcher = acp_ess_2.addAgent(matcher, agentWebId);

    // 4. Store matcher definition.
    // eslint-disable-next-line camelcase
    const newResourceWithAcr = acp_ess_2.setResourceMatcher(
      resourceWithAcr as WithAccessibleAcr,
      matcher
    );

    // 5. Create a Policy that uses the matcher.
    // eslint-disable-next-line camelcase
    let policy = acp_ess_2.createResourcePolicyFor(
      newResourceWithAcr,
      POLICY_NAME
    );

    // 6. Add the matcher to the Policy as an allOf() expression.
    // Since using allOf() with a single Matcher, could also use anyOf() expression.
    // eslint-disable-next-line camelcase
    policy = acp_ess_2.addAllOfMatcherUrl(policy, matcher);

    // 7. Specify Read access.
    // eslint-disable-next-line camelcase
    policy = acp_ess_2.setAllowModes(policy, { read: true } as AccessModes);

    // 8. Add/Apply the Policy as the defaultMemberPolicy
    // eslint-disable-next-line camelcase
    const newResourceWithAcr2 = acp_ess_2.addMemberPolicyUrl(
      newResourceWithAcr,
      asUrl(policy)
    );

    // 9. Add the Policy definition to ACR.
    // eslint-disable-next-line camelcase
    const newResourceWithAcr3 = acp_ess_2.setResourcePolicy(
      newResourceWithAcr2,
      policy
    );

    // 10. Save the ACR for the Resource.
    // eslint-disable-next-line camelcase
    await acp_ess_2.saveAcrFor(
      newResourceWithAcr3,
      { fetch: session.fetch } // fetch from the authenticated session.
    );
    return true;
  } catch (error) {
    const message = `Error attempting to set default Read access to resource [${resourceIri}] to agent with WebID [${agentWebId}]. Error: ${error}`;
    console.log(message);
    return message;
  }
};

export async function ensureFragmentIndexerGrantedAccess(
  session: Session,
  fragmentIndexerWebId: string
) {
  if (!session.info.webId) {
    console.log(
      `No session WebID when trying to ensure Fragment Indexer has been granted access to Pod root.`
    );
    throw new SessionError();
  }

  const podUri = await getPodUrlAll(session.info.webId, {
    fetch: session.fetch,
  });
  const podRoot = podUri[0];
  const returnedAccess = await universalAccess.getAgentAccess(
    podRoot,
    fragmentIndexerWebId,
    { fetch: session.fetch }
  );
  if (returnedAccess === null) {
    console.log(
      `Could not load access details for Fragment Indexer: [${fragmentIndexerWebId}] for Pod root: [${podRoot}].`
    );
    throw new SessionError();
  }
  console.log(
    `Returned access details for Fragment Indexer: [${fragmentIndexerWebId}] for Pod root: [${podRoot}]: ${JSON.stringify(
      returnedAccess
    )}.`
  );

  if (returnedAccess.read) {
    console.log(
      `Fragment Indexer: [${fragmentIndexerWebId}] already has 'Read' access to Pod root: [${podRoot}]`
    );
  } else {
    const result = await grantDefaultMemberReadAccessForResource(
      session,
      podRoot,
      fragmentIndexerWebId
    );

    if (result === true) {
      console.log(
        `Successfully set 'Read' access to Fragment Indexer: [${fragmentIndexerWebId}] for Pod root: [${podRoot}]`
      );
    } else {
      console.log(
        `Failed to set 'Read' access to Fragment Indexer: [${fragmentIndexerWebId}] for Pod root: [${podRoot}]. Reason: ${result}`
      );
      throw new SessionError();
    }
  }
}
