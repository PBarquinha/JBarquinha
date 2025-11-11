import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import './i18n'; 
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement); // Use createRoot

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
