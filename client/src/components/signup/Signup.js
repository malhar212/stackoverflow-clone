import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { DataDao } from '../../models/ModelDAO';
import { useLocationContext } from '../locationContext';

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
    try {

    // hard coded for testing - should be getInstace().signup
    const { userData } = await DataDao.getInstance().getUsername('656cf2553306392f5c8119e9');

    console.log(inputValue)

    const { success, message } = userData;

    if (success) {
      handleSuccess(message);
      setTimeout(() => {
        console.log("success! papge nav foes here");
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
    username: "",
  });
};


  return (
    <div>
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
        <span>
        <a id='signupButton' href='' onClick={(e)=> { e.preventDefault(); setPageAndParams('signup')}}>Need to Signup?</a>
        </span>
      </form>
      <ToastContainer />
      </div>
  );
}

export default Signup;