# Solid Protoype

A prototype to evaluate Solid as a personal data store

## Running the prototype app

1. Run `npm install` to install dependencies
2. Run `npm run build` to build the app
3. Run `npm start` to start the local server
4. Visit `http://localhost:3000` in your browser 

## Deployment

The app is deployed to AWS ECS on Fargate and is available at https://prototype.solid.integration.account.gov.uk/

To deploy a new version:
```bash
cd infastructure/prototype-app
gds aws di-solid-prototype ./deploy.sh
```

This will build a new Docker image, tag it with the Git hash, upload that image to ECR and finally deploy the app.
