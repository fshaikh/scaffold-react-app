import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './index.css';

if (process.env.NODE_ENV === 'development') {
    const axe = require('react-axe');
    axe(React, ReactDOM, 1000);
}

ReactDOM.render(<React.StrictMode>
    <App message='React Scaffolding'/>
</React.StrictMode>, 
document.querySelector('#app'));