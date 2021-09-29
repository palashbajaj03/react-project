/* Info: This file is for User login and user profile API call */
/* Created on {5-07-19} By {Pravesh Sharma}*/
/* Modified on {11-07-19} By {Pravesh Sharma}*/


import axios from 'axios';
import cookie from 'react-cookies';
import { toast } from 'react-toastify';
import { showLoading, hideLoading, resetLoading } from 'react-redux-loading-bar'
import { userConstants, ApiConst, actionConstants } from '../constants';
import { conversationAction } from './conversationAction'


const requestOption = (apiURL, data) => ({
  //This function creates and return an object which is used by axios for API call
  method: 'POST',
  url: ApiConst.BASE_URL + apiURL,
  data,
  headers: {
    "token": cookie.load('user_token', {
      path: "/"
    }),
    'Content-Type': 'application/json'
  }
});

function login(username, password) {
  // Rquest to LogIn api
  return dispatch => {
    const requestOptions = {
      method: 'POST',
      url: ApiConst.BASE_URL + ApiConst.LOGIN,
      data: {
        "emailid": username,
        "password": password
      },
      headers: {
        'Content-Type': 'application/json'
      }
    };
    dispatch(request({ username }));
    axios(requestOptions)
      .then(res => {
        if (res.data.status === actionConstants.STATUS) {
          if (res.data.data.isactive) {
            var expires = new Date();
            var IDLE_TIMEOUT = 30;
            expires.setTime(expires.getTime() + (IDLE_TIMEOUT * 60 * 1000));
            cookie.save('user_token', res.data.token,
              {
                path: '/',
                expires
                // secure: true,
                // httpOnly: true
              })
            localStorage.setItem('user', JSON.stringify(res.data.data));
            let access = res.data.access_object.reduce((obj, item) => Object.assign(obj, item), {})
            localStorage.setItem('access', JSON.stringify(access));
            dispatch(success(res.data, access))
            // history.push('/dashboard');
            // return res.data.data;
          } else {
            return dispatch(failure('User Not Active'))
          }
        } else {
          return dispatch(failure(res.data.message))
        }
      })
      .catch((e) => {
        if (e.response) {
          dispatch(failure(e.response.data.message))
        }
      });
  };
}

const readUserProfileData = (client_id, emailid) => dispatch => {
  axios(requestOption(ApiConst.UPDATE_READ, { client_id, emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(userDataApi(res.data.data))
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
}
const userDataApi = (data) => ({ type: 'USER_READ', payload: data });



const submitUserData = (client_id, emailid, firstname, lastname, mobile) => dispatch => {
  axios(requestOption(ApiConst.REFRESH_TOKEN, { client_id, emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        cookie.save('user_token', res.data.token,
          {
            path: '/'
            // secure: true,
            // httpOnly: true
          })
        axios(requestOption(ApiConst.UPDATE_PROFILE, { client_id, emailid, firstname, lastname, mobile }))
          .then(res => {
            if (res.data.status === actionConstants.STATUS) {
              localStorage.setItem('user', JSON.stringify({ client_id, emailid, firstname, lastname, mobile }));
              cookie.save('user_token', res.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
              dispatch(success({ client_id, emailid, firstname, lastname, mobile }))
              toast.info('Profile updated successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
              })
            } else {
              toast.info('Failed to updated profile', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
              })
            }

          })
          .catch(e => {
            cookie.save('user_token', e.response.data.token,
              {
                path: '/'
                // secure: true,
                // httpOnly: true
              })
          })
      }

    })
}
const userSaveDataApi = (data) => ({ type: 'USER_DATA_SAVE', payload: data });



const userPasswordChange = (emailid, old_password, new_password, client_id) => dispatch => {
  axios(requestOption(ApiConst.REFRESH_TOKEN, { client_id, emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        cookie.save('user_token', res.data.token,
          {
            path: '/'
            // secure: true,
            // httpOnly: true
          })
        axios(requestOption(ApiConst.CHANGE_PASSWORD, { emailid, old_password, new_password }))
          .then(res => {
            if (res.data.status === actionConstants.STATUS) {
              cookie.save('user_token', res.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
              dispatch(userChangePassword(res.data.data))
              toast.info(res.data.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
              })
            } else if (res.data.status = actionConstants.FAILURE) {
              toast.info(res.data.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
              });
              cookie.save('user_token', res.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
            }
          })
          .catch(e => {
            if (e.response.data) {
              cookie.save('user_token', e.response.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
            }
          })
      }
    })
}
const userChangePassword = (data) => ({ type: 'USER_CHANGE_PASSWORD', payload: data });



function logout(emailid, client_id) {
  return (dispatch) => {
    dispatch(showLoading())
    axios(requestOption(ApiConst.LOGOUT, { client_id, emailid }))
      .then(res => {
        if (res.data.status === actionConstants.STATUS) {
          cookie.remove('user_token', { path: '/' });
          localStorage.removeItem('user');
          localStorage.removeItem('access')
          localStorage.removeItem('cta');
          localStorage.removeItem('record')
          dispatch({ type: userConstants.LOGOUT })
          dispatch(hideLoading())
        }
      })
      .catch(_ => dispatch(hideLoading()))
      .finally(_ => dispatch(resetLoading()))
  }
}


function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
function success(user, access) { return { type: userConstants.LOGIN_SUCCESS, user, access } }
function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }

export const userActions = {
  userPasswordChange,
  readUserProfileData,
  login,
  logout,
  submitUserData,
}
