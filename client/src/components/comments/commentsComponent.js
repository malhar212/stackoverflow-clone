import React, { useEffect, useRef, useState } from 'react';
import { DataDao } from '../../models/ModelDAO';
import PaginationComponent from '../paginationComponent';
import Comment from './comment';
import { useLocationContext } from '../locationContext';
import { validateLinks } from '../hyperlinkParser';


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
    const { loggedIn, user, params } = useLocationContext();
    const dao = DataDao.getInstance();
    const itemsPerPage = 3;
    const [comments, setComments] = useState([]);
    const [formErrors, setFormErrors] = useState({
        textError: ''
    });
    const formRef = useRef(null);
    
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

    /* // Handle form input change
    const handleChange = (e) => {
        setFormData({ text: e.target.value });
    } */

    // Handle form submit
    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            let text = e.target.value;
            // Reset error messages
            setFormErrors({
                textError: '',
                // usernameError: '',
            });

            let isValid = true;
            console.log(user);
            console.log(user.reputation);
            // Validate text
            if (user.reputation !== undefined && user.reputation < 50) {
                isValid = false;
                setFormErrors((prevState) => ({
                    ...prevState,
                    textError: 'You don\'t have enough reputation to comment',
                }));
            }

            // Validate text
            if (text.trim() === '') {
                isValid = false;
                setFormErrors((prevState) => ({
                    ...prevState,
                    textError: 'Comment text cannot be empty',
                }));
            }

            if (text.length > 140) {
                isValid = false;
                setFormErrors((prevState) => ({
                    ...prevState,
                    titleError: 'Comment cannot be more than 140 characters',
                }));
            }

            if (!validateLinks(text.trim())) {
                isValid = false;
                setFormErrors((prevState) => ({
                    ...prevState,
                    textError: 'Invalid hyperlink',
                }));
            }

            if (isValid) {
                const comment = {
                    text: text,
                    associatedObjectType: associatedType,
                    associatedObjectId: associatedId
                };

                console.log("Comment: ", comment)
                console.log(params);
                let data = await DataDao.getInstance().addComment(comment);
                console.log(data);
                setComments([...data, ...comments]);
                formRef.current.reset();
            }
        }
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
            <form className='comment-form' ref={formRef} >
                <input
                    type="text"
                    placeholder="Write a comment..."
                    /* value={formData.text}
                    onChange={handleChange} */
                    onKeyDown={handleKeyDown}
                />
                <span id='textError' className='error'>{formErrors.textError}</span>
            </form>
            : <></>}
        </>
    );
}

export default CommentsComponent;