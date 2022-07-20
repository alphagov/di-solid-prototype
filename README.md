# Solid Protoype

A prototype to evaluate Solid as a personal data store

## Pre-requisite - generate code from GDS vocabularies

Since we may not yet wish to publicly publish any of the vocabularies we
develop for this Proof of Concept (namely our own internal vocabularies, or ones
we create on behalf of 3rd-party data sources that don't yet provide Linked Data
vocabularies themselves), we first need to generate a local `npm` package that
bundles together JavaScript classes representing all the terms from all the
vocabularies we wish to use or reference in our code.

To do this, we run Inrupt's open-source
[Artifact Generator](https://github.com/inrupt/artifact-generator), pointing
it at our local configuration YAML file that references all the local
vocabularies we wish to use terms from, and that bundles together the
generated JavaScript classes that contain constants for all the terms from
each of those vocabularies (which are all located in the
[./src/vocab](./src/vocab) directory):

```script
npx @inrupt/artifact-generator generate --vocabListFile "src/vocab/vocab-gds-poc-bundle-all.yml" --outputDirectory "./src/InruptTooling/Vocab/GdsPoc" --noPrompt --force --publish npmInstallAndBuild
```

**Note:** If you have the Artifact Generator installed locally (e.g., for
faster execution), then you can run it directly:

```script
node ../SDK/artifact-generator/src/index.js generate --vocabListFile "src/vocab/vocab-gds-poc-bundle-all.yml" --outputDirectory "./src/InruptTooling/Vocab/GdsPoc" --noPrompt --force --publish npmInstallAndBuild
```

**Note**: during any ETL development, it's generally very common to continue
to re-run the Artifact Generator regularly, for example after any local
vocabulary changes or updates (we can also run it in 'file watcher' mode so
that it runs automatically on any local vocab file changes, which is really
convenient). So since it's a such a regular thing to run, it's generally a
good idea to clone and run the Artifact Generator locally (as that's much
faster than using `npx`).


## Running the prototype app

1. Run `npm ci` to install dependencies
2. Run `npm run build` to build the app
3. Run `npm run dev` to start the local server
4. Visit `http://localhost:3000` in your browser

## Deployment

The app is deployed to AWS ECS on Fargate and is available at https://prototype.solid.integration.account.gov.uk/

To deploy a new version:
```bash
cd infastructure/prototype-app
gds aws di-solid-prototype ./deploy.sh
```

This will build a new Docker image, tag it with the Git hash, upload that image to ECR and finally deploy the app.
