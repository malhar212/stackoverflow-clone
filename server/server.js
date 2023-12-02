// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const app = express();
const port = 8000;
var cors = require('cors');
var bodyParser = require('body-parser');

// Initialize mongo db connection
require('./config/database');

const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');
const tagRoutes = require('./routes/tagRoutes');
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());

app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);
app.use('/tags', tagRoutes);

// When the server starts 
app.listen(port, ()=> {
  console.log('Server running on port 8000');
});