import React, { useState } from "react";
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import { DataDao } from '../../models/ModelDAO.js';
import { toast } from "react-toastify";

const Login = ({ handleButtonClick }) => {
  const { setPageAndParams, setLoggedIn, setUser, user, loggedIn } = useLocationContext();

  console.log("in login")

  const [inputValue, setInputValue] = useState({
    username: "",
    password: "",
  });

  const { username, password } = inputValue;

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
    
      // Check if any field is blank
      if (!username || !password) {
        handleError("Please fill in all fields");
        return;
      }
    
    const credentials = inputValue;

    const userData = await DataDao.getInstance().login(credentials);

    if (userData) {
      // Handle successful login (e.g., update state, redirect, etc.)
      handleSuccess("Success!")
      setLoggedIn(true);
      setUser(userData.data); // saving state of who is logged in
      console.log("In login: " + loggedIn)
      console.log("User is: " + JSON.stringify(user, null, 4))
      setTimeout(() => {
        { setPageAndParams('questions', '') }
      }, 1000);
    } else {
      // Handle login failure
      handleError("login failed");
    }
  }

  return (
    <MainContent>
      <div className="form">
      <h2>Login</h2>
      <form>
      <div className="buttonColumn">
        <div>
          <label htmlFor="username">Username  </label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
            autoComplete="current-username"
          />
        </div>
        <div>
          <label htmlFor="password">Password  </label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
            autoComplete="current-password"
          />
        </div>

          <button type="submit" onClick={handleSubmit}>Login</button>
          <button id='signupButton' onClick={handleButtonClick}>Need to Signup?</button>
          <button type='submit' id='guestButton' href='' onClick={(e) => { e.preventDefault(); setLoggedIn(false); setPageAndParams('questions') }}>Guest</button>
        </div>
      </form>
      </div>
    </MainContent>
  );
};

export default Login;
