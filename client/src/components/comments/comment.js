import React from 'react';
import HyperLinkParser from '../hyperlinkParser';
import VoteComponent from '../voteComponent';
import { metadataFormatter } from '../metadataFormatter';
import { OBJECT_TYPES } from '../../models/enums';

// Individual Answer in Answer list
function Comment({comment}) {
    return (
        <div className="comment">
            <div className="commentText">
                <HyperLinkParser text={comment.text} />
            </div>
            <VoteComponent initialCount={comment.votes} parentId={comment.cid} parent={OBJECT_TYPES.COMMENT}/>
            <div className = "commentAuthor">{metadataFormatter(comment, OBJECT_TYPES.COMMENT)}</div>
        </div>
        )

}

export default Comment;