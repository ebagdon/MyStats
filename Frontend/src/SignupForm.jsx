import { useState } from 'react';
import axios from 'axios';

function SignupForm({ setSignedUp, setUsername }) {

    // states to control errors with the signup process
    const [usernameNotEntered, setUsernameNotEntered] = useState(false);
    const [usernameAlreadyExists, setUsernameAlreadyExists] = useState(false);
    const [passwordsNotEntered, setPasswordsNotEntered] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    // this function gets the user input from the sign up form and tries to create a new account for the user, it handles all potential errors
    function handleSubmit() {
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        const confirmPasswordInput = document.getElementById('confirmPassword').value;

        if (passwordInput == confirmPasswordInput && usernameInput != '' && passwordInput != '') {
            axios.post('http://127.0.0.1:5000/signup', { username: usernameInput, password: passwordInput, numberSet: [0] })
                .then(() => {
                    setUsername(usernameInput);
                    setSignedUp(true);
                })
                .catch(() => {
                    setUsernameAlreadyExists(true)
                });
        } else if (usernameInput == '') {
            setPasswordsNotEntered(false);
            setPasswordMatchError(false);
            setUsernameNotEntered(true);
        } else if (passwordInput == '' || confirmPasswordInput == '') {
            setUsernameNotEntered(false);
            setPasswordMatchError(false);
            setPasswordsNotEntered(true);
        } else if (passwordInput != confirmPasswordInput) {
            setUsernameNotEntered(false);
            setPasswordsNotEntered(false);
            setPasswordMatchError(true);
        }
    }

    // return the signup form for rendering
    return (
        <div id='signupForm'>
            <p id='signupErrorText'>{(usernameNotEntered && 'ERROR: No username has been entered.') || (usernameAlreadyExists && 'ERROR: The username you selected is already taken.') || (passwordsNotEntered && 'ERROR: In order to sign up you must enter your password and confirm it.') || (passwordMatchError && 'ERROR: Your passwords do not match! Try again.')}</p>
            <label htmlFor='username'>Username</label><br />
            <input type='text' id='username' /><br />
            <br />
            <label htmlFor='password'>Password</label><br />
            <input type='text' id='password' /> <br />
            <br />
            <label htmlFor='confirmPassword'>Confirm password</label><br />
            <input type='text' id='confirmPassword' /> <br />
            <br />
            <button id='submitButton' onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default SignupForm;