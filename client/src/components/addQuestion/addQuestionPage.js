import React, { useContext, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import '../../stylesheets/form.css'
import MainContent from '../mainContent.js';
import { DataDao } from '../../models/ModelDAO';
import { useLocationContext } from '../locationContext';
import { validateLinks } from '../hyperlinkParser';
import { SearchTextContext } from '../searchTextContext.js';

// Add New Questions Page
function AddQuestionsPage() {
    const { setPageAndParams, user } = useLocationContext();
    const { setSearchQuery } = useContext(SearchTextContext);
    const [formData, setFormData] = useState({
        title: '',
        text: '',
        tags: '',
        user: user.username,
    });

    const [formErrors, setFormErrors] = useState({
        titleError: '',
        textError: '',
        tagsError: '',
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

        const handleError = (err) =>
        toast.error(err, {
          position: "bottom-left",
        });

        // Validate reputation for adding tags
        if (user.reputation <=50) {
            // console.log(tagsArray)
            isValid = false;
            setFormErrors((prevState) => ({
            ...prevState,
            }));
            handleError('Reputation score must be above 50 to create a new tag')
        }


        if (isValid) {
            const question = {
                title: formData.title.trim(),
                text: formData.text.trim(),
                tags: tagsArray,
                askedBy: user.username,

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

        <div className="form">
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

                <button type='submit' id='postQuestionButton'>Post Question</button>
                <span className='error'>* indicates mandatory fields</span>
            </form>
            </div>
            <ToastContainer />
        </MainContent>
    )
}

export default AddQuestionsPage;