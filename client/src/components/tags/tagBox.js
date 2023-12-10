import React, { useState } from 'react';
import { useLocationContext } from '../locationContext';
import { DataDao } from '../../models/ModelDAO';

function TagBox(props) {
    const dao = DataDao.getInstance();
    const { setPageAndParams } = useLocationContext();
    const { editDeleteOption} = props;
    const [isDeleted, setIsDeleted] = useState(false);
  
    const handleEditClick = async () => {
      console.log(`Edit clicked for: ${props.name}`);
      //  edit tag will go here
    };
  
    const handleDeleteClick = async () => {
      console.log(`Delete clicked for: ${props.name}`);
      try {
        await dao.deleteTagByName(props.name);
        console.log("Tag deleted successfully");
        setIsDeleted(true);
      } catch (error) {
        console.error("Error deleting tag:", error);
      }
    };
  
    if (isDeleted) {
      return null;
    }
  
    return (
      <div className="tagNode">
        <a href='' onClick={(e) => { e.preventDefault(); setPageAndParams('questions', { tag: props.name }); }}>
          {props.name}
        </a>
        <div>{props.questionCount} questions</div>
        {editDeleteOption ? (
          <div>
            {editDeleteOption && (
              <button onClick={() => handleDeleteClick('delete')}>Delete</button>
            )}
            {editDeleteOption && (
              <button onClick={() => handleEditClick('edit')}>Edit</button>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
  
  export default TagBox;