import React from 'react';
import SearchBar from './searchBar';
import LoginButton from './loginButton';
import SignupButton from './signupButton';
import GuestButton from './guestButton';

function Banner(){
        return (
          <div className = "banner">
            <h1 id="pageTitle"> Fake Stack Overflow </h1>
            <SearchBar />
            <LoginButton />
            <SignupButton />
            <GuestButton />
          </div>
        );
    }
    




export default Banner;