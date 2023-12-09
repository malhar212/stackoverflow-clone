import React, { useContext, useEffect, useState } from 'react';
import Question from './question'
import { DataDao } from '../../models/ModelDAO';
import { QuestionPageContext } from './questionsPage';
import { SearchTextContext } from '../searchTextContext';
import { useLocationContext } from '../locationContext';
import PaginationComponent from '../paginationComponent';

// Create Individual Question in Question List
function createQuestion(question) {
    return <Question
        key={question.qid}
        question={question}
    />
}

// Display Question List
function QuestionList() {
    const dao = DataDao.getInstance();
    const { params, setParams } = useLocationContext();
    const { setQuestionCount, sortState, setSortState } = useContext(QuestionPageContext);
    const [questions, setQuestions] = useState();
    const { searchQuery } = useContext(SearchTextContext);
    const itemsPerPage = 5;
    useEffect(() => {
        const fetchData = async () => {
            let tempQuestions;
            switch (sortState) {
                case "newest": {
                    tempQuestions = await dao.sortQuestionsByNewest();
                    break;
                }
                case "active": {
                    tempQuestions = await dao.sortQuestionsByActivity();
                    break;
                }
                case "unanswered": {
                    tempQuestions = await dao.getUnansweredQuestions();
                    break;
                }
                default:
                    tempQuestions = await dao.sortQuestionsByNewest();
            }
            setQuestions(tempQuestions);
            setQuestionCount(tempQuestions.length);
        }
        // console.log(searchQuery);
        // console.log(sortState); 
        if (searchQuery === undefined || searchQuery.trim().length == 0) {
            fetchData();
        }
        else {
            (async () => {
                let sort = sortState;
                console.log(params);
                if (params !== undefined && params.sortState !== undefined) {
                    sort = params.sortState;
                    setParams({});
                    setSortState(sort);
                }
                if (searchQuery !== undefined) {
                    console.log(sort);
                    const tempQuestions = await dao.search(searchQuery, sort);       
                    setQuestions(tempQuestions);
                    setQuestionCount(tempQuestions.length);
                }
                if (params !== undefined && params.tag !== undefined && params.tag !== '') {
                    const tempQuestions = await dao.search(`[${params.tag}]`);
                    setQuestions(tempQuestions);
                    setQuestionCount(tempQuestions.length);
                }
            })()
        }
    }, [sortState, searchQuery]);

    useEffect(() => {
        const fetchData = async () => {
            if (searchQuery !== undefined) {
                const tempQuestions = await dao.search(searchQuery);
                setQuestions(tempQuestions);
                setQuestionCount(tempQuestions.length);
            }
            if (params !== undefined && params.tag !== undefined && params.tag !== '') {
                const tempQuestions = await dao.search(`[${params.tag}]`);
                setQuestions(tempQuestions);
                setQuestionCount(tempQuestions.length);
            }
        }
        fetchData();
    }, [searchQuery]);
    
    return (
        <>
            {
                (questions === undefined || questions.length === 0) ? (<span id='noQuestions'>No Questions Found</span>) :
                    (
                        <div className="question-list">
                            {/* {questions.map(createQuestion)} */}
                            <PaginationComponent items={questions}
                            itemsPerPage={itemsPerPage}
                            renderItem={createQuestion}/>
                        </div>
                    )
            }
        </>
    )
}

export default QuestionList;