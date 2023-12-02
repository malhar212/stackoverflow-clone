import React from 'react';
import { useLocationContext } from '../locationContext';

// Individual tag box component
function TagBox(props) {
    const { setPageAndParams } = useLocationContext();
    return (
        <div className="tagNode">
            <a href='' onClick={(e) => { e.preventDefault(); setPageAndParams('questions', { tag: props.name }); }}>{props.name}</a>
            <div>{props.questionCount} questions</div>
        </div>
    )
}

export default TagBox;