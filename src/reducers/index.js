import { combineReducers } from 'redux';

import { authentication } from './authentication-reducer';
import { dashboardReducer } from './dashboardReducer';
import { conversationReducer } from './conversationReducer'
import { loadingBarReducer } from 'react-redux-loading-bar'
import { searchReducer } from './searchReducer';
import { collectionReducer } from './collectionReducer'
import { profileReducer } from './profileReducer'
import { configureReducer } from './configureReducer'
import { dashboardInsightReducer } from './dashboardInsightReducer'
import { notificationReducer } from './notificationReducer'

const appReducer = combineReducers({
  authentication,
  dashboardReducer,
  conversationReducer,
  searchReducer,
  collectionReducer,
  loadingBar: loadingBarReducer,
  profileReducer,
  configureReducer,
  dashboardInsightReducer,
  notificationReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'USERS_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer;