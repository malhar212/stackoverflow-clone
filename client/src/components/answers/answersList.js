import React, { useEffect } from 'react';
import Answer from './answer';
import { DataDao } from '../../models/ModelDAO';
import PaginationComponent from '../paginationComponent';

// Display List of Answers
// recieves question object as prop (FIRST)
function AnswersList({ qid, selectedAnswers, setAnswers, showAcceptButton }) {
  const dao = DataDao.getInstance();
  const itemsPerPage = 5;
  useEffect(() => {
    const getAnswers = async () => {
      try {
        const responseData = await dao.filterAnswersBasedOnQuestionId(qid);
        setAnswers(responseData)
      } catch (error) {
        console.error(error.message);
      }
    };

    getAnswers();
  }, []);

  // // console.log(showAcceptButton);
  if (selectedAnswers !== undefined && selectedAnswers[0] !== undefined && selectedAnswers[0].accepted === true) {
    showAcceptButton = false;
  }
  // Create Individual answer in answer list
  function createAnswer(answer, accepted) {
    return (<Answer
      key={answer.aid}
      answer={answer}
      accepted={accepted}
      showAcceptButton={showAcceptButton}
    />)
  }

  return (
    <>
      {selectedAnswers === undefined || selectedAnswers.length === 0 ? (
        <span id='noAnswers'>No Answers</span>
      ) : (
        <div className='answer-list'>
          {/* {selectedAnswers.map( (answer) => createAnswer(answer))} */}
          <PaginationComponent items={selectedAnswers}
            itemsPerPage={itemsPerPage}
            renderItem={createAnswer} />
        </div>
      )}
    </>
  );
}

export default AnswersList;