const mongoose = require('mongoose');
require('dotenv').config(); 

const { MONGO_URI } = process.env;
mongoose.Promise = global.Promise;

// Connect to MongoDB
module.exports.connectDB = async () => {
    if (!MONGO_URI) {
        console.error('MONGO_URI is not  defined in the .env file');
        process.exit(1);  // Exit the process if MONGO_URI is not found
    }

    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connection Succeeded.');
    } catch (err) {
        console.error('Error in DB connection:', err.message);
        process.exit(1); // Exit the process if the DB connection fails
    }
};
