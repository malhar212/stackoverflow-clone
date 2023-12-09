const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const csrf = require('@dr.pogodin/csurf');

dotenv.config();

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
const commentRoutes = require('./routes/commentRoutes');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['POST', 'PUT', 'DELETE', 'GET'],
  //allowedHeaders: /* 'Content-Type, Authorization,  */'X-CSRF-Token', // Add X-CSRF-Token here
}));

// Enable JSON and URL-encoded parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable cookie parsing
app.use(cookieParser());

// Enable session middleware
app.use(session({
  secret: `${secret}`,
  cookie: {
    httpOnly: true,
    // secure: true,
    sameSite: true,
  },
  resave: false,
  saveUninitialized: false,
}));

// Enable CSRF protection
app.use(csrf({ cookie: false }));

// CSRF token endpoint 
app.get('/csrf-token', (req, res) => {
  // console.log("======CSRF ENDPOINT============")
  res.json({ csrfToken: req.csrfToken() });
});

// Route handlers
app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);
app.use('/tags', tagRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);

// When the server starts
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
