import React from 'react';
import AskButton from './askButton';
import PageTitle from './pageTitle';
import './stylesheets/header.css'

// Header for Questions and Tags page
function Header() {
    return (
        <header>
            <PageTitle />
            <AskButton />
        </header>
    )
}

export default Header;