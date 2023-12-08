import React from 'react';
import { metadataFormatter } from '../metadataFormatter';
import HyperLinkParser from '../hyperlinkParser';
import VoteComponent from '../voteComponent';
import CommentsComponent from '../comments/commentsComponent';
import { OBJECT_TYPES } from '../../models/enums';

// Individual Answer in Answer list
function Answer({answer}) {
    return (
        <div className="answer">
            <div className="answerText">
                <HyperLinkParser text={answer.text} />
            </div>
            <VoteComponent initialCount={answer.votes} parentId={answer.qid}/>
            {answer.accepted ? <svg aria-hidden="true" className="svg-icon iconCheckmarkLg" width="36" height="36" viewBox="0 0 36 36"><path d="m6 14 8 8L30 6v8L14 30l-8-8v-8Z"></path></svg>: <></>}
            <div className = "answerAuthor">{metadataFormatter(answer, OBJECT_TYPES.ANSWER)}</div>
            <hr></hr>
            <CommentsComponent associatedType={OBJECT_TYPES.ANSWER} associatedId={answer.aid}/>
        </div>
        )

}

export default Answer;