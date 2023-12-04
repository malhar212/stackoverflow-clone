// Context.js
import React, { createContext, useContext, useState } from 'react';
import QuestionsPage from './questions/questionsPage';
import AddQuestionsPage from './addQuestion/addQuestionPage';
import TagsPage from './tags/tagsPage';
import AnswersPage from './answers/answersPage';
import AddAnswerPage from './addAnswer/addAnswerPage'
import NotFound from './404';
import { SearchTextContextProvider } from './searchTextContext';
import PropTypes from 'prop-types';
import Login from "../components/pages/Login.js";
import Signup from "./signup/Signup.js"
import Home from "./welcome/Home.js";

const LocationContext = createContext();

export function LocationContextProvider({ children }) {
    // default state is set to 'questions'
    const [page, setPage] = useState('home');
    const [params, setParams] = useState({});
    

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
        if (page === "login") {
            return <Login />
        }
        if (page === "signup") {
            return <Signup />
        }
        // If user chooses to continue as guest, they go to questions page with Guest as state
        if (page === "guest") {
            // adjust state for guest user?
            return <QuestionsPage />
        }
        // home page
        if (page === "welcome" || page === "" || page === "/" || page === "home") {
            return <Home />
        }
    }

    return (
        <LocationContext.Provider value={{ page, params, setPageAndParams }}>
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