import React from 'react';
import AskButton from './askButton';
import PageTitle from './pageTitle';
import './stylesheets/header.css'
import { useLocationContext } from '../locationContext';

// Header for Questions and Tags page
function Header() {
    const { loggedIn } = useLocationContext();
    return (
        <header>
            <PageTitle />
            {console.log("Header... logged in: ", loggedIn)}
            { loggedIn ? <AskButton /> : <></> }
        </header>
    )
}

export default Header;