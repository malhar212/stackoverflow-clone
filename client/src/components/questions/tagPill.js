import React from 'react';
import { useLocationContext } from '../locationContext';

// Individual Tag in each Question
function TagPill(props) {
    const { setPageAndParams } = useLocationContext();
    return (
        <a href='' className="pill" onClick={(e)=> { e.preventDefault(); setPageAndParams('questions', {tag: props.name});}}>{props.name}</a>
    );
}

export default TagPill;