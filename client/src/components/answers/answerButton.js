import React from 'react';
import { useLocationContext } from '../locationContext';

// Answer a Question Button
function AnswerButton(props) {
    const { setPageAndParams } = useLocationContext();
    return (
        <a id='addAnswerBtn' href='' onClick={(e) => { e.preventDefault(); setPageAndParams('addAnswer', props) }}>Answer Question</a>
    )
}

export default AnswerButton;