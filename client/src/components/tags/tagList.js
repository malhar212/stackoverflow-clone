import React, { useState, useEffect } from 'react';
import TagBox from './tagBox';
import { DataDao } from '../../models/ModelDAO';

function createTag(tag, editDeleteOption, handleTagDelete) {
  return (
    <TagBox
      key={tag.tid}  
      tid={tag.tid}
      name={tag.name}
      questionCount={tag.questionCount}
      editDeleteOption={editDeleteOption}
      onDeleteSuccess={handleTagDelete}
    />
  );
}

function TagsList(props) {
  const [tags, setTags] = useState([]);
  const [tagCount, setTagCount] = useState(0);
  const [editDeleteOption, setEditDeleteOption] = useState();

  useEffect(() => {
    const dao = DataDao.getInstance();

    const fetchData = async () => {
      try {
        // retrieve all the tags form the dao call
        const responseData = await dao.getTagsAndQuestionCount();
        setTags(responseData);
        setTagCount(responseData.length);
        setEditDeleteOption(false)
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    // if there were not props passed in
    if (!props.selectedData) {
      fetchData();
    }
    // if there WERE props pass in 
    else {
      setTags(props.selectedData);
      setTagCount(props.selectedData.length);
      setEditDeleteOption(true)
    }
  }, [props.selectedData]);

  const handleTagDelete = () => {
    setTagCount((prevTagCount) => prevTagCount - 1);
  };

  const rows = [];
  for (let i = 0; i < tagCount; i += 3) {
    const row = tags.slice(i, i + 3);
    rows.push(row);
  }

  return (
    <>
      {tagCount === 0 ? (
        <span id='noTags'></span>
      ) : (
        <div className="tagsContainer" id="tagsContainer">
          <h2>
            <span id='tagCount'>{tagCount}</span> Tags
          </h2>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="tagRow">
              {row.map((tag) => createTag(tag, editDeleteOption, handleTagDelete))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default TagsList;