import React from 'react';
import { useLocationContext } from '../../locationContext';

function SignupButton() {
    const { setPageAndParams } = useLocationContext();
    return (
        <button type='submit' id='signupButton' href='' onClick={(e)=> { e.preventDefault(); setPageAndParams('signup')}}>Signup</button>
    )
}

export default SignupButton;