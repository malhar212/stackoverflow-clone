import React from 'react';
import { useLocationContext } from '../locationContext';

function guestButton() {
    const { setPageAndParams } = useLocationContext();
    return (
        <a id='guestButton' href='' onClick={(e)=> { e.preventDefault(); setPageAndParams('guest')}}>Continue as Guest</a>
    )
}

export default guestButton;