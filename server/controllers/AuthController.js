const bcrypt = require('bcrypt');
const User = require('../models/users');

// const { signUp, signIn } = require('../validations/userValidation');

// exports.Login = async (req, res) => {
//   try {
//     // check if user credentials are correct
//      res.status(200).json({ success: true, data: "login"});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Login failure" });
//   }
// };

exports.Login = async (req, res) => {

  try {
    console.log("in login!")
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      console.log("in auth controller - wrong usernae")
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, login successful
      console.log("in auth controller - correct password1")
      console.log(user)
      req.session.user = user.username;
      console.log("in auth controller - correct password2")
      return res.status(200).json({ success: true, data: user.username });
    } else {
      console.log("in auth controller - wrong password")
      // Passwords don't match, login failed
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Login failure' });
  }
};

exports.Signup = async (req, res) => {
  try {
      const { username, email, password } = req.body
      // req.session.user = req.body.username.trim()
      console.log(username, email, password + "===========================");

      const newUser = new User(req.body);
      await newUser.save();
      // const response = `<p>Thank you</p> <a href="/">Back home</a>`;
      const response = username;
      res.status(200).json({ success: true, data: response});
      // res.send(`<p>Thank you</p> <a href="/">Back home</a>`)
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.checkLoginGetUsername = async (req, res) => {
  try {
    let name = "Guest";
    if (req.session.user) name = req.session.user;
    res.status(200).json({ success: true, data: name });
    res.send(`
    <h1>Welcome, ${name}</h1>
    <form action="/register" method="POST">
      <input type="text" name="name" placeholder="Your name">
      <button>Submit</button>
    </form>
    <form action="/forget" method="POST">
      <button>Logout</button>
    </form>
    `)

    // res.send(name); 
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
