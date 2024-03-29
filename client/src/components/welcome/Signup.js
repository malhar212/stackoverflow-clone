import React, { useState } from "react";
import { toast } from "react-toastify";
import { DataDao } from '../../models/ModelDAO';
import { useLocationContext } from '../locationContext';

function Signup({ handleButtonClick }) {
  const { setPageAndParams, setLoggedIn } = useLocationContext();

  const [inputValue, setInputValue] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "", // password confirmation
  });

  const { email, username, password, confirmPassword } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const isEmailValid = (email) => {
    // Regular expression for a valid email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is left blank
    if (!email || !username || !password || !confirmPassword) {
      handleError("Please fill in all fields");
      return;
    }

    if (!isEmailValid(email)) {
      handleError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      handleError("Passwords do not match");
      return;
    }

    if (password.includes(username) || password.includes(email)) {
      handleError("Password cannot contain username or email");
      return;
    }

    const credentials = {
      email,
      username,
      password,
    };

    try {
      const userData = await DataDao.getInstance().signup(credentials);

      if (userData) {
        handleSuccess("Success!");
          // if successful signup, redirect to login page
        handleButtonClick(e);
      }
    } catch (error) {
      console.log(error);
      error.message = error.response.data.error;
      console.log(error.message);
      // Handle failure with more detailed messages
      if (error.message.includes("E11000 duplicate key error collection: fake_so.users index: username_1")) {
        handleError("Username is already taken. Please choose another one.");
      } else if (error.message.includes("E11000 duplicate key error collection: fake_so.users index: email_1")) {
        handleError("Email is already registered. Please use a different email.");
      } else {
        handleError("Signup failed. Please try again.");
      }
    }
  }

  return (
    <div className="form">
      <h2>Signup for Fake Stack Overflow!</h2>
      <form>
        <div className="buttonColumn">
          <div>
            <label htmlFor="email">Email       </label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <label htmlFor="username">Username     </label>
            <input
              type="text"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password   </label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm your password"
              onChange={handleOnChange}
              
            />
          </div>
          <button type="submit" onClick={handleSubmit}>Sign Up!</button>
          <button id='loginButton' onClick={handleButtonClick}>Already signed up? Login here</button>
          <button type='submit' id='guestButton' href='' onClick={(e) => { e.preventDefault(); setLoggedIn(false); setPageAndParams('questions') }}>Guest</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
