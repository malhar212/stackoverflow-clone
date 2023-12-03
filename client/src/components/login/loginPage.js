import React, { useContext, useState } from 'react';
import '../../stylesheets/form.css'
import MainContent from '../mainContent.js';
import { DataDao } from '../../models/ModelDAO';
import { useLocationContext } from '../locationContext';
import { validateLinks } from '../hyperlinkParser';
import { SearchTextContext } from '../searchTextContext.js';


function LoginPage() {
    const { setPageAndParams } = useLocationContext();
    const { setSearchQuery } = useContext(SearchTextContext);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState({
        usernameError: '',
        passwordError: ''
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
            usernameError: '',
            passwordError: ''
        });

        let isValid = true;

        // Validate username
        if (formData.username.trim() === '') {
            isValid = false;
            setFormErrors((prevState) => ({
                ...prevState,
                usernameError: 'Username cannot be empty',
            }));
        }

        if (isValid) {
            // const user = {
            // };
            
            // await DataDao.getInstance().addNewQuestion(question);
            // setSearchQuery('');
            setPageAndParams('homepage');
        }

    };

    return (
        <MainContent>
            <h1>Login</h1>
            <form id='loginForm' onSubmit={handleSubmit}>
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

                {/* submit / login button */}
                <button type='submit' id='loginButton'>Login</button>
                <span className='error'>* indicates mandatory fields</span>
            </form>
        </MainContent>
    )
}

export default LoginPage;