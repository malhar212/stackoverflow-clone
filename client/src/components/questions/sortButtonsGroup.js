import React, { useContext } from 'react';
import { QuestionPageContext } from './questionsPage';

// Sort buttons for Questions Page
function SortButtonsGroup() {
  const { sortState, setSortState } = useContext(QuestionPageContext);
  // console.log(sortState)
  return (
    <div className='btn-group'>
      <button id='newestButton' className={sortState === 'newest' || sortState === undefined ? 'active' : ''} onClick={()=>setSortState('newest')}>Newest</button>
      <button id='activeButton' className={sortState === 'active' ? 'active' : ''} onClick={()=>setSortState('active')}>Active</button>
      <button id='unansweredButton' className={sortState === 'unanswered' ? 'active' : ''} onClick={()=>setSortState('unanswered')}>Unanswered</button>
    </div>
  );
}

export default SortButtonsGroup;