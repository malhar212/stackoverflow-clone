import React, { useState, useEffect } from 'react';
import { useLocationContext } from '../locationContext.js';
import MainContent from '../mainContent.js';
import { DataDao } from '../../models/ModelDAO.js';
import { toast } from 'react-toastify';

const EditTagPage = () => {
  const dao = DataDao.getInstance();
  const { params, setPageAndParams } = useLocationContext();
  const [tagName, setTagName] = useState('');
  const toastOptions = {
    toastId: 'voteError',
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    limit: 1
  };
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
    if (tagName.trim().length == 0) {
      toast.error('Tag Name should not be empty', toastOptions);
      return
    }
    await dao.updateTagByName(params, { name: tagName });
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