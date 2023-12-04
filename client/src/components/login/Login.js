import React, { useState } from "react";
import { useLocationContext } from '../locationContext.js';
import { ToastContainer, toast } from "react-toastify";
import MainContent from '../mainContent.js';
import '../../stylesheets/form.css'
import { DataDao } from '../../models/ModelDAO.js';

const Login = () => {
  const { page, params } = useLocationContext();
  const { setPageAndParams } = useLocationContext();
  console.log("Page is: " + page + "Params: " + params)


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
    const credentials = {
      username: 'your_username',
      password: 'your_password',
    };

    const userData = await DataDao.getInstance().login(credentials);

    if (userData) {
      // Handle successful login (e.g., update state, redirect, etc.)
      handleSuccess("Success!")
      console.log('Login successful:', userData);
      setTimeout(() => {
        {setPageAndParams('/', '')}
      }, 1000);
    } else {
      // Handle login failure
      handleError("login failed");
    }
  }

  return (
    <MainContent>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Submit</button>
        <span>
        <a id='signupButton' href='' onClick={(e)=> { e.preventDefault(); setPageAndParams('signup')}}>Need to Signup?</a>
        </span>
      </form>
      <ToastContainer />
      </MainContent>
  );
};

export default Login;
  