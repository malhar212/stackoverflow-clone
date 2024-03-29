import React from 'react';
import { metadataFormatter } from '../metadataFormatter';
import HyperLinkParser from '../hyperlinkParser';
import VoteComponent from '../voteComponent';
import CommentsComponent from '../comments/commentsComponent';
import { OBJECT_TYPES } from '../../models/enums';
import { DataDao } from '../../models/ModelDAO';

// Individual Answer in Answer list
function Answer({answer, showAcceptButton}) {
    // // console.log(showAcceptButton);
    const acceptAnswer = (aid) => {
        // params is the answerID
        return async function () {
            await DataDao.getInstance().acceptAnswer(aid);
            window.location.reload();
        }
    };

    return (
        <div className="answer">
            <div className="answerText">
                <HyperLinkParser text={answer.text} />
            </div>
            <VoteComponent initialCount={answer.votes} parentId={answer.aid} parent={OBJECT_TYPES.ANSWER}/>
            {answer.accepted ? <svg aria-hidden="true" className="svg-icon iconCheckmarkLg" width="36" height="36" viewBox="0 0 36 36"><path d="m6 14 8 8L30 6v8L14 30l-8-8v-8Z"></path></svg>: <></>}
            {showAcceptButton ? <button onClick={acceptAnswer(answer.aid)} >Accept Answer</button> : <></> }
            <div className = "answerAuthor">{metadataFormatter(answer, OBJECT_TYPES.ANSWER)}</div>
            <hr></hr>
            <CommentsComponent associatedType={OBJECT_TYPES.ANSWER} associatedId={answer.aid}/>
        </div>
        )

}

export default Answer;