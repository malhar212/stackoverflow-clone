import React from 'react';
import SearchBar from './searchBar';
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

