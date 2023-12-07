import React, { useEffect, useState } from 'react';
import { DataDao } from '../../models/ModelDAO';
import PaginationComponent from '../paginationComponent';
import Comment from './comment';
import { useLocationContext } from '../locationContext';


// Create Individual answer in answer list
function createComment(comment) {
    return <Comment
        key={comment.cid}
        comment={comment}
    />
}


// Display Comment section
// recieves question object as prop (FIRST)
function CommentsComponent({ associatedType, associatedId }) {
    const { loggedIn } = useLocationContext();
    const dao = DataDao.getInstance();
    const itemsPerPage = 3;
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    useEffect(() => {
        const getAnswers = async () => {
            try {
                const responseData = await dao.fetchComments(associatedId);
                setComments(responseData)
            } catch (error) {
                console.error(error.message);
            }
        };

        getAnswers();
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        associatedType;
        //onSubmit(comment);
        //setComment(''); // Clear the input after submission
    };

    return (
        <>
            {comments === undefined || comments.length === 0 ? (
                <></>
            ) : (
                <div className='comment-list'>
                    {/* {selectedAnswers.map( (answer) => createAnswer(answer))} */}
                    <PaginationComponent items={comments}
                        itemsPerPage={itemsPerPage}
                        renderItem={createComment} />
                </div>
            )}
            {loggedIn ? 
            <form className='comment-form' onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            : <></>}
        </>
    );
}

export default CommentsComponent;