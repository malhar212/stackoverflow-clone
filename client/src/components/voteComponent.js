import React, { useState } from 'react';
import { useLocationContext } from './locationContext';
import { OBJECT_TYPES } from '../models/enums';

const VoteComponent = ({ initialCount, parentId, parent }) => {
    const { loggedIn } = useLocationContext();
    const [count, setCount] = useState(initialCount);
    console.log(loggedIn);
    const handleUpvote = () => {
        setCount(count + 1); // Increase the vote count
        // Make an API call to update the vote count in the database if needed
        parentId;
    };

    const handleDownvote = () => {
        setCount(count - 1); // Decrease the vote count
        // Make an API call to update the vote count in the database if needed
    };

    return (
        <div className="vote-component">
            {loggedIn ?
                <button onClick={handleUpvote}>
                    {/* <span role="img" aria-label="upvote">&#x2B06;</span> */}
                    <svg aria-hidden="true" className="svg-icon iconArrowUp" width="18" height="18" viewBox="0 0 18 18"><path d="M1 12h16L9 4l-8 8Z"></path></svg>
                </button>
                : <></>}
            <span>{count} votes</span>
            {loggedIn && (!parent || parent !== OBJECT_TYPES.COMMENT) ?
                <button onClick={handleDownvote}>
                    {/* <span role="img" aria-label="downvote">&#x2B07;</span> */}
                    <svg aria-hidden="true" className="svg-icon iconArrowDown" width="18" height="18" viewBox="0 0 18 18"><path d="M1 6h16l-8 8-8-8Z"></path></svg>
                </button>
                : <></>}
        </div>
    );
};

export default VoteComponent;
