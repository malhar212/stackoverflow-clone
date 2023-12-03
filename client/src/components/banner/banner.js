import React from 'react';
import SearchBar from './searchBar';
import LoginButton from './loginButton';

function Banner(){
        return (
          <div className = "banner">
            <h1 id="pageTitle"> Fake Stack Overflow </h1>
            <SearchBar />
            <LoginButton />
          </div>
        );
    }
    




export default Banner;