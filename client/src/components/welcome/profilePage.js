import React , { useEffect, useState} from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import './stylesheets/profilePage.css'
import '../questions/questionList.js'
// import QuestionList from '../questions/questionList.js';
// import AnswersList from '../answers/answersList.js';
import { DataDao } from '../../models/ModelDAO';

const ProfilePage = () => {
  const dao = DataDao.getInstance();
  const { user } = useLocationContext();

  // the data loaded into the page
  const [selectedData, setSelectedData] = useState();
  // the selection of which data (questions, answeers or tags) should be on the page
  const [dataType, setDataType] = useState('profileQuestions');

  // for upper banner w/ welcome and user stats
  const username = user.username;
  const reputation = user.reputation;
  // const createdAt = user.createdAt;
  const daysAgo = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));

  // depending on button clicked will set selectedData to questions, answers or tags of the user
  useEffect(() => {
    const fetchData = async () => {
        let selectedData;
        switch (dataType) {
            case "profileQuestions": {
              selectedData = await dao.getAnswersBasedOnUser();
              break;
            }
            case "profileAnswers": {
              selectedData = await dao.getAnswersBasedOnUser();
              break;
            }
            case "profileTags": {
              selectedData = await dao.getAnswersBasedOnUser();
                break;
            }
            default:
              selectedData = "hey";
              console.log(selectedData)
            }
          };
      
          fetchData().then((data) => {
            setSelectedData(data);
          });
        }, [dataType]);

  return (
    <MainContent>
      <div className="profilePageUserBanner">
        <h1> Welcome {username}!</h1>
        <span>Your reputation is: {reputation}</span>
        <span> Your account was created {daysAgo} ago.</span>
        <div className = "profile-btn-group">
            <button id='profileQuestionsButton' className={dataType === 'profileQuestions' || dataType === undefined ? 'active' : ''} onClick={()=>setDataType('profileQuestions')}>My Questions</button>
            {/* <button id='activeButton' className={sortState === 'active' ? 'active' : ''} onClick={()=>setSortState('active')}>Active</button>
            <button id='unansweredButton' className={sortState === 'unanswered' ? 'active' : ''} onClick={()=>setSortState('unanswered')}>Unanswered</button> */}
        </div>
      </div>
      <div className = "profileContent">
                {/* <QuestionList /> */}
                {/* should conditinoally render based on page params */}
                {/* <AnswersList qid={null} selectedAnswers={selectedData} setAnswers={setAnswers}/> */}
                {console.log("IN PROFILE PAGE: " + selectedData)}
      </div>
    </MainContent>
  );

  }

export default ProfilePage;
