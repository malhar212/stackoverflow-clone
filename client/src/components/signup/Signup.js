import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { DataDao } from '../../models/ModelDAO';
import { useLocationContext } from '../locationContext';
import './stylesheets/signupStyle.css';

function Signup() {
  const { setPageAndParams } = useLocationContext();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      handleError("Passwords do not match");
      return;
    }

    const credentials = {
      email,
      username,
      password,
    };

    // console.log(credentials)

    // for testing
    // await DataDao.getInstance().test()

    // for keeping
    const userData = await DataDao.getInstance().signup(credentials);

    if (userData) {
      handleSuccess("Success!");
      setTimeout(() => {
        // if successful signup, redirect to login page
        setPageAndParams('login', '');
      }, 1000);
    } else {
      // Handle failure
      handleError("Signup failed");
    }
  };

  return (
    <div className="signupForm">
      <h2>Signup for Fake Stack Overflow!</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            placeholder="Confirm your password"
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Submit</button>
        <button id='loginButton' onClick={(e) => { e.preventDefault(); setPageAndParams('login')}}>Already signed up? Login here</button>
        <button id='guestButton' onClick={(e) => { e.preventDefault(); setPageAndParams('guest')}}>Continue as guest</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Signup;
