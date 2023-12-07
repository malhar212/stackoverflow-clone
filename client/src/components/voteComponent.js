import React, { useState } from 'react';
import { useLocationContext } from './locationContext';

const VoteComponent = ({ initialCount, parentId }) => {
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
                    <span role="img" aria-label="upvote">&#x2B06;</span>
                </button>
                : <></>}
            <span>{count} votes</span>
            {loggedIn ?
                <button onClick={handleDownvote}>
                    <span role="img" aria-label="downvote">&#x2B07;</span>
                </button>
                : <></>}
        </div>
    );
};

export default VoteComponent;
