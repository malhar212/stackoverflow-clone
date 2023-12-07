import React from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import './stylesheets/profilePage.css'

const ProfilePage = () => {
  const { user} = useLocationContext();

  // console.log(JSON.stringify(user, null, 4))

  const username = user.username;
  const reputation = user.reputation;
  // const createdAt = user.createdAt;
  const days_ago = 4;

  return (
    <MainContent>
      <div className="profilePage">
        <h1> Welcome {username}!</h1>
        <span>Your reputation is: {reputation}</span>
        <span> Your account was created {days_ago} ago.</span>
      </div>
    </MainContent>
  );

  }

export default ProfilePage;
