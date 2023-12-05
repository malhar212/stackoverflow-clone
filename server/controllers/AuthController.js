// controllers/AuthController.js
// const bcrypt = require('bcryptjs');
const User = require('../models/users');

// exports.Signup = async (req, res) => {
//   try {
//     res.status(201).json({ message: 'User signed up successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

exports.Login = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: "Login success"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failure" });
  }
};

exports.Signup = async (req, res) => {
  try {
    // Assuming req.body contains the user data
    const newUser = new User(req.body);
    await newUser.save();

    res.status(200).json({ success: true, data: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};