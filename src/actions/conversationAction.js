/* Info: This action file is made Conversation Default Listing API calling and manipulation */
/* Created on {15-07-19} By {Pravesh Sharma}*/
/* Last Modified on {21-1-20} By {Siddhant Chopra}*/

import axios from 'axios';
import cookie from 'react-cookies';
import { showLoading, hideLoading, resetLoading } from 'react-redux-loading-bar';

import { ApiConst } from '../constants/ApiConstants';
import { actionConstants } from '../constants';
import { collectionAction } from './collectionAction';
import { toast } from 'react-toastify'

const requestOptions = (apiURL, data) => ({
  //This function creates and return an object which is used by axios for API call
  method: 'POST',
  url: ApiConst.BASE_URL + apiURL,
  data,
  headers: {
    "token": cookie.load('user_token'),
    'Content-Type': 'application/json'
  }
});

const loadConversationList = (pagination, client_id, emailid, id) => dispatch => {
  // This function loads the list of all conversation
  dispatch(showLoading());
  axios(requestOptions(ApiConst.DEFAULT_LISTING, { pagination, client_id, emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(populateConversationList(res.data.data));
        dispatch(hideLoading());
        if (id) {
          document.getElementById("star " + id).style.pointerEvents = '';
        }
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(tokenInvalid())
      }
    })
    .catch(_ => {
      dispatch(hideLoading())
    })
    .finally(_ => dispatch(resetLoading()))
}

const starConversation = (data) => dispatch => {
  // This function is used to star any conversation
  let { client_id, emailid, id, starred, user, pagination, source } = data;
  axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id, emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        cookie.save('user_token', res.data.token,
          {
            path: '/',
            // secure: true,
            // httpOnly: true
          })
        dispatch(showLoading());
        axios(requestOptions(ApiConst.STAR_CONVERSATION, { client_id, emailid, id, starred, user }))
          .then(res => {
            if (res.data.status === actionConstants.STATUS) {
              cookie.save('user_token', res.data.token,
                {
                  path: "/",
                  // secure: true,
                  // httpOnly: true
                })
              dispatch(hideLoading())
              if (source === 'detail') {
                dispatch(loadConversationDetail(id, client_id, emailid))
              } else {
                dispatch(collectionAction.loadStarred({ client_id: data.client_id, emailid: data.emailid }, id))
              }
              // dispatch(loadConversationList(pagination,client_id,emailid))
            }
            if (res.data.message === actionConstants.MESSAGE) {
              dispatch(tokenInvalid())
            }
          })
          .catch(e => {
            cookie.save('user_token', e.response.data.token,
              {
                path: '/'
                // secure: true,
                // httpOnly: true
              })
            dispatch(hideLoading());
          })
          .finally(_ => dispatch(resetLoading()))
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(tokenInvalid())
      }
    })
}

const starConversationListPage = (data) => dispatch => {
  let { client_id, emailid, id, starred, pagination } = data;
  axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id, emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        cookie.save('user_token', res.data.token,
          {
            path: '/',
            // secure: true,
            // httpOnly: true
          })
        dispatch(showLoading());
        axios(requestOptions(ApiConst.STAR_CONVERSATION, { client_id, emailid, id, starred }))
          .then(res => {
            if (res.data.status === actionConstants.STATUS) {
              cookie.save('user_token', res.data.token,
                {
                  path: "/",
                  // secure: true,
                  // httpOnly: true
                })
              dispatch(hideLoading())

              // dispatch(collectionAction.loadStarred({ client_id: data.client_id, emailid: data.emailid }))
              // dispatch(loadConversationDetail(id,client_id,emailid))
              dispatch(loadConversationList(pagination, client_id, emailid, id))
            }
            if (res.data.message === actionConstants.MESSAGE) {
              dispatch(tokenInvalid())
            }
          })
          .catch(e => {
            if (e.response) {
              cookie.save('user_token', e.response.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
            }
            dispatch(hideLoading());
          })
          .finally(resetLoading())
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(tokenInvalid())
      }
    })
}

const bookMarkConversation = (data) => dispatch => {
  // This function is used to bookmark any conversation (conversation can only be bookmark in a manual collection)
  const { client_id, emailid, conversation_id, id, source } = data
  axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id: data.client_id, emailid: data.emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        cookie.save('user_token', res.data.token,
          {
            path: '/'
            // secure: true,
            // httpOnly: true
          })
        dispatch(showLoading());
        axios(requestOptions(ApiConst.BOOKMARK_CONVERSATION, { client_id, emailid, conversation_id, id }))
          .then(res => {
            if (res.data.status === actionConstants.STATUS) {
              cookie.save('user_token', res.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
              toast.info('Conversation added successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
              })
              if (source) {
                dispatch(collectionAction.loadAllCollection(data.client_id, data.emailid));
              }
              dispatch(hideLoading());
            }
            if (res.data.message === actionConstants.MESSAGE) {
              dispatch(tokenInvalid())
            }
          })
          .catch(e => {
            cookie.save('user_token', e.response.data.token,
              {
                path: '/'
                // secure: true,
                // httpOnly: true
              })
            dispatch(hideLoading())
          })
          .finally(_ => dispatch(resetLoading()))
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(tokenInvalid())
      }
    })
}

const manualCollectionList = (data) => dispatch => {
  // This function loads the list of manual collections (To be used in bookmark conversation functionality)
  axios(requestOptions(ApiConst.READ_MANUAL_COLLECTION, data))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(populateCollectionList(res.data.data))
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(tokenInvalid())
      }
    })
}

const loadConversationDetail = (id, client_id, emailid) => dispatch => {
  // This function loads the detail of individual conversation
  dispatch(showLoading());
  axios(requestOptions(ApiConst.CONVERSATIONS_DETIAL, { id, client_id, emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(populateConversationDetail(res.data.data));
        document.getElementById("star " + id).style.pointerEvents = '';
        dispatch(hideLoading());
       
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(tokenInvalid())
      }
    })
    .catch(e => {
      dispatch(hideLoading())
    })
    .finally(_ => dispatch(resetLoading()))
}

const postComment = (data) => dispatch => {
  axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id: data.client_id, emailid: data.emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        cookie.save('user_token', res.data.token,
          {
            path: '/'
            // secure: true,
            // httpOnly: true
          })
        dispatch(showLoading());
        axios(requestOptions(ApiConst.CONVERSATION_UPDATE, data))
          .then(res => {
            if (res.data.status === actionConstants.STATUS) {
              
              cookie.save('user_token', res.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
              dispatch(loadConversationDetail(data.id, data.client_id, data.emailid))
              dispatch(hideLoading())
              
            }
            if (res.data.message === actionConstants.MESSAGE) {
              dispatch(tokenInvalid())
            }
          })
          .catch(e => {
            cookie.save('user_token', e.response.data.token,
              {
                path: '/'
                // secure: true,
                // httpOnly: true
              })
            dispatch(hideLoading())
          })
          .finally(_ => dispatch(resetLoading()))
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(tokenInvalid())
      }
    })
}


const loadHierarchy = (data) => dispatch => {
  // dispatch(showLoading());
  // if (typeof source != typeof undefined) {
  //   // Cancelling previous request if multiple requests for same API is made
  //   source.cancel('Operation canceled due to new request.')
  // }
  // source = axios.CancelToken.source();
  axios(requestOptions(ApiConst.HIERARCHY, data))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(loadUserHierarchy(res.data.data))
        // dispatch(hideLoading()) 
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(tokenInvalid())
      }
    })
}

const destroy = () => dispatch => {
  dispatch(destroyDetail())
}

const populateConversationDetail = (data) => ({ type: 'CONVERSATION_DETAIL', payload: data });
const populateConversationList = (data) => ({ type: 'DEFAULT_LISTING', payload: data });
const populateCollectionList = (data) => ({ type: 'LOAD_MANUAL_COLLECTION_LIST', payload: data })
const loadUserHierarchy = (data) => ({ type: 'LOAD_USER_HIERARCHY', payload: data });
const destroyDetail = () => ({ type: 'COMPONENT_REMOVE' });
const tokenInvalid = () => ({ type: 'TOKEN_INVALID', payload: true })

// Export all the functions
export const conversationAction = {
  loadConversationList,
  starConversation,
  manualCollectionList,
  bookMarkConversation,
  loadConversationDetail,
  postComment,
  loadHierarchy,
  destroy,
  starConversationListPage,
  tokenInvalid
}