/* Info This file contains action generators for dashboard components */
/* Created on {8-07-19} By {Siddhant Chopra}*/
/* Last Modified on {21-01-20} By {Siddhant Chopra}*/

import axios from 'axios';
import cookie from 'react-cookies';
import { showLoading, hideLoading, resetLoading } from 'react-redux-loading-bar';
import { ApiConst } from '../constants/ApiConstants';
import { actionConstants } from '../constants';
import {conversationAction} from './conversationAction'

let cancelToken = axios.CancelToken;
let call1, call2, call3, call4, call5, call6, call7, call8

const requestOptions = (apiURL, data, token) => (
  {
    //This function creates and return an object which is used by axios for API call
    method: 'POST',
    url: ApiConst.BASE_URL + apiURL,
    data,
    headers: {
      "token": cookie.load('user_token'),
      'Content-Type': 'application/json'
    },
    cancelToken: token
  });

const opportunityConversion = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
  // Loads last day's opportunities data
  call1 = cancelToken.source();
  axios(requestOptions(ApiConst.TOTAL_CONVERSATION, { client_id, emailid, date_from, date_to, list_plugins }, call1.token))
    .then(res => {
      if (res.data.status === true) {
        dispatch(loadConversion(res.data.data ));
      }
      if(res.data.message === actionConstants.MESSAGE){
        dispatch(conversationAction.tokenInvalid())
    }
    })
};

const mostDiscussedTopicsData = (client_id, emailid) => dispatch => {
  // Loads data for most discussed topics 
  call5 = cancelToken.source();
  axios(requestOptions(ApiConst.MOST_DISCUSSED_TOPICS, { client_id, emailid }, call5.token)).then(res => {
    if (res.data.status === actionConstants.STATUS) {
      dispatch(mostDiscussedTopicsApi(res.data))
    }
    if(res.data.message === actionConstants.MESSAGE){
      dispatch(conversationAction.tokenInvalid())
  }
  })
}

const activityStreamData = (data) => dispatch => {
  // Loads activity stream data
  dispatch(showLoading())
  if (typeof call6 != typeof undefined) {
    call6.cancel('Operation canceled due to new request.')
  }
  call6 = cancelToken.source();
  axios(requestOptions(ApiConst.ACTIVITY_STREAM, data, call6.token))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(activityStreamApi(res.data.data))
        dispatch(hideLoading())
      }
      if(res.data.message === actionConstants.MESSAGE){
        dispatch(conversationAction.tokenInvalid())
    }
    },e=>{
     // console.log(e)
    })
    .catch(_ => {
      if (axios.isCancel(_)) {
      //  console.log('Request canceled', _.message);
        return Promise.reject(_)
      }
      dispatch(hideLoading())
    })
    .finally(_ => dispatch(resetLoading()))
}

const LoadFeedback = (data) => dispatch => {
  // Loads activity stream data
  dispatch(showLoading())
  if (typeof call4 != typeof undefined) {
    call4.cancel('Operation canceled due to new request.')
  }
  call4 = cancelToken.source();
  axios(requestOptions(ApiConst.FEEDBACK_DASH, data, call4.token))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(readFeedback(res.data.data))
        dispatch(hideLoading())
      }
      if(res.data.message === actionConstants.MESSAGE){
        dispatch(conversationAction.tokenInvalid())
    }
    },e=>{
     // console.log(e)
    })
    .catch(_ => {
      if (axios.isCancel(_)) {
        console.log('Request canceled', _.message);
        return Promise.reject(_)
      }
      dispatch(hideLoading())
    })
    .finally(_ => dispatch(resetLoading()))
}

const recentlyUpdatedCollectionData = (client_id, emailid) => dispatch => {
  // Loads recently updated collection data
  call7 = cancelToken.source();
  axios(requestOptions(ApiConst.RECENTLY_UPDATED_COLLECTION, { client_id, emailid }, call7.token)).then(res => {
    if (res.data.status === actionConstants.STATUS) {
      dispatch(recentlyUpdatedCollectionApi(res.data))
    }
    if(res.data.message === actionConstants.MESSAGE){
      dispatch(conversationAction.tokenInvalid())
  }
  })
}

const conversationsData = (client_id, emailid, date_to, date_from) => dispatch => {
  // Loads graph data and buying journy data
  dispatch(showLoading())
  call8 = cancelToken.source();
  axios(requestOptions(ApiConst.CONVERSATIONS, { client_id, date_to, date_from, emailid }, call8.token))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(loadConversations(res.data.data))
        dispatch(hideLoading())
      } 
       if(res.data.message === actionConstants.MESSAGE){
          dispatch(conversationAction.tokenInvalid())
      }
    })
    .catch(_ => dispatch(hideLoading()))
    .finally(_=>dispatch(resetLoading()))
}

// const LoadTopicTrends = (client_id, emailid, date_from, date_to, id, list_plugins) => dispatch => {
//   // Loads graph data and buying journy data
//   dispatch(showLoading())
//   call9 = cancelToken.source();
//   axios(requestOptions(ApiConst.TOPICTRENDS, { client_id, emailid, date_from, date_to, id, list_plugins }, call9.token))
//     .then(res => {
//       if (res.status === 200) {
//         dispatch(readTopicTrends(res.data.data))
//         dispatch(hideLoading())
//       }
//       if (res.data.message === actionConstants.MESSAGE) {
//         dispatch(conversationAction.tokenInvalid())
//       }
//     })
//     .catch(_ => dispatch(hideLoading()))
//     .finally(_ => dispatch(resetLoading()))
// }


const cancelRequest = () => dispatch => {
  call1 && call1.cancel();
  call2 && call2.cancel();
  call3 && call3.cancel();
  call4 && call4.cancel();
  call5 && call5.cancel();
  call6 && call6.cancel();
  call7 && call7.cancel();
  call8 && call8.cancel();
  // call9 && call9.cancel();
  dispatch(resetLoading())
}


const loadConversion = (data) => ({ type: 'OPPORTUNITY_CONVERSION', payload: data })
// const loadMissedOpportunity = (data) => ({ type: 'MISSED_OPPORTUNITY', payload: data })
// const loadNegativeConversation = (data) => ({ type: 'NEGATIVE_CONVERSATION', payload: data })
// const loadRogueConversation = (data) => ({ type: 'ROUGE_CONVERSATION', payload: data })
const mostDiscussedTopicsApi = data => ({ type: 'MOST_DISCUSSED_TOPICS_DATA', payload: data })
const activityStreamApi = data => ({ type: 'ACTIVITY_STREAM_DATA', payload: data })
const readFeedback = data => ({ type: 'FEEDBACK_DASH', payload: data })
const recentlyUpdatedCollectionApi = data => ({ type: 'RECENTLY_UPDATED_COLLECTION_DATA', payload: data })
const loadConversations = data => ({ type: 'CONVERSATIONS', payload: data })
// const readTopicTrends = data => ({ type: 'TOPICTRENDS', payload: data })

const calculateValue = ({ percent, total }) => {
  // Calculates total value of conversations
  let value = Math.round((total * percent) / 100);
  return value;
}

const calculatePercent = ({ rogue, total }) => {
  // Calaculates percentage of conversations
  if (rogue === 0) {
    return 0;
  } else {
    let percent = (total / rogue);
    return percent;
  }
}

// Export all the functions
export const dashboardAction = {
  opportunityConversion,
  mostDiscussedTopicsData,
  activityStreamData,
  recentlyUpdatedCollectionData,
  conversationsData,
  // LoadTopicTrends,
  cancelRequest,
  LoadFeedback
}