const express = require('express');
const session = require("express-session");
const cors = require('cors');
const cookieParser = require("cookie-parser");
// const dotenv = require("dotenv");  
// const csrf = require('csurf'); 

// dotenv.config();

const app = express();
const port = 8000;

const secret = process.env.SESSION_SECRET; 


// Initialize mongo db connection
require('./config/database');

const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');
const tagRoutes = require('./routes/tagRoutes');
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware:

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: `${secret}`,
    cookie: {
      httpOnly: true,
      sameSite: true,
    },
    resave: false,
    saveUninitialized: false,
  })
);



app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['POST', 'PUT', 'DELETE', 'GET'],
  allowedHeaders: 'Content-Type,Authorization',
}));

app.use(express.json());

app.use(cookieParser());

// app.use(csrf({ cookie: true })); // Enable CSRF protection

// app.get('/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);
app.use('/tags', tagRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// When the server starts
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
