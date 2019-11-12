'use strict';
const MongoClient = require('mongodb').MongoClient;
const secret = require('./secret');

async function connectMongoDB() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(secret.mongodb.url, { useUnifiedTopology: true }, function(err, client) {
      if (err) {
        reject(err);
      }
      const db = client.db(secret.mongodb.dbName);
      resolve(db);
    });
  });
}

module.exports = connectMongoDB;
