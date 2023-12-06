import React, { useCallback, useState } from 'react'
// import LoginButton from './buttons/loginButton';
// import SignupButton from './buttons/signupButton';
// import GuestButton from './buttons/guestButton';
import Login from "./Login.js";
import Signup from "./Signup.js"
import './stylesheets/welcomeStyle.css';
import { useLocationContext } from '../locationContext.js';
import { DataDao } from '../../models/ModelDAO.js';

const WelcomePage = () => {
  const { setPageAndParams, setLoggedIn } = useLocationContext();
  const [showLogin, setShowLogin] = useState(true);
  DataDao.getInstance().getCSRFToken();
  const handleButtonClick = useCallback((e) => {
    e.preventDefault();
    setShowLogin(!showLogin);
  }, [showLogin]);

  return (
    <>
      <div className="welcome_page">
        <h4>
          <div className="buttonColumn">
            {/* <LoginButton />
              <SignupButton />
              <GuestButton /> */}
            {showLogin ? <Login handleButtonClick={handleButtonClick} /> : <Signup handleButtonClick={handleButtonClick} />}
            {/* <button type='submit' id='loginButton' href='' onClick={handleButtonClick}>Login</button>
            <button type='submit' id='signupButton' href='' onClick={handleButtonClick}>Signup</button> */}
            <button type='submit' id='guestButton' href='' onClick={(e) => { e.preventDefault(); setLoggedIn(false); setPageAndParams('questions') }}>Guest</button>
          </div>
        </h4>
      </div>
    </>
  );
};

export default WelcomePage;