const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Connection options optimized for MongoDB Atlas
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering
        };

        await mongoose.connect(process.env.MONGO_URI, options);
        console.log('✅ MongoDB Atlas connected successfully');
    } catch (error) {
        console.error('❌ MongoDB Atlas connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;