import React, { useEffect} from 'react';
import Answer from './answer';
import { DataDao } from '../../models/ModelDAO';
import PaginationComponent from '../paginationComponent';

// Create Individual answer in answer list
function createAnswer(answer, accepted) {
    return <Answer
        key={answer.aid}
        answer={answer}
        accepted={accepted}
    />
}

// Display List of Answers
// recieves question object as prop (FIRST)
function AnswersList({qid, selectedAnswers, setAnswers}) {
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

    return (
      <>
        {selectedAnswers === undefined || selectedAnswers.length === 0 ? (
          <span id='noAnswers'>No Answers</span>
        ) : (
          <div className='answer-list'>
            {/* {selectedAnswers.map( (answer) => createAnswer(answer))} */}
            <PaginationComponent items={selectedAnswers}
                            itemsPerPage={itemsPerPage}
                            renderItem={createAnswer}/>
          </div>
        )}
      </>
    );
}

export default AnswersList;