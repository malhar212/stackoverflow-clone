import React, { useCallback, useState } from 'react'
import Login from "./Login.js";
import Signup from "./Signup.js"
import { useLocationContext } from '../locationContext.js';

const WelcomePage = () => {

  console.log("in welcome ")
  const { setPageAndParams, setLoggedIn } = useLocationContext();
  const [showLogin, setShowLogin] = useState(true);
  const handleButtonClick = useCallback((e) => {
    e.preventDefault();
    setShowLogin(!showLogin);
  }, [showLogin]);

  return (
    <>
      <div className="welcome_page">
            {showLogin ? <Login handleButtonClick={handleButtonClick} /> : <Signup handleButtonClick={handleButtonClick} />}
            <button type='submit' id='guestButton' href='' onClick={(e) => { e.preventDefault(); setLoggedIn(false); setPageAndParams('questions') }}>Guest</button>
          </div>
    </>
  );
};

export default WelcomePage;