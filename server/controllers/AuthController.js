// controllers/AuthController.js
// const bcrypt = require('bcryptjs');
// const User = require('../models/User'); 

exports.Signup = async (req, res) => {
  try {
    // Your signup logic here
    res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.Login = async (req, res) => {
  try {
    // Your login logic here
    res.status(200).json({ success: true, data: "it worked!"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};