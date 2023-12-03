import React from 'react';
import { useLocationContext } from '../locationContext';

function LoginButton() {
    const { setPageAndParams } = useLocationContext();
    return (
        <a id='loginButton' href='' onClick={(e)=> { e.preventDefault(); setPageAndParams('login')}}>Login</a>
    )
}

export default LoginButton;