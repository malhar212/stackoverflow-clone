import React, { useState, useEffect } from 'react';
import TagBox from './tagBox';
import { DataDao } from '../../models/ModelDAO';

function createTag(tag, editDeleteOption) {
  return (
    <TagBox
      key={tag.tid}
      tid={tag.tid}
      name={tag.name}
      questionCount={tag.questionCount}
      editDeleteOption={editDeleteOption}
    />
  );
}

function TagsList(props) {
  const [tags, setTags] = useState([]);
  const [editDeleteOption, setEditDeleteOption] = useState(false);

  useEffect(() => {
    const dao = DataDao.getInstance();

    const fetchData = async () => {
      try {
        const responseData = await dao.getTagsAndQuestionCount();
        setTags(responseData);
        setEditDeleteOption(true);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchData();
  }, [props.selectedData]);

  const tagCount = tags.length;

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
              {row.map((tag) => createTag(tag, editDeleteOption))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default TagsList;
