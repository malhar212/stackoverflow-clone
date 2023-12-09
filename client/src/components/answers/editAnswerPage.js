import React, { useState, useEffect } from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import { DataDao } from '../../models/ModelDAO';

const EditAnswerPage = () => {
  const dao = DataDao.getInstance();
  const { params, setPageAndParams } = useLocationContext();
  const [answerText, setAnswerText] = useState('');

  console.log("in edit answer page with params: " + params)

  useEffect(() => {
    const fetchAnswerData = async () => {
      const answerId = params; 
      const existingAnswerDataList = await dao.filterAnswersBasedOnAnsIds([answerId]);
      const existingAnswerData = existingAnswerDataList[0];
      console.log(JSON.stringify(existingAnswerData, null, 4))
      // Update the answer text
      setAnswerText(existingAnswerData.text);
    };
    fetchAnswerData();
  }, [params]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // params is the answerID, the text from the form is answerText
    await dao.updateAnswerById(params, { text: answerText });

    // after submitting update to answer, redirects to 
    setPageAndParams('profile');
  };

  const handleDelete = async () => {
    // WRITE THIS
    await dao.deleteAnswerById(params);
    // after deleting answer, redirects to
    setPageAndParams('profile');
  };

  return (
    <MainContent>
      <h1>Edit Answer</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          Answer Text:
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <button onClick={handleDelete}>Delete Answer</button>
    </MainContent>
  );
};

export default EditAnswerPage;
