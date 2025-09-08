import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';

const database = process.env.DATABASE;
const conn_string = process.env.MONGODB_CONNECTION_STRING;
const clientDB = new MongoClient(conn_string, {
  maxPoolSize: 50, // Reduced from 100 for better resource management
  minPoolSize: 5, // Keep some connections ready
  maxConnecting: 10, // Reasonable connection establishment during spikes
  maxIdleTimeMS: 60000, // Close idle connections after 1 minute
  waitQueueTimeoutMS: 5000, // Fail fast if connections aren't available
});
const collectionUser = clientDB.db(database).collection('users');

/*
  user sample document
  {
    "_id": ObjectId("68a54cc40aea630b5484d22e"),
    "email": "xxxxx", 
    "password": "yyyyyy", 
    "firstname": "zzzzz", 
    "lastname": "wwwww",
    "address": "ppppp",
    "city": "qqqqq",
    "state": "rrrrr",
    "zip": "sssss",
    "country": "ttttt",
    "phone": "uuuuu",
    "role": "member",
    "active": true,
    "createdAt": ISODate("2023-11-01T15:30:12.345Z"),
    "updatedAt": ISODate("2023-11-01T15:30:12.345Z")
  }
 */
export const lambdaHandler = async (event, context) => {
  try {
    const user_collection = await queryUser(event);
    return { StatusCode: 200, body: { message: user_collection } };
  } catch (err) {
    console.log(`General error. Error: ${err.message}`);
    return { StatusCode: 500, body: { message: err.message } };
  }
};

async function queryUser(event) {
  const user_collection = await collectionUser.findOne({
    email: event.username,
    password: event.password,
  });

  console.log(`User found: ${JSON.stringify(user_collection)}`);
  return user_collection;
}
