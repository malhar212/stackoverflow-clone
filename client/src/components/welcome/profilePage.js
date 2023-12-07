import React from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';

const ProfilePage = () => {
  const { page, isLoggedIn, user} = useLocationContext();
  console.log("is logged in?" + isLoggedIn);
  console.log("In page: " + page)
  console.log("User is:" + user)
  console.log("usernam?" + user.username)

  console.log(JSON.stringify(user, null, 4))

  const username = user.data;

  





  return (
    <MainContent>
      <h1> Welcome {username}!</h1>
    </MainContent>
  );

  }

export default ProfilePage;
