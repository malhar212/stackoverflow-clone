import React, { createContext, useState } from 'react';
import './stylesheets/questions.css';
import MainContent from '../mainContent.js';
import Header from '../header/header.js';
import QuestionStats from './questionStats';
import QuestionList from './questionList';

// Question page context
export const QuestionPageContext = createContext();

// Questions Page
function QuestionsPage() {
    const [questionCount, setQuestionCount] = useState(0);
    const [sortState, setSortState] = useState();

    return (
        <MainContent>
            <Header />
            <QuestionPageContext.Provider value={{ questionCount, setQuestionCount, sortState, setSortState }}>
                <QuestionStats />
                <QuestionList />
            </QuestionPageContext.Provider>
        </MainContent>
    )
};

export default QuestionsPage;