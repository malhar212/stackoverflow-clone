import React, { useState } from "react";
import axios from "axios";
import { useLocationContext } from '../locationContext';
import { ToastContainer, toast } from "react-toastify";
import MainContent from '../mainContent.js';
import '../../stylesheets/form.css'

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
    try {
      const { data } = await axios.post(
        "http://localhost:8000/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      console.log(data);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          {setPageAndParams('/', '')}
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      username: "",
      password: "",
    });
  };

  return (
    <MainContent>
      <h2>Login Account</h2>
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
  