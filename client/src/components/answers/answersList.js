import React, { useState, useEffect} from 'react';
import Answer from './answer';
import { DataDao } from '../../models/ModelDAO';


// Create Individual answer in answer list
function createAnswer(answer) {
    return <Answer
        key={answer.aid}
        answer={answer}
    />
}


// Display List of Answers
// recieves question object as prop (FIRST)
function AnswersList({ansIds}) {
    const dao = DataDao.getInstance();

    // list of answers
    const [selectedAnswers, setAnswers] = useState();
      
    useEffect(() => {
      const getAnswers = async () => {
        try {
          const responseData = await dao.filterAnswersBasedOnAnsIds(ansIds);
          setAnswers(responseData)
        } catch (error) {
          console.error(error.message);
        }
      };
  
      getAnswers();
    }, []);

    return (
      <>
        {selectedAnswers === undefined || selectedAnswers.length === 0 ? (
          <span id='noAnswers'>No Answers</span>
        ) : (
          <div className='answer-list'>
            {selectedAnswers.map( (answer) => createAnswer(answer))}
          </div>
        )}
      </>
    );
}

export default AnswersList;