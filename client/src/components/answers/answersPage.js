import React, { useEffect, useState } from 'react';
import AnswerHeader from "./answerHeader.js";
import AnswersList from './answersList.js';
import MainContent from '../mainContent.js';
import AnswerQuestionBody from './answerQuestionBody.js';
import { DataDao } from '../../models/ModelDAO';
import { useLocationContext } from '../locationContext';
import AnswerButton from './answerButton.js';
import './stylesheets/answers.css'
import NotFound from '../404.js';

// Display Answer page
function AnswersPage() {
    const dao = DataDao.getInstance();

    // params is the qid of the questions
    const { params } = useLocationContext();

    const [selectedQuestion, setSelectedQuestion] = useState();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const responseData = await dao.getQuestionById(params.qid);
                if (responseData.length == 0) {
                    setSelectedQuestion(undefined);
                    return;
                }
                setSelectedQuestion(responseData[0])
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchQuestion();
    }, []);

    if (selectedQuestion) {
        return (
            <MainContent>
            <AnswerHeader
                title = {selectedQuestion.title}
                answers = {selectedQuestion.ansIds.length} />
            <AnswerQuestionBody 
                question = {selectedQuestion} />
            <AnswersList ansIds={selectedQuestion.ansIds} />
            <AnswerButton
                question = {selectedQuestion} />
         </MainContent>
        );
    }

    return (
        <NotFound />
    )
}

export default AnswersPage;