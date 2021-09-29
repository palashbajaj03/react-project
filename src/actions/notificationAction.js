import axios from 'axios';
import cookie from 'react-cookies';
import { actionConstants } from '../constants';
import { ApiConst } from '../constants/ApiConstants';
import { showLoading, hideLoading, resetLoading } from 'react-redux-loading-bar';
import { conversationAction } from './conversationAction'

const requestOption = (apiURL, data) => ({
  //This function creates and return an object which is used by axios for API call
  method: 'POST',
  url: ApiConst.BASE_URL + apiURL,
  data,
  headers: {
    "token": cookie.load('user_token'),
    'Content-Type': 'application/json'
  }
});


const loadNotifications = (data) => dispatch => {
  dispatch(showLoading());
  axios(requestOption(ApiConst.NOTIFICATION_FETCH, data))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(listNotiFications(res.data.data));
        dispatch(hideLoading())
        // dispatch(NoNotification(res.data.message));
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
    .catch(_ => {
      dispatch(hideLoading())
    })
    .finally(_ => dispatch(resetLoading()))
}

const clearAll = (data) => dispatch => {
  dispatch(showLoading())
  let { client_id, emailid, rep_id } = data
  axios(requestOption(ApiConst.NOTIFICATION_CLEAR, data))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(loadNotifications({ client_id, emailid, rep_id }));
        dispatch(hideLoading())
      }
    })
    .catch(_ => {
      dispatch(hideLoading())
    })
}

const markRead = (data) => dispatch => {
  let { client_id, emailid, rep_id } = data
  axios(requestOption(ApiConst.NOTIFICATION_MARK_READ, data))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(loadNotifications({ client_id, emailid, rep_id }));
        dispatch(hideLoading())
      }
    })
}

const listNotiFications = (data) => ({ type: 'NOTIFICATION_FETCH', payload: data })
const NoNotification = (data) => ({ type: 'NO_NOTIFICATION', payload: data })

export const notificationAction = {
  loadNotifications,
  clearAll,
  markRead
}