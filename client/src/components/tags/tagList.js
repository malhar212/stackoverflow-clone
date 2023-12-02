import React, {useState, useEffect} from 'react';
import TagBox from './tagBox';
import { DataDao } from '../../models/ModelDAO';

// Creates individual tag box
function createTag(tag) {
    return <TagBox
        key={tag.tid}
        tid={tag.tid}
        name={tag.name}
        questionCount={tag.questionCount}
    />
}

function TagsList() {
    const [tags, setTags] = useState();
    const dao = DataDao.getInstance();
    useEffect(() => {
      const getData = async () => {
          const responseData = await dao.getTagsAndQuestionCount();
          setTags(responseData);
      };
  
      getData();
    }, []);
  
    let tagCount = 0;
    let rows = []; // Define rows outside of the if (tags) block
  
    if (tags) {
      tagCount = tags.length;
  
      for (let i = 0; i < tagCount; i += 3) {
        const row = tags.slice(i, i + 3);
        rows.push(row);
      }
    }
  
    return (
      <>
        {tags?.length === 0 ? (
          <span id='noTags'></span>
        ) : (
          <div className="tagsContainer" id="tagsContainer">
            <h2>
              <span id='tagCount'>{tagCount}</span> Tags
            </h2>
            {rows?.map((row, rowIndex) => (
              <div key={rowIndex} className="tagRow">
                {row.map(createTag)}
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
  
  export default TagsList;