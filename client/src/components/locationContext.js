// Context.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import QuestionsPage from './questions/questionsPage';
import AddQuestionsPage from './addQuestion/addQuestionPage';
import TagsPage from './tags/tagsPage';
import AnswersPage from './answers/answersPage';
import AddAnswerPage from './addAnswer/addAnswerPage'
import NotFound from './404';
import { SearchTextContextProvider } from './searchTextContext';
import PropTypes from 'prop-types';
import WelcomePage from "./welcome/welcomePage.js";
import { DataDao } from '../models/ModelDAO.js';

const LocationContext = createContext();

export function LocationContextProvider({ children }) {
    // default state is set to 'questions'
    const [page, setPage] = useState('welcome');
    const [params, setParams] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState("");
    
    useEffect(() => {
        try {
            DataDao.getInstance().getCSRFToken();
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    }, []);

    const setPageAndParams = (page, params) => {
        setParams(params);
        setPage(page);
    };

    // return page components depending on page routine
    function conditionalRendering() {
        if (page === "questions") {
            return <QuestionsPage />
        }
        if (page === "addQuestion") {
            return <AddQuestionsPage />
        }
        if (page === "tags") {
            return <TagsPage />
        }
        if (page === "answers") {
            if (!Object.hasOwn(params, 'qid') || params.qid === undefined)
                return <NotFound />;
            return <AnswersPage />;
        }
        if (page === "addAnswer") {
            return <AddAnswerPage />
        }
        // if (page === "login") {
        //     return <Login />
        // }
        // if (page === "signup") {
        //     return <Signup />
        // }
        // welcome page
        if (page === "welcome") {
            return <WelcomePage />
        }
    }

    return (
        <LocationContext.Provider value={{ page, params, setParams, setPageAndParams, loggedIn, setLoggedIn, user, setUser }}>
            <SearchTextContextProvider>
                {children}
                {conditionalRendering(page)}
            </SearchTextContextProvider>
        </LocationContext.Provider>
    );
}

// setting LocationContext as the used context
export function useLocationContext() {
    return useContext(LocationContext);
}

LocationContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};