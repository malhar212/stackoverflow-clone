import React from 'react'
import { ToastContainer } from 'react-toastify';
import LoginButton from './buttons/loginButton';
import SignupButton from './buttons/signupButton';
import GuestButton from './buttons/guestButton';
import './stylesheets/welcomeStyle.css';

const Home = () => {
    let username;
  return (
    <>
      <div className="home_page">
        <h4>
          <span id="welcomeText">Welcome </span>
          {/* If theres a value for username, append the user's name to the welcomeText. If not, display the login, signup and guest buttons */}
          <span>{ username ? username : 
             <div className="buttonColumn">
              <LoginButton />
              <SignupButton />
              <GuestButton />
            </div>
          }</span>
        </h4>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;