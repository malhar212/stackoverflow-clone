import React from 'react';
import { useLocationContext } from '../locationContext';

// Page Title on Questions and Tags page
function PageTitle() {
    // changing header pageTitle text depending on if questions or tags
    var pageTitle = "";
    const Location = useLocationContext();
    const { params } = useLocationContext();

    if (Location.page == "questions") {
        pageTitle = "All Questions"
    }

    if (Location.page === "tags") {
        pageTitle = "All Tags"
    }

    const userName = params.username;
    
    return (
        <div>
        <div id="pageTitle">
            <h1> {pageTitle} </h1>
        </div>
        <div>
            <p id="welcomeText"> Welcome {userName? userName : "guest"} </p>
        </div>
        </div>
    )
}

export default PageTitle;