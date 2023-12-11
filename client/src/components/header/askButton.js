import React from 'react';
import { useLocationContext } from '../locationContext';

// Ask Question Button
function AskButton() {
    const { setPageAndParams } = useLocationContext();
    return (
        <a id='askButton' href='' onClick={(e)=> { e.preventDefault(); setPageAndParams('addQuestion')}}>Ask a Question</a>
    )
}

export default AskButton;