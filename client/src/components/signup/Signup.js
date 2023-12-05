import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { DataDao } from '../../models/ModelDAO';
import { useLocationContext } from '../locationContext';
import './stylesheets/signupStyle.css'

function Signup() {
  const { page, params } = useLocationContext();
  const { setPageAndParams } = useLocationContext();
  console.log("Page is: " + page + "Params: " + params)


  const [inputValue, setInputValue] = useState({
    email: "",
    username: "",
    password: "",
  });

  const { email, password, username } = inputValue;

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
    
    const credentials = inputValue;

    const userData = await DataDao.getInstance().signup(credentials);

    if (userData) {
      handleSuccess("Success!")
      setTimeout(() => {
        // if successfull signup, redirect to login page
        {setPageAndParams('login', '')}
      }, 1000);
    } else {
      // Handle failure
      handleError("Signup failed");
    }
  }



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
        <button type="submit">Submit</button>
      </form>
      <ToastContainer />
      </div>
  );
}

export default Signup;