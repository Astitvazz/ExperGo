const mongoose = require('mongoose');

/**
 * MongoDB connection configuration
 * Connects to MongoDB Atlas using connection string from environment variables
 */

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Astitvazz:9PAFbK7Bq0I2IdN3@cluster0.ejqzy.mongodb.net/BubbleBlog?retryWrites=true&w=majority&appName=Cluster0";

const connectToDb = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB successfully! 😊");
    } catch (error) {
        console.log("MongoDB connection failed! 😞 --->", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectToDb;