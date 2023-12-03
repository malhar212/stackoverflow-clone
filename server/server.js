// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
// const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const port = 8000;
var cors = require('cors');
const cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');
const authRoute = require("./routes/AuthRoute");
// const { MONGO_URL, PORT } = process.env;

require("dotenv").config();

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

app.use(cookieParser());

app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);
app.use('/tags', tagRoutes);
app.use("/", authRoute);

// When the server starts 
app.listen(port, ()=> {
  console.log('Server running on port 8000');
});


// mongoose
//   .connect(MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB is  connected successfully"))
//   .catch((err) => console.error(err));

// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });

// app.use(
//   cors({
//     origin: ["http://localhost:4000"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// app.use(express.json());



// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://sam:bPHET2NvtdXlhqzq@atlascluster.yqrsvmn.mongodb.net/?retryWrites=true&w=majority";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);