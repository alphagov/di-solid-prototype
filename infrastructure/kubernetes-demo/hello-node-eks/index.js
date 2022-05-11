const {SecretsManagerClient, GetSecretValueCommand} = require('@aws-sdk/client-secrets-manager');
const express = require('express')
const mongo = require('./mongo-service')

const app = express()
const port = 3000

app.get('/', (req, res) => {

  res.send(`Hello Node!`);
})

app.get('/check', async (req, res) => {
  const secretManager = new SecretsManagerClient({ region: "eu-west-2" });
  const command = new GetSecretValueCommand({ SecretId: 'hello-world-document-db-credentials' });

  try {
    var data = await secretManager.send(command);
  } catch (error) {
    console.log(error);
    res.send(error);
  } finally {
    var dBCreds = JSON.parse(data.SecretString);
  }

  try {
    var col = await mongo.getCollection(dBCreds);
    var currentCount = await col.findOne({title: 'count'});

    if(currentCount == null) {
      col.insertOne({title: 'count', count: 1});
    } else {
      col.updateOne({title: 'count'}, {$inc: {count: 1}});
    }
  } catch (error) {
    console.log(error);
    res.send(error.toString());
  }

  res.send(`Hello Node!\n\n Fetched credentials from Secrets Manager as ${dBCreds["username"]}\n\nHit counter from DB: ${currentCount.count} views`);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
