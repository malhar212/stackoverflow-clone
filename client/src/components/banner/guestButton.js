import React from 'react';
import { useLocationContext } from '../locationContext';

function guestButton() {
    const { setPageAndParams } = useLocationContext();
    return (
        <button type='submit' id='guestButton' href='' onClick={(e)=> { e.preventDefault(); setPageAndParams('guest')}}>Continue as Guest</button>
    )
}

export default guestButton;