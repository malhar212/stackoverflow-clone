import React, { useState, useEffect } from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import { DataDao } from '../../models/ModelDAO.js';

const EditQuestionPage = () => {
  const dao = DataDao.getInstance();
  const { params, setPageAndParams } = useLocationContext();
  const [questionText, setQuestionText] = useState('');

  // console.log("in edit QUESTION page with params: " + params)

  useEffect(() => {
    const fetchQuestionData = async () => {
      const questionId = params; 
      const existingQuestionDataList = await dao.getQuestionById(questionId);
      const existingQuestionData = existingQuestionDataList[0];
      // console.log(JSON.stringify(existingQuestionData, null, 4))
      // console.log("now the text property:")
      // console.log(JSON.stringify(existingQuestionData.text, null, 4))
      // Update Question Text
      setQuestionText(existingQuestionData.text.trim());
    };
    fetchQuestionData();
  }, [params]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // params is the answerID, the text from the form is answerText
    await dao.updateQuestionById(params, { text: questionText.trim() });

    // after submitting update to answer, redirects to 
    setPageAndParams('profile');
  };

  const handleDelete = async () => {
    // params is the question ID
    await dao.deleteQuestionById(params);
    // after deleting question, redirects to
    setPageAndParams('profile');
  };

  return (
    <MainContent>
      <h1>Edit Question</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          Question Text:
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <button onClick={handleDelete}>Delete Question</button>
    </MainContent>
  );
};

export default EditQuestionPage;
