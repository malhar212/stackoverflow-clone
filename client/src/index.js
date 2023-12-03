import React from 'react';
import ReactDOM from 'react-dom/client';
import './stylesheets/index.css';
import App from './App.js';
import { BrowserRouter } from 'react-router-dom';
// import '/Users/sam/Documents/VisualStudiosProjects/CS5500/Final-Project/my-fork/cs5500-final-project-malhar-sam/client/node_modules/react-toastify/dist/react-toastify.css'
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  // </React.StrictMode>
)


