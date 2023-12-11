import React from 'react';
import SearchBar from './searchBar';
import './stylesheets/bannerStyle.css'
import { useLocationContext } from '../locationContext';



function Banner() {
  const { setPageAndParams, user } = useLocationContext();

  const handleClick = (newpage) => (event) => {
    if(user) {
    // console.log("Current user is: " + user + " with username " + user.username);
    }
    else {
      // console.log("No current user!")
    }
    // console.log("Login state is: " + loggedIn);
    event.preventDefault();
    setPageAndParams(newpage, {});
  };

  return (
    <div className="banner">
      <div>
        <a id="pageTitle" href="#" onClick={handleClick('home')}>
          Fake Stack Overflow
        </a>
      </div>
      <SearchBar />
    </div>
  );
}

export default Banner;

