import React from 'react';
import AskButton from '../header/askButton';
import { useLocationContext } from '../locationContext';

// Header for Answers Page
function AnswerHeader(props) {
    const { loggedIn } = useLocationContext();
    return (
        <header id="answersHeader">
            <div className="pageTitle"> Question: {props.title}
                <p>{props.answers} answers </p>
            </div>
            { loggedIn ? <AskButton /> : <></> }
        </header>
    )
}

export default AnswerHeader;