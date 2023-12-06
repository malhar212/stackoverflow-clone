import React from 'react';
import AskButton from './askButton';
import PageTitle from './pageTitle';
import './stylesheets/header.css'
import { useLocationContext } from '../locationContext';

// Header for Questions and Tags page
function Header() {
    const { isLoggedIn } = useLocationContext();
    return (
        <header>
            <PageTitle />
            { isLoggedIn ? <AskButton /> : <></> }
        </header>
    )
}

export default Header;