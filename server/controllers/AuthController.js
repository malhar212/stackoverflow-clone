const bcrypt = require('bcrypt');
const User = require('../models/users');

exports.login = async (req, res) => {
  try {
    console.log("AUTH CONTROLLER LOGIN")
    const { username, password } = req.body;
    console.log("AUTH CONTROLLER LOGIN 2")
    // Find the user by username
    const user = await User.findOne({ username });
    console.log("AUTH CONTROLLER LOGIN 3")
    // Check if the user exists
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    console.log("AUTH CONTROLLER LOGIN 4")
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("AUTH CONTROLLER LOGIN 5")
    if (passwordMatch) {
      console.log("AUTH CONTROLLER LOGIN 6")
      // Passwords match, login successful
      console.log(user)
      console.log("AUTH CONTROLLER LOGIN 7")
      req.session.user = { username: user.username, uid: user._id };
      console.log("AUTH CONTROLLER LOGIN 8")
      return res.status(200).json({ success: true, data : { username : user.username, reputation : user.reputation, createdAt : user.createdAt } });
    } else {
      // Passwords don't match, login failed
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Login failure' });
  }
};

exports.signup = async (req, res) => {
  try {
      // const { username, email, password } = req.body
      // req.session.user = req.body.username.trim()

      const newUser = new User(req.body);
      await newUser.save();
      // const response = `<p>Thank you</p> <a href="/">Back home</a>`;
      res.status(200).json({ success: true, data: { csrfToken: req.csrfToken() }});
      // res.send(`<p>Thank you</p> <a href="/">Back home</a>`)
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.json({ success: true });
};

exports.checkLoginGetUsername = async (req, res) => {
  try {
    let name = "Guest";
    if (req.session.user) name = req.session.user;
    res.status(200).json({ success: true, data: name });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};