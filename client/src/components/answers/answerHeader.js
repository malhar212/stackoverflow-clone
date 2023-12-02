import React from 'react';
import AskButton from '../header/askButton';

// Header for Answers Page
function AnswerHeader(props) {
    return (
        <header id="answersHeader">
            <div className="pageTitle"> Question: {props.title}
                <p>{props.answers} answers </p>
            </div>
            <AskButton />
        </header>
    )
};

export default AnswerHeader;