import React, { useContext } from 'react';
import { QuestionPageContext } from './questionsPage';

// Sort buttons for Questions Page
function SortButtonsGroup() {
  const { setSortState } = useContext(QuestionPageContext);
  return (
    <div className='btn-group'>
      <button id='newestButton' onClick={()=>setSortState('newest')}>Newest</button>
      <button id='activeButton' onClick={()=>setSortState('active')}>Active</button>
      <button id='unansweredButton' onClick={()=>setSortState('unanswered')}>Unanswered</button>
    </div>
  );
};

export default SortButtonsGroup;