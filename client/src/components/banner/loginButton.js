import React from 'react';
import { useLocationContext } from '../locationContext';
import '../../stylesheets/index.css'

function LoginButton() {
    const { setPageAndParams } = useLocationContext();
    return (
        // <a id='loginButton' href='' onClick={(e)=> { e.preventDefault(); setPageAndParams('login')}}>Login</a>
        <button type='submit' id='loginButton' href='' onClick={(e)=> { e.preventDefault(); setPageAndParams('login')}}>Login</button>
    )
}

export default LoginButton;