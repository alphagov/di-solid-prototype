import { Request, Response } from "express";
import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";
import { getDatasetUri, writeCheckToPod } from "../../lib/pod";

import { buildKbvCheckArtifacts } from "../../lib/kvbCheckVc";
import { buildPassportCheckArtifacts } from "../../lib/passportCheckVc";

import SessionError from "../../errors";

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

export function saveGet(req: Request, res: Response) {
  res.render("identity/save");
}

export async function savePost(req: Request, res: Response): Promise<void> {
  const session = await getSessionFromStorage(req.session?.sessionId);

  if (session && req.session) {
    req.session.webId = session.info.webId;
    const containerUri = await getDatasetUri(
      session,
      "private/govuk/identity/poc/credentials-pat/vcs"
    );

    const passportArtifacts = buildPassportCheckArtifacts(
      req.session,
      containerUri
    );
    await writeCheckToPod(session, passportArtifacts);

    const kbvArtifacts = buildKbvCheckArtifacts(req.session, containerUri);
    await writeCheckToPod(session, kbvArtifacts);

    res.redirect("/identity/complete/saved");
  } else {
    throw new SessionError();
  }
}
