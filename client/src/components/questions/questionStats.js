import React, { useContext } from 'react';
import SortButtonsGroup from './sortButtonsGroup';
import { QuestionPageContext } from './questionsPage';

// Show Question stats and sort buttons 
function QuestionStats() {
    const { questionCount } = useContext(QuestionPageContext);
    return (
        <div id='questionStats'>
            <p><span id='totalQuestions'>{questionCount}</span> questions</p>
            <SortButtonsGroup />
        </div>
    );
}

export default QuestionStats;