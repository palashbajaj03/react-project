/* Info: This file is called Redux Store */
/* Created on {3-07-19} By {Pravesh Sharma}*/
/* Modified on {9-07-19} By {Pravesh Sharma}*/

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { loadingBarMiddleware } from 'react-redux-loading-bar'

import rootReducer from '../reducers';

const allStoreEnhancers = compose(
   applyMiddleware(thunk,loadingBarMiddleware()),
   (window.__REDUX_DEVTOOLS_EXTENSION__ && window.location.hostname==='localhost') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
);

export const store = createStore(
    rootReducer,
    allStoreEnhancers
);