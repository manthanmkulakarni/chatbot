const { MongoClient } = require('mongodb')
const mongoClient = await MongoClient.connect('mongodb://localhost:27017')
process.on('SIGINT', () => mongoClient.close()) // Graceful connection shutdown on CTRL+C
bp.mongoDb = mongoClient.db('myDbName')