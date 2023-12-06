import React from 'react';
import './stylesheets/answers.css'
import { metadataFormatter } from '../metadataFormatter';
import HyperLinkParser from '../hyperlinkParser';

// Display Question Information
function AnswerQuestionBody(props) {
    return (
        <div id='questionBody'>
            <div className='questionText'> <HyperLinkParser text={props.question.text} /> </div>
            <div className='questionMetadata'>
                {metadataFormatter(props.question, "question")}
            </div>
            <p><span id="questionViews">{props.question.views} views</span></p>
        </div>
    )
}


export default AnswerQuestionBody;






