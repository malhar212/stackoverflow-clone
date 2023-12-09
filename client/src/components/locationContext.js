// Context.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import QuestionsPage from './questions/questionsPage';
import AddQuestionsPage from './addQuestion/addQuestionPage';
import TagsPage from './tags/tagsPage';
import AnswersPage from './answers/answersPage';
import AddAnswerPage from './addAnswer/addAnswerPage'
import ProfilePage from './welcome/profilePage.js';
import NotFound from './404';
import { SearchTextContextProvider } from './searchTextContext';
import PropTypes from 'prop-types';
import WelcomePage from "./welcome/welcomePage.js";
import { DataDao } from '../models/ModelDAO.js';
import EditAnswerPage from './answers/editAnswerPage.js';

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

    // Load state from sessionStorage when the component mounts
    useEffect(() => {
        const storedState = sessionStorage.getItem('locationContextState');
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            setPage(parsedState.page);
            setParams(parsedState.params);
            setLoggedIn(parsedState.loggedIn);
            setUser(parsedState.user);
        }
    }, []);

    // Save state to sessionStorage when it changes
    useEffect(() => {
        const stateToStore = JSON.stringify({ page, params, loggedIn, user });
        sessionStorage.setItem('locationContextState', stateToStore);
    }, [page, params, loggedIn, user]);

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
        if (page === "welcome") {
            return <WelcomePage />
        }
        if (page ==="profile") {
            return <ProfilePage />
        }
        if (page === 'editAnswer') {
            return <EditAnswerPage />
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