import React, { useState, useEffect } from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import { DataDao } from '../../models/ModelDAO';
import { validateLinks } from '../hyperlinkParser.js';

const EditAnswerPage = () => {
  const dao = DataDao.getInstance();
  const { params, setPageAndParams } = useLocationContext();
  const [answerText, setAnswerText] = useState('');
  const [formErrors, setFormErrors] = useState({
    // usernameError: '',
    textError: ''
  });
  // // console.log("in edit answer page with params: " + params)

  useEffect(() => {
    const fetchAnswerData = async () => {
      const answerId = params;
      const existingAnswerDataList = await dao.filterAnswersBasedOnAnsIds([answerId]);
      const existingAnswerData = existingAnswerDataList[0];
      // // console.log(JSON.stringify(existingAnswerData, null, 4))
      // Update the answer text
      setAnswerText(existingAnswerData.text.trim());
    };
    fetchAnswerData();
  }, [params]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Reset error messages
    setFormErrors({
      textError: '',
      // usernameError: '',
    });

    let isValid = true;

    // Validate text
    if (answerText.trim() === '') {
      isValid = false;
      setFormErrors((prevState) => ({
        ...prevState,
        textError: 'Answer text cannot be empty',
      }));
    }

    if (!validateLinks(answerText.trim())) {
      isValid = false;
      setFormErrors((prevState) => ({
        ...prevState,
        textError: 'Invalid hyperlink',
      }));
    }
    
    if (isValid) {
      // params is the answerID, the text from the form is answerText
      await dao.updateAnswerById(params, { text: answerText.trim() });
      // after submitting update to answer, redirects to 
      setPageAndParams('profile');
    }
  };

  const handleDelete = async () => {
    // params is the answerID
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
        <span id='textError' className='error'>{formErrors.textError}</span>
        <button type="submit">Submit</button>
      </form>
      <button onClick={handleDelete}>Delete Answer</button>
    </MainContent>
  );
};

export default EditAnswerPage;
