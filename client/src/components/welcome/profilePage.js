import React from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import './stylesheets/profilePage.css'

const ProfilePage = () => {
  const { user, setPageAndParams} = useLocationContext();

  const username = user.username;
  const reputation = user.reputation;
  // const createdAt = user.createdAt;
  const daysAgo = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));



  return (
    <MainContent>
      <div className="profilePage">
        <h1> Welcome {username}!</h1>
        <span>Your reputation is: {reputation}</span>
        <span> Your account was created {daysAgo} ago.</span>
        <div className = "profile-btn-group">
          <button className='profileBtn' href='' onClick={(e) => { e.preventDefault(); setPageAndParams()}}>My QUESTIONS</button>
          <button className='profileBtn' href='' onClick={(e) => { e.preventDefault(); setPageAndParams()}}>My ANSWERS</button>
          <button className='profileBtn' href='' onClick={(e) => { e.preventDefault(); setPageAndParams()}}>My TAGS</button>
        </div>
      </div>
    </MainContent>
  );

  }

export default ProfilePage;
