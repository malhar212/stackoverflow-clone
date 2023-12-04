import React from 'react';
import SearchBar from './searchBar';
import LoginButton from './loginButton';
import SignupButton from './signupButton';
import GuestButton from './guestButton';
import './stylesheets/style.css'

function Banner() {
  return (
    <div className="banner">
      <h1 id="pageTitle">Fake Stack Overflow</h1>
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