const { MongoClient } = require("mongodb");

const url = 'mongodb+srv://niranjanpawar2:BVA2ferpSz52lM3z@namstenodelatest.8n8quio.mongodb.net/';

const client = new MongoClient(url);

const newRecord = {
    "firstName": "Anuja",
    "lastName": "Pawar",
    "address": 'F-635, tropica soc ravet pune',
    "contact": '9096994949',
    "age": '32',
    "gender": 'F'
}


const connectToDatabase = async () => {
    try {
        await client.connect();
        const db = client.db("helloWorld");
        const collection = db.collection("user");
        await collection.insertOne(newRecord); // created record // every time will get added a new record but with unique _id
        const document = await collection.find({}).toArray(); // find all documents
        console.log("Documents in 'user' collection:", document);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToDatabase();