import React , { useEffect, useState } from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import './stylesheets/profilePage.css'
import '../questions/questionList.js'
import { DataDao } from '../../models/ModelDAO';

// Questions posted by the user: 
// Displays a set of question titles 
// asked by the user in newest order. 
// Display 5 at a time with next and 
// prev buttons like the home page. 
// Each question title is a link which
// when clicked shows the new question 
// page. In this page the user can modify
// the existing question and repost it or 
// delete it. 
  
// Tags created by the user: 
// The set of tags are displayed 
// n the same format as described
// in the tags page. Additionally,
// a tag entry has an option 
// for the user to delete or
// edit the tag.

// Answers created by the user:
// All answers are displayed
// as links of 50 characters.
// Recently created answer
// must be displayed first.
// Pressing the link, shows 
// the new answer form pre-filled
// with the answer. 
// The user can edit 
// or delete the answer.

const ProfilePage = () => {
  const dao = DataDao.getInstance();
  const { user, setPageAndParams } = useLocationContext();

  // the actual data loaded into the page (questions, answers, etc.)
  const [selectedData, setSelectedData] = useState();
  // the selection of which data (questions, answeers or tags) should be on the page
  const [dataType, setDataType] = useState();

  // for upper banner w/ welcome and user stats
  const username = user.username;
  const reputation = user.reputation;
  // const createdAt = user.createdAt;
  const daysAgo = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));

  // depending on button clicked will set selectedData to questions, answers or tags of the user
  useEffect(() => {
    const fetchData = async () => {
      let tempData;
      switch (dataType) {
        case "profileQuestions": {
          tempData = await dao.fetchUserQuestions();
          console.log("Temp data is: " + JSON.stringify(tempData, null, 4))
          tempData.sort((a, b) => new Date(b.asked_date_time) - new Date(a.asked_date_time));
          // console.log("SORTED Temp data is: " + JSON.stringify(tempData, null, 4))
          setSelectedData(tempData)
          break;
        }
        case "profileAnswers": {
          tempData = await dao.fetchUserAnswers();
          console.log("Temp data is: " + JSON.stringify(tempData, null, 4))
          tempData.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
          console.log("SORTED Temp data is: " + JSON.stringify(tempData, null, 4))
          setSelectedData(tempData)
          break;
        }
        case "profileTags": {
          tempData = await dao.fetchTagsByUsername(username);
          console.log("Temp data is: " + JSON.stringify(tempData, null, 4))
          setSelectedData(tempData)
          console.log("after set selected data")
          break;
        }
        default:
          // Default to fetching answers if the dataType doesn't match any case
          // tempData = await dao.fetchAnswersBasedOnUser();
          // console.log(tempData);
          break;
      }
      setSelectedData(tempData);
    };
  
    fetchData(); 
  }, [dataType]);


  function handleAnswerClick(answerId) {
    return function (event) {
        event.preventDefault();
        // setSearchQuery(" ".repeat(Math.floor(Math.random() * 10)));
        console.log("in profile page: answer clicked has id: " + answerId)
        setPageAndParams('editAnswer', answerId);
    }
}

function handleQuestionClick(questionId) {
  return function (event) {
    event.preventDefault();
    console.log("in profile page in handle ANSWER click" + questionId);
    setPageAndParams('editQuestion', questionId)
  }
}


  return (
    <MainContent>
      <div className="profilePageUserBanner">
        <h1> Welcome {username}!</h1>
        <span>Your reputation is: {reputation}</span>
        <span> Your account was created {daysAgo} day(s) ago.</span>
        <div className = "profile-btn-group">
            <button id='profileAnswersButton' onClick={()=>setDataType('profileAnswers')}>My Answers</button>
          <button id='profileQuestionsButton' onClick={()=>setDataType('profileQuestions')}>My Questions</button>
            <button id='profileTagsButton' onClick={()=>setDataType('profileTags')}>My Tags</button>
        </div>
      </div>
      <div className = "profileContent">
      
      {dataType === 'profileAnswers' && selectedData && (
        <ul>
          {selectedData.map((answer) => (
          <li key={answer.id}> 
          <a href='' title={answer.text} onClick={handleAnswerClick(answer._id)}>
          {answer.text && answer.text.slice(0, 50)} {answer.text && answer.text.length > 50 ? '...' : ''}
          </a>
          </li>
          ))}
        </ul>
      )}

      {dataType === 'profileQuestions' && selectedData && (
        <ul>
          {selectedData.map((question) => (
          <li key={question.id}>
          <a href='' title={question.title} onClick={handleQuestionClick(question._id)}>
          {question.title && question.title.slice(0, 50)} {question.title && question.title.length > 50 ? '...' : ''}
          </a>
          </li>
      ))}
        </ul>
    )}

    {dataType === "profileTags" && selectedData && (
      <h1> tags will go here ............. </h1>
    )}
      </div>
    </MainContent>
  );

  }

export default ProfilePage;
