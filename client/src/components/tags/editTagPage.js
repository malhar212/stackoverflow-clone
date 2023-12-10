import React, { useState, useEffect } from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import { DataDao } from '../../models/ModelDAO.js';

const EditTagPage = () => {
  const dao = DataDao.getInstance();
  const { params, setPageAndParams } = useLocationContext();
  const [tagName, setTagName] = useState('');

  useEffect(() => {
    const fetchTagData = async () => {
        const tagName = params;
        // const tagObject = await dao.getTagByName(tagName);
        // // console.log(JSON.stringify(tagObject, null, 4));
        // console.log("in editTagepage fetch data: " + tagName)
        setTagName(tagName);
    };
    fetchTagData();
  }, [params]);

  // submitting an edit to the tag
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await dao.updateTagByName(params, {name: tagName});
    setPageAndParams('profile');
  };

  return (
    <MainContent>
      <h1>Edit Tag</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
        Tag Name:
          <textarea
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </MainContent>
  );
};

export default EditTagPage;