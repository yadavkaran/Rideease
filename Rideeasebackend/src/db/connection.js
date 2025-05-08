import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hopin";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
    console.log("Connected to MongoDB");
    
    // Create geospatial indexes for ride locations
    try {
        await mongoose.connection.collection('ride_details').createIndex({ "start_location": "2dsphere" });
        await mongoose.connection.collection('ride_details').createIndex({ "end_location": "2dsphere" });
        console.log("Geospatial indexes created successfully");
    } catch (error) {
        console.error("Error creating geospatial indexes:", error);
    }
});

export default db;