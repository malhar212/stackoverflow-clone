import React from 'react';
import SearchBar from './searchBar';
import LoginButton from './loginButton';
import SignupButton from './signupButton';
import GuestButton from './guestButton';
import './stylesheets/bannerStyle.css'
import { useLocationContext } from '../locationContext';



function Banner() {
  const { setPageAndParams } = useLocationContext();

  const handleClick = (newpage) => (event) => {
    event.preventDefault();
    setPageAndParams(newpage, {});
  };

  return (
    <div className="banner">
      <a id="pageTitle" href="#" onClick={handleClick('home')}>
        Fake Stack Overflow
      </a>
      <SearchBar />
      <div className="buttonColumn">
        <LoginButton />
        <SignupButton />
        <GuestButton />
      </div>
    </div>
  );
}

export default Banner;

