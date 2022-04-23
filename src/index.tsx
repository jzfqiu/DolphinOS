import React from 'react';
import ReactDOM from 'react-dom';
import System from './Components/System';
// import reportWebVitals from './reportWebVitals';
import './styles/Index.sass';

ReactDOM.render(
  <React.StrictMode>
    <System />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
