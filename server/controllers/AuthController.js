// controllers/AuthController.js
// const bcrypt = require('bcryptjs');
const User = require('../models/users');
// const signUp = require('../validations/userValidation');
// const Joi = require('joi')


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
      // const { username, email, password } = req.body
      // await Joi.validate({ username, email, password }, signUp);
    // Assuming req.body contains the user data
    const newUser = new User(req.body);
    await newUser.save();

    res.status(200).json({ success: true, data: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// exports.Signup = async (req, res) => {
//   try {
//     const { username, email, password } = req.body
//     await Joi.validate({ username, email, password }, signUp);
//     const newUser = new User({ username, email, password });
//     await newUser.save();
//     res.send({ userId: newUser.id, username });
//   } catch (err) {
//     res.status(400).send(err);
//   }
//   };