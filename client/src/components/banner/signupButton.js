import React from 'react';
import { useLocationContext } from '../locationContext';

function SignupButton() {
    const { setPageAndParams } = useLocationContext();
    return (
        <a id='SignupButton' href='' onClick={(e)=> { e.preventDefault(); setPageAndParams('signup')}}>Signup</a>
    )
}

export default SignupButton;