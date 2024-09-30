import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment Variable');
}

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch(err => {
      console.error('MongoDB connection error:', err);
      throw err; // Re-throw the error after logging
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch(err => {
    console.error('MongoDB connection error:', err);
    throw err; // Re-throw the error after logging
  });
}

// Optional: Verify connection
async function connectToDatabase() {
  try {
    await clientPromise;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

export default clientPromise;
