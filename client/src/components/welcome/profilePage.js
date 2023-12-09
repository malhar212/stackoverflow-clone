import React , { useEffect, useState, useContext } from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import { SearchTextContext } from '../searchTextContext';
import './stylesheets/profilePage.css'
import '../questions/questionList.js'
// import QuestionList from '../questions/questionList.js';
// import AnswersList from '../answers/answersList.js';
import { DataDao } from '../../models/ModelDAO';

const ProfilePage = () => {
  const dao = DataDao.getInstance();
  const { user, setPageAndParams } = useLocationContext();
  const { setSearchQuery } = useContext(SearchTextContext);

  // the data loaded into the page
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
          // tempData.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
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
          // tempData = await dao.fetchTagsBasedOnUser();
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
        setSearchQuery(" ".repeat(Math.floor(Math.random() * 10)));
        console.log("in profile page: answer clicked has id: " + answerId)
        setPageAndParams('editAnswer', answerId);
    }
}

  return (
    <MainContent>
      <div className="profilePageUserBanner">
        <h1> Welcome {username}!</h1>
        <span>Your reputation is: {reputation}</span>
        <span> Your account was created {daysAgo} ago.</span>
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
                    <h1> test test test test test test test test </h1>
                    {selectedData.map((question) => (
                      <li key={question.id}>
                      <a href='' title={question.title} onClick={handleAnswerClick(question._id)}>
                        {question.title && question.title.slice(0, 50)} {question.title && question.title.length > 50 ? '...' : ''}
                      </a>
                      </li>
                    ))}
                  </ul>
                )}  
      </div>
    </MainContent>
  );

  }

export default ProfilePage;
