// Context.js
import React, { createContext, useContext, useState } from 'react';
import QuestionsPage from './questions/questionsPage';
import AddQuestionsPage from './addQuestion/addQuestionPage';
import TagsPage from './tags/tagsPage';
import AnswersPage from './answers/answersPage';
import AddAnswerPage from './addAnswer/addAnswerPage'
import NotFound from './404';
import { SearchTextContextProvider } from './searchTextContext';

const LocationContext = createContext();

export function LocationContextProvider({ children }) {
    const [page, setPage] = useState('questions');
    const [params, setParams] = useState({});
    

    const setPageAndParams = (page, params) => {
        setParams(params);
        setPage(page);
    };

    // return page components depending on page routine
    function conditionalRendering() {
        if (page === "questions" || page == null) {
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