const express = require('express');
const { connectDB } = require("./config/Databaese"); 
    const authRouter = require('./Router/authRouter');

const app = express();

require('dotenv').config(); // Load environment variables

const { PORT } = process.env;
const port = PORT || 3000; 

// Connect to MongoDB
connectDB();

//-------------- Middleware ---------------------------
app.use(express.json());  // Parse application/json
app.use(express.urlencoded({ extended: false }));  // Parse application/x-www-form-urlencoded

// ------------------ Routes -------------------------
app.use('/api/auth', authRouter);

// ------------------ Server -------------------------
app.listen(port, () => console.log(`🚀🚀🚀🚀Server running on port  ${port}!🚀🚀🚀🚀🚀🚀🚀🚀`));
