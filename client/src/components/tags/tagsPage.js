import React from 'react';
import './stylesheets/tags.css';
import Header from "../header/header.js";
import TagsList from "./tagList.js";
import MainContent from '../mainContent.js';

// Tags Page
function TagsPage() {
    return (
        <MainContent>
            <Header />
            <TagsList />
        </MainContent>
    );
}

export default TagsPage;