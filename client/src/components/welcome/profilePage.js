import React , { useEffect, useState } from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import './stylesheets/profilePage.css'
import '../questions/questionList.js'
import { DataDao } from '../../models/ModelDAO';
import PaginationComponent from '../paginationComponent.js';
import TagsList from '../tags/tagList.js';

const ProfilePage = () => {
  const dao = DataDao.getInstance();
  const { user, setPageAndParams, setUser} = useLocationContext();

  // the actual data loaded into the page (questions, answers, etc.)
  const [selectedData, setSelectedData] = useState();
  // the selection of which data (questions, answeers or tags) should be on the page
  const [dataType, setDataType] = useState();
  const itemsToShow = 5;


  // depending on button clicked will set selectedData to questions, answers or tags of the user
  useEffect(() => {
    (async () => {
      try {
        const responseData = await dao.getUserProfile();
        if (responseData.length === 0) {
          setUser(undefined);
          return;
        }
        setUser(responseData);
      } catch (error) {
        console.error(error.message);
      }
    })();
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
          tempData = await dao.fetchTagsByUsername(user.username);
          console.log("Temp data is: " + JSON.stringify(tempData, null, 4))
          setSelectedData(tempData)
          console.log("after set selected data")
          break;
        }
        default:
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


// for upper banner w/ welcome and user stats
  // const createdAt = user.createdAt;
  const daysAgo = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));

  return (
    <MainContent>
      <div className="profilePageUserBanner">
        <h1> Welcome {user.username}!</h1>
        <span>Your reputation is: {user.reputation}</span>
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

{/* (console.log(JSON.stringify(selectedData, null, 4))) && */}
      {dataType === 'profileQuestions' && selectedData  && (
        <PaginationComponent
          items={selectedData}
          itemsPerPage={itemsToShow}
          renderItem={(question) => (
            <li key={question.id}>
              <a href='' title={question.title} onClick={handleQuestionClick(question._id)}>
                {question.title && question.title.slice(0, 50)} {question.title && question.title.length > 50 ? '...' : ''}
              </a>
            </li>
          )}
        />
      )}


      {dataType === "profileTags" && selectedData && (
          <TagsList selectedData={selectedData} />
      )}
              </div>



    </MainContent>
  );

  }

export default ProfilePage;
