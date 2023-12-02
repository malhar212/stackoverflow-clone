import React from 'react';
import { metadataFormatter } from '../metadataFormatter';
import HyperLinkParser from '../hyperlinkParser';

// Individual Answer in Answer list
function Answer({answer}) {
    return (
        <div className="answer">
            <div className="answerText">
                <HyperLinkParser text={answer.text} />
            </div>
            <div className = "answerAuthor">{metadataFormatter(answer, "answer")}</div>
        </div>
        )

}

export default Answer;