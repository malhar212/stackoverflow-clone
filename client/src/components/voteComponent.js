import React, { useState } from 'react';
import { useLocationContext } from './locationContext';
import { OBJECT_TYPES, VOTES } from '../models/enums';
import { DataDao } from '../models/ModelDAO';
import { toast } from 'react-toastify';

const VoteComponent = ({ initialCount, parentId, parent }) => {
    const { loggedIn, user } = useLocationContext();
    const [count, setCount] = useState(initialCount);
    // // console.log(loggedIn);
    const toastOptions =  {
        toastId: 'voteError',
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        limit: 1
    };
    const checkUserCanVote = () => {
        return user.reputation >= 50;
    };

    const handleVote = async (type) => {
        // // console.log("Handling");
        if (!checkUserCanVote()) {
            // // console.log("here");
            toast.error('You need atleast 50 reputation to vote', toastOptions);
            return;
        }
        const vote = { parentId, parent, type };
        try {
            let response = await DataDao.getInstance().vote(vote);
            // console.log(response);
            if (response.error) {
                // // console.log("here too");
                toast.error('Something went wrong during voting', toastOptions);
                return;
            }
            const increment = type === 'upvote' ? 1 : -1;
            setCount(count + increment);
        } catch (error) {
            console.error(error.message);
            toast.error('Something went wrong during voting', toastOptions);
        }
    };

    const handleUpvote = () => {
        handleVote(VOTES.UPVOTE);
    };

    const handleDownvote = () => {
        handleVote(VOTES.DOWNVOTE);
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
