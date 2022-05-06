const MongoClient = require('mongodb').MongoClient;

function buildConnectionString(dBCreds) {
  const endpoint = process.env.DB_ENDPOINT;
  const port = process.env.DB_PORT;

  return `mongodb://${dBCreds['username']}:${encodeURIComponent(dBCreds['password'])}@${endpoint}:${port}/hello-world?tls=true&directConnection=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;
};

async function getCollection(dBCreds) {
  const connectionString = buildConnectionString(dBCreds);
  var client = await MongoClient.connect(
    connectionString,
    {
      'tlsCAFile': 'rds-combined-ca-bundle.pem'
    }
  )

  var db = client.db();
  var col = db.collection('hit-counter');
  return col;
};

module.exports = { getCollection }
