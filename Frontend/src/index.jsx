import { createRoot } from 'react-dom/client';

import App from './App'

// render the app
const root = createRoot(document.getElementById('app'));
root.render(<App />);