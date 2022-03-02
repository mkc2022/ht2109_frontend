import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './home.js'
import HomeView from './home.js';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <HomeView/>
  </React.StrictMode>,
  document.getElementById('root')
);

