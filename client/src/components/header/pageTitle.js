import React from 'react';
import { useLocationContext } from '../locationContext';

// Page Title on Questions and Tags page
function PageTitle() {
    // changing header pageTitle text depending on if questions or tags
    var pageTitle = "";
    const Location  = useLocationContext();

    if (Location.page == "questions") {
        pageTitle = "All Questions"
    }

    if (Location.page === "tags") {
        pageTitle = "All Tags"
    }
    
    return (
        <div id="pageTitle">
            <h1> {pageTitle} </h1>
        </div>
    )
}

export default PageTitle;