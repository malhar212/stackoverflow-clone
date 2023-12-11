import React, { useState } from 'react';
import { useLocationContext } from '../locationContext';
import '../../stylesheets/form.css'
import MainContent from '../mainContent.js';
import { DataDao } from '../../models/ModelDAO';
import { validateLinks } from '../hyperlinkParser';

// Answer a Question Form
function AddAnswerPage() {
    const { params, setPageAndParams, user } = useLocationContext();

    const [formData, setFormData] = useState({
        // username: '',
        text: '',
    });

    const [formErrors, setFormErrors] = useState({
        // usernameError: '',
        textError: ''
    });

    // Handle form input change
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value })
    }

    // Handle form submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Reset error messages
        setFormErrors({
            textError: '',
            // usernameError: '',
        });

        let isValid = true;

        // Validate text
        if (formData.text.trim() === '') {
            isValid = false;
            setFormErrors((prevState) => ({
                ...prevState,
                textError: 'Answer text cannot be empty',
            }));
        }

        if (!validateLinks(formData.text.trim())) {
            isValid = false;
            setFormErrors((prevState) => ({
                ...prevState,
                textError: 'Invalid hyperlink',
            }));
        }

        if (isValid) {
            const answer = {
                text: formData.text.trim(),
                // ansBy: formData.username,
                ans_by : user.username,
                ansDate: new Date()
            };
            await DataDao.getInstance().addAnswer(answer, params.question.qid);
            setPageAndParams('answers', params.question);
        }
    };

    return (
        <MainContent>
        <div className="form">
            <h1>Create new answer</h1>
            <form id='answerForm' onSubmit={handleSubmit}>

                <label htmlFor='formTextInput'>Answer Text*:</label>
                <textarea id='answerTextInput' name='text' rows='4' value={formData.text} onChange={handleChange}></textarea>
                <span id='textError' className='error'>{formErrors.textError}</span>

                <button type='submit' id='postAnswerButton'>Post Answer</button>
                <span className='error'>* indicates mandatory fields</span>
            </form>
        </div>
        </MainContent>
    )
}

export default AddAnswerPage;