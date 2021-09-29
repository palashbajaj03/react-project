/* Info: This file contains actions for collection component*/
/* Created on {22-07-19} By {Pravesh Sharma}*/
/* Modified on {24-03-20} By {Siddhant Chopra}*/

import axios from 'axios';
import cookie from 'react-cookies';
import { toast } from 'react-toastify';
import { showLoading, hideLoading, resetLoading } from 'react-redux-loading-bar';
import { ApiConst, actionConstants } from '../constants'
import { conversationAction } from './conversationAction';

let source;

const requestOptions = (apiURL, data) => ({
  //This function creates and return an object which is used by axios for API call
  method: 'POST',
  url: ApiConst.BASE_URL + apiURL,
  data,
  headers: {
    "token": cookie.load('user_token'),
    'Content-Type': 'application/json'
  },
  cancelToken: source ? source.token : ''
});


const loadAllCollection = (client_id, emailid) => dispatch => {
  // This function loads all collection list
  dispatch(showLoading());
  axios(requestOptions(ApiConst.READ_ALL_COLLECTION, { client_id, emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(populateAllCollection(res.data.data));
        dispatch(hideLoading());
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
    .catch(_ => dispatch(hideLoading()))
}

const loadSelectedCollection = (client_id, emailid, id, pagination) => dispatch => {
  // This function loads individual collection
  dispatch(showLoading());
  if (typeof source != typeof undefined) {
    // Cancelling previous request if multiple requests for same API is made
    source.cancel('Operation canceled due to new request.')
  }
  source = axios.CancelToken.source();
  axios(requestOptions(ApiConst.READ_COLLECTION, { client_id, emailid, id }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(populateCollection(res.data.data));
        dispatch(hideLoading());
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
    .catch(_ => dispatch(hideLoading()))
    .finally(_ => dispatch(resetLoading()))
}

const createCollection = (collection, client_id, emailid, bookmark_status, conversation_id) => dispatch => {
  // This function creates a collection
  dispatch(showLoading());
  dispatch(creatingCollection());
  axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id, emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        cookie.save('user_token', res.data.token,
          {
            path: '/'
            // secure: true,
            // httpOnly: true
          })
        axios(requestOptions(ApiConst.CREATE_COLLECTION, { ...collection, client_id, emailid }))
          .then(res => {
            if (res.data.status === actionConstants.STATUS) {
              cookie.save('user_token', res.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })

              dispatch(createSuccess(res.data))
              dispatch(loadAllCollection(client_id, emailid))
              dispatch(createCollectionComplete());
              if (bookmark_status && res.data.data) {
                let id = [res.data.data.id]
                dispatch(conversationAction.bookMarkConversation({ client_id, emailid, id, conversation_id }))
              }
              toast.info('Collection created successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
              })
              if (collection.type === "manual") {
                dispatch(conversationAction.manualCollectionList({ client_id, emailid }))
              }
              dispatch(hideLoading());
            } else if (res.data.status === actionConstants.FAILURE) {
              cookie.save('user_token', res.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
              dispatch(hideLoading());
              dispatch(createCollectionComplete());
            }
          })
          .catch( e => {
            console.log(e.response)
            if (e.response.status === 500) {
              axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id, emailid })).then(
                res => {
                  if (res.data.status === actionConstants.STATUS) {
                    cookie.save('user_token', res.data.token,
                      {
                        path: '/'
                        // secure: true,
                        // httpOnly: true
                      })
                  }
                }
              )
            }
            // cookie.save('user_token', e.response.data.token,
            //   {
            //     path: '/'
            //     // secure: true,
            //     // httpOnly: true
            //   })
            dispatch(hideLoading());
            dispatch(createCollectionComplete());
          })
          .finally(_ => dispatch(resetLoading()))
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
}

const deleteCollection = (data) => dispatch => {
  // This function deletes a collection
  axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id: data.client_id, emailid: data.emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        cookie.save('user_token', res.data.token,
          {
            path: '/'
            // secure: true,
            // httpOnly: true
          })
        axios(requestOptions(ApiConst.DELETE_COLLECTION, data))
          .then(res => {
            if (res.data.status === actionConstants.STATUS) {
              cookie.save('user_token', res.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
              dispatch(deleteSuccess(res.data))
              dispatch(loadAllCollection(data.client_id, data.emailid))
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
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
}

const removeConversation = (data) => dispatch => {
  // This function removes a convesation from a collection
  const id = data.id
  axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id: data.client_id, emailid: data.emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        cookie.save('user_token', res.data.token,
          {
            path: '/'
            // secure: true,
            // httpOnly: true
          })
        axios(requestOptions(ApiConst.REMOVE_CONVERSATION, data))
          .then(res => {
            if (res.data.status === actionConstants.STATUS) {
              cookie.save('user_token', res.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
              dispatch(deleteSuccess(res.data))
              dispatch(loadSelectedCollection(data.client_id, data.emailid, id, { itemsCountPerPage: 10, activePage: 0 }))
              dispatch(loadAllCollection(data.client_id, data.emailid))
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
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
}

const editCollection = (data, rename) => dispatch => {
  // This function edits a collection's properties for manual collection
  axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id: data.client_id, emailid: data.emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        cookie.save('user_token', res.data.token,
          {
            path: '/'
            // secure: true,
            // httpOnly: true
          })
        axios(requestOptions(ApiConst.UPDATE_COLLECTION, data))
          .then(res => {
            if (res.data.status === actionConstants.STATUS) {
              cookie.save('user_token', res.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
              if (rename) {
                dispatch(loadSelectedCollection(data.client_id, data.emailid, data.id, { itemsCountPerPage: 10, activePage: 0 }))
              }
              dispatch(loadAllCollection(data.client_id, data.emailid))
            }
          })
          .catch(e => {
            console.log(e.response.data.token)
            cookie.save('user_token', e.response.data.token,
              {
                path: '/'
                // secure: true,
                // httpOnly: true
              })
          })
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
}

const loadStarred = (data, id) => dispatch => {
  // This function loads the list for starred conversation
  dispatch(showLoading())
  axios(requestOptions(ApiConst.STARRED_CONVERSATION, data))
    .then(res => {
      if (res.data.status == actionConstants.STATUS) {
        dispatch(populateStarred(res.data.data))
        dispatch(hideLoading())
        if (id) {
          document.getElementById("star " + id).style.pointerEvents = '';
        }
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
    .catch(_ => dispatch(hideLoading()))
    .finally(_ => dispatch(resetLoading()))
}

const updateCollection = (data) => dispatch => {
  // This function is used to update a rule_based collection
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
        axios(requestOptions(ApiConst.UPDATE_COLLECTION, data))
          .then(res => {
            if (res.data.status === actionConstants.STATUS) {
              cookie.save('user_token', res.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
              dispatch(hideLoading())
              dispatch(loadSelectedCollection(data.client_id, data.emailid, data.id, { itemsCountPerPage: 10, activePage: 0 }))
              dispatch(loadAllCollection(data.client_id, data.emailid))
              toast.info('Collection updated successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
              })
              // document.getElementById('backBtn').click()
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
          .finally(_ => resetLoading())
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
}

const postCollectionComment = (data) => dispatch => {
  dispatch(showLoading());
  axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id: data.client_id, emailid: data.emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        cookie.save('user_token', res.data.token,
          {
            path: '/'
            // secure: true,
            // httpOnly: true
          })
        axios(requestOptions(ApiConst.UPDATE_COLLECTION, data))
          .then(res => {
            if (res.data.status === actionConstants.STATUS) {
              cookie.save('user_token', res.data.token,
                {
                  path: '/'
                  // secure: true,
                  // httpOnly: true
                })
              dispatch(hideLoading())
              dispatch(loadSelectedCollection(data.client_id, data.emailid, data.id, { itemsCountPerPage: 10, activePage: 0 }))
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
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(tokenInvalid())
      }
    })
}
const UpdateCollectionStatus = (client_id, emailid, id, status) => dispatch => {
  // This function loads all collection list
  dispatch(showLoading());
  axios(requestOptions(ApiConst.UPDATE_COLLECTION, { client_id, emailid, id, status }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(sendStatusCollection(true));
        cookie.save('user_token', res.data.token, { path: '/' })
        //  dispatch(loadSelectedCollection(client_id, emailid, id, { itemsCountPerPage: 10, activePage: 0 }))
        dispatch(hideLoading());
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
    .catch(_ => dispatch(hideLoading()))
}

const addRecommendations = (client_id, emailid, conversations, id) => dispatch => {
  console.log({client_id, emailid, conversations, id })
  axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id, emailid }))
  .then(res => {
    if (res.data.status === actionConstants.STATUS) {
      cookie.save('user_token', res.data.token,
        {
          path: '/'
          // secure: true,
          // httpOnly: true
        })
      axios(requestOptions(ApiConst.COLLECTION_RECOMMENDATION, {client_id, emailid, conversations, id }))
        .then(res => {
          dispatch(showLoading());
          if (res.data.status === actionConstants.STATUS) {
            cookie.save('user_token', res.data.token,
              {
                path: '/'
                // secure: true,
                // httpOnly: true
              })
              dispatch(loadSelectedCollection(client_id, emailid, id));
              document.getElementById('recommClose').click()
              dispatch(hideLoading());
            }
            if (res.data.message === actionConstants.MESSAGE) {
              dispatch(tokenInvalid())
            }
          }) .catch( e => {
            if (e.response.status === 500) {
              axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id, emailid })).then(
                res => {
                  if (res.data.status === actionConstants.STATUS) {
                    cookie.save('user_token', res.data.token,
                      {
                        path: '/'
                        // secure: true,
                        // httpOnly: true
                      })
                  }
                }
              )
            }
          })

        }
      })

}

const sendStatusCollection = (data) => ({ type: 'UPDATE_COLLECTION_STATUS', payload: data });
const populateAllCollection = (data) => ({ type: 'LOAD_ALL_COLLECTION', payload: data });
const populateCollection = (data) => ({ type: 'LOAD_COLLECTION', payload: data });
const populateStarred = (data) => ({ type: 'LOAD_STARRED_CONVERSATION', payload: data })
const createSuccess = (data) => ({ type: 'CREATE_COLLECTION_SUCCESS', payload: data })
const deleteSuccess = (data) => ({ type: 'DELETE_COLLECTION_SUCCESS', payload: data })
const creatingCollection = () => ({ type: 'COLLECTION_CREATING', payload: true })
const createCollectionComplete = () => ({ type: 'COLLECTION_CREATE_COMPLETE', payload: false })
const tokenInvalid = () => ({ type: 'TOKEN_INVALID', payload: true })

// Export all the functions
export const collectionAction = {
  loadAllCollection,
  loadSelectedCollection,
  createCollection,
  deleteCollection,
  removeConversation,
  editCollection,
  loadStarred,
  updateCollection,
  postCollectionComment,
  UpdateCollectionStatus,
  addRecommendations
}