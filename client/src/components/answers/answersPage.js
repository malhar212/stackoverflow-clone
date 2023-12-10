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
    const { params, loggedIn, user, setUser } = useLocationContext();

    const [selectedQuestion, setSelectedQuestion] = useState();
    const [selectedAnswers, setAnswers] = useState([]);
    useEffect(() => {
        if (loggedIn) {
            (async () => {
                try {
                    const responseData = await dao.getUserProfile();
                    if (responseData.length === 0) {
                        setUser(undefined);
                        return;
                    }
                    setUser(responseData);
                } catch (error) {
                    console.error(error.message);
                }
            })();
        }
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
        const showAcceptButton = user && user.username && selectedQuestion.askedBy === user.username;
        console.log(showAcceptButton)
        return (
            <MainContent>
                <AnswerHeader
                    title={selectedQuestion.title}
                    answers={selectedAnswers.length} />
                <AnswerQuestionBody
                    question={selectedQuestion} />
                <h3>Answers</h3>
                <AnswersList qid={selectedQuestion.qid} selectedAnswers={selectedAnswers} setAnswers={setAnswers} showAcceptButton={showAcceptButton} />
                {loggedIn ? <AnswerButton
                    question={selectedQuestion} /> : <></>}
            </MainContent>
        );
    }

    return (
        <NotFound />
    )
}

export default AnswersPage;