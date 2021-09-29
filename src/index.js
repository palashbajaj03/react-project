/* Info: This file is the Entry point of application*/
/* Created on {3-07-19} By {react-cli}*/
/* Modified on {3-07-19} By {Siddhant Chopra}*/


import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import App from './App';
import * as Sentry from '@sentry/browser';
import * as serviceWorker from './serviceWorker';
import './index.css';
import './components/Conversation-List/ConversationList.css'

Sentry.init({ dsn: "https://81a5b3213fe34eb0bb818868acfdfc9a@sentry.io/1495815" });
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
