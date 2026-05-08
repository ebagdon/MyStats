import { useState, useEffect } from 'react';
import axios from 'axios';

import SignupForm from './SignupForm'

function LoginForm({ appSetLoggedIn, appSetUsername }) {
    // states to control various parts of the login and signup process
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginFailure, setLoginFailure] = useState(false);

    const [noAccount, setNoAccount] = useState(false);

    const [signedUp, setSignedUp] = useState(false);

    const [username, setUsername] = useState('');

    // after every render check to see if the user has logged in or signed up, and if they have update the app compenent's username and loggedIn states
    useEffect(() => {
        if (loggedIn || signedUp) {
            appSetUsername(username);
            appSetLoggedIn(true);
        }
    });

    // this function gets the input from the login form and tries to log the user in, it will display an error message if the backend api responds with an error
    function handleSubmit() {
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        axios.post('http://127.0.0.1:5000/login', { username: usernameInput, password: passwordInput })
            .then(() => {
                setUsername(usernameInput);
                setLoggedIn(true);
            })
            .catch(() => {
                setLoginFailure(true);
            });
    }

    // this function sets the noAccount state to true if the no account text is clicked
    function handleNoAccount() {
        setNoAccount(true);
    }

    // return the loginForm but if the user clicks on the no account text display the signup form
    return (noAccount == false ?
        (<div id='loginForm'>
            <p id='loginFailureText'>{loginFailure && 'ERROR: Failure logging in. Check your username and/or password.'}</p>
            <label htmlFor='username'>Username</label><br />
            <input type='text' id='username' /><br />
            <br />
            <label htmlFor='password'>Password</label><br />
            <input type='text' id='password' /> <br />
            <br />
            <button id='submitButton' onClick={handleSubmit}>Submit</button>
            <p id='signupLink' onClick={handleNoAccount}>Don't have an account? Sign up!</p>
        </div>) : <SignupForm setSignedUp={setSignedUp} setUsername={setUsername} />
    );
}

export default LoginForm;