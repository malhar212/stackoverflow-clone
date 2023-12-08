import React , { useEffect, useState} from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import './stylesheets/profilePage.css'
import '../questions/questionList.js'
// import QuestionList from '../questions/questionList.js';
import AnswersList from '../answers/answersList.js';
import { DataDao } from '../../models/ModelDAO';

const ProfilePage = () => {
  const dao = DataDao.getInstance();
  const { user } = useLocationContext();

  // the data loaded into the page
  const [selectedData, setSelectedData] = useState();
  // the selection of which data (questions, answeers or tags) should be on the page
  const [dataType, setDataType] = useState('profileQuestions');
  const [selectedAnswers, setSelectedAnswers] = useState([]);

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
          // tempData = await dao.fetchQuestionsBasedOnUser();
          break;
        }
        case "profileAnswers": {
          tempData = await dao.fetchAnswersBasedOnUser();
          setSelectedAnswers(tempData)
          console.log(selectedAnswers)

          break;
        }
        case "profileTags": {
          // tempData = await dao.fetchTagsBasedOnUser();
          break;
        }
        default:
          // Default to fetching answers if the dataType doesn't match any case
          tempData = await dao.fetchAnswersBasedOnUser();
          console.log(tempData);
      }
      setSelectedData(tempData);
    };
  
    fetchData(); 
  }, [dataType]);

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
                {/* <QuestionList /> */}
                {/* should conditinoally render based on page params */}
                <AnswersList qid={null} selectedAnswers={selectedAnswers} setAnswers={setSelectedAnswers}/>
                {console.log("IN PROFILE PAGE: " + JSON.stringify(selectedData, null, 4))}
                {/* {console.log(user.username)} */}
                {console.log(dataType)}
        
      </div>
    </MainContent>
  );

  }

export default ProfilePage;
