// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
require("dotenv").config(); // NEW
const app = express();
const port = 8000;
var cors = require('cors');
const cookieParser = require("cookie-parser"); // NEW
var bodyParser = require('body-parser');

// Initialize mongo db connection
require('./config/database'); 

const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');
const tagRoutes = require('./routes/tagRoutes');
const authRoutes = require('./routes/AuthRoutes'); // NEW
const userRoutes = require('./routes/userRoutes'); // NEW

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['POST', 'PUT', 'DELETE', 'GET'], // Adjust based on the methods your application uses
  allowedHeaders: 'Content-Type,Authorization',
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.json());

app.use(cookieParser()); // NEW

app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);
app.use('/tags', tagRoutes);
app.use('/auth', authRoutes); // NEW
app.use('/users', userRoutes); // NEW





// When the server starts 
app.listen(port, ()=> {
  console.log('Server running on port 8000');
});