// controllers/AuthController.js
// const bcrypt = require('bcryptjs');
// const User = require('../models/User'); 

exports.Signup = async (req, res) => {
  try {
    res.status(201).json({ success: true, data: "Signup success"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.Login = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: "Login success"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failure" });
  }
};