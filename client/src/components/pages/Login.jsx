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
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
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
        "http://localhost:4000/login",
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
          {setPageAndParams('/')}
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };

  return (
    <MainContent>
      <h2>Login Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Emailhkjhkjhkjhkhkjhkjhj</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
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
        <a id='askButton' href='' onClick={(e)=> { e.preventDefault(); setPageAndParams('addQuestion')}}>Ask a Question</a>
        </span>
      </form>
      <ToastContainer />
      </MainContent>
  );
};

export default Login;
  