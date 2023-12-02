import React, { useContext, useState } from 'react';
import '../../stylesheets/form.css'
import MainContent from '../mainContent.js';
import { DataDao } from '../../models/ModelDAO';
import { useLocationContext } from '../locationContext';
import { validateLinks } from '../hyperlinkParser';
import { SearchTextContext } from '../searchTextContext.js';

// Add New Questions Page
function AddQuestionsPage() {
    const { setPageAndParams } = useLocationContext();
    const { setSearchQuery } = useContext(SearchTextContext);
    const [formData, setFormData] = useState({
        title: '',
        text: '',
        tags: '',
        username: ''
    });

    const [formErrors, setFormErrors] = useState({
        titleError: '',
        textError: '',
        tagsError: '',
        usernameError: ''
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
            titleError: '',
            textError: '',
            tagsError: '',
            usernameError: '',
        });

        let isValid = true;

        // Validate title
        if (formData.title.trim() === '') {
            isValid = false;
            setFormErrors((prevState) => ({
                ...prevState,
                titleError: 'Title cannot be empty',
            }));
        } else if (formData.title.length > 100) {
            isValid = false;
            setFormErrors((prevState) => ({
                ...prevState,
                titleError: 'Title cannot be more than 100 characters',
            }));
        }

        // Validate text
        if (formData.text.trim() === '') {
            isValid = false;
            setFormErrors((prevState) => ({
                ...prevState,
                textError: 'Question text cannot be empty',
            }));
        }

        if (!validateLinks(formData.text.trim())) {
            isValid = false;
            setFormErrors((prevState) => ({
                ...prevState,
                textError: 'Invalid hyperlink',
            }));
        }

        // Validate tags
        let tagsArray = [];
        if (formData.tags !== undefined && formData.tags.length > 0) {
            tagsArray = formData.tags.trim().split(/\s+/);
            tagsArray = removeDuplicatesIgnoreCase(tagsArray);
            if (tagsArray.length > 5) {
                // console.log("Is this happening?");
                isValid = false;
                setFormErrors((prevState) => ({
                    ...prevState,
                    tagsError: 'Cannot have more than 5 tags',
                }));
            }

            for (const tag of tagsArray) {
                if (tag.length > 20) {
                    isValid = false;
                    setFormErrors((prevState) => ({
                        ...prevState,
                        tagsError: 'New tag length cannot be more than 20',
                    }));
                    break;
                }
            }
        }

        // Validate username
        if (formData.username.trim() === '') {
            isValid = false;
            setFormErrors((prevState) => ({
                ...prevState,
                usernameError: 'Username cannot be empty',
            }));
        }

        if (isValid) {
            const question = {
                title: formData.title.trim(),
                text: formData.text.trim(),
                tags: tagsArray,
                askedBy: formData.username.trim(),

            };
            
            await DataDao.getInstance().addNewQuestion(question);
            setSearchQuery('');
            setPageAndParams('questions');
        }

    };

    // Removes duplicates from input tags list
    function removeDuplicatesIgnoreCase(arr) {
        const uniqueLowercaseSet = new Set(arr.map((item) => item.toLowerCase()));
        return Array.from(uniqueLowercaseSet);
    }

    return (
        <MainContent>
            <h1>Ask a Question</h1>
            <form id='questionForm' onSubmit={handleSubmit}>
                <label htmlFor='formTitleInput'>Question Title*:</label>
                <span className='limits'>Maximum 100 characters</span>
                <input type='text' id='formTitleInput' name='title' value={formData.title} onChange={handleChange} />
                <span id='titleError' className='error'>{formErrors.titleError}</span>

                <label htmlFor='formTextInput'>Question Text*:</label>
                <textarea id='formTextInput' name='text' rows='4' value={formData.text} onChange={handleChange}></textarea>
                <span id='textError' className='error'>{formErrors.textError}</span>

                <label htmlFor='formTagInput'>Tags (up to 5, separated by spaces):</label>
                <span className='limits'>Add tags separated by whitespace</span>
                <input type='text' id='formTagInput' name='tags' value={formData.tags} onChange={handleChange} />
                <span id='tagsError' className='error'>{formErrors.tagsError}</span>

                <label htmlFor='formUsernameInput'>Your Username*:</label>
                <input type='text' id='formUsernameInput' name='username' value={formData.username} onChange={handleChange} />
                <span id='usernameError' className='error'>{formErrors.usernameError}</span>

                <button type='submit' id='postQuestionButton'>Post Question</button>
                <span className='error'>* indicates mandatory fields</span>
            </form>
        </MainContent>
    )
}

export default AddQuestionsPage;