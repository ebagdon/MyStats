import { useState } from 'react';

import LoginForm from './LoginForm';
import StatisticsPage from './StatisticsPage'

function App() {
    // states to control if the user has logged in and what their username is
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    // if the user hasn't logged in display the login form and if they have display the statistics page
    return loggedIn == false ? <LoginForm appSetLoggedIn={setLoggedIn} appSetUsername={setUsername} /> : <StatisticsPage loggedInUsername={username} />;
}

export default App;