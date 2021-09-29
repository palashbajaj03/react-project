/* Info: This file is for User Authentication by Redux */
/* Created on {3-07-19} By {Pravesh Sharma}*/
/* Modified on {8-07-19} By {Pravesh Sharma}*/

import { userConstants } from '../constants';

let user = JSON.parse(localStorage.getItem('user'));
let access = JSON.parse(localStorage.getItem('access'))
const initialState = {
  user: user ? user : {},
  access: access ? access : {},
  loggedIn: user ? true : false
}
export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: action.payload,
        user: action.user.data,
        access: action.access
      };
    case userConstants.LOGIN_FAILURE:
      return {
        loggedIn: false,
        loggingIn: false,
        error: action.error
      };
    case userConstants.LOGOUT:
      return {
        loggedIn: false
      };
    default:
      return state
  }
}