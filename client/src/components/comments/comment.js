import React from 'react';
import HyperLinkParser from '../hyperlinkParser';
import VoteComponent from '../voteComponent';
import { metadataFormatter } from '../metadataFormatter';

// Individual Answer in Answer list
function Comment({comment}) {
    return (
        <div className="comment">
            <div className="commentText">
                <HyperLinkParser text={comment.text} />
            </div>
            <VoteComponent initialCount={comment.votes} parentId={comment.cid}/>
            <div className = "commentAuthor">{metadataFormatter(comment, "comment")}</div>
        </div>
        )

}

export default Comment;