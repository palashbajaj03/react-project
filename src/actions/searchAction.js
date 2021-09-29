import axios from 'axios';
import cookie from 'react-cookies';
import { ApiConst } from '../constants/ApiConstants';
import { actionConstants, routingConstants } from '../constants';
import { showLoading, hideLoading, resetLoading } from 'react-redux-loading-bar';
import { toast } from 'react-toastify';
import { conversationAction } from './conversationAction'
let source;

const dummyArray = {
  // "speakers": [{ "id": "both", "value": "Both" }, { "id": "reps", "value": "Reps" }, { "id": "customers", "value": "Customers" }],
  'date': [{ "id": "Anytime", "value": "Anytime" }, { "id": "Yesterday", "value": "yesterday" }, { "id": "Last 7 Days", "value": "last_7_days" }, { "id": "Last 30 Days", "value": "last_30_days" }, { "id": "Last Month", "value": "last_month" }, { "id": "This Month", "value": "this_month" }, { "id": "Custom Range", "value": "last_7_days" }],
  "speakers": [{ "id": "rep", "value": "Reps" }, { "id": "prospect", "value": "Prospect" }],
  "OpportunityOptions": [{ "id": "both", "value": "Both" }, { "id": "yes", "value": "Yes" }, { "id": "no", "value": "No" }],
  "BuyingJourneyOptions": [{ "id": "comparison", "value": "Comparison" }, { "id": "consideration", "value": "Consideration" }, { "id": "purchase", "value": "Purchase" }],
  "Interactivity_tricles": [{ "id": "high", "value": "High" }, { "id": "medium", "value": "Medium" }, { "id": "low", "value": "Low" }]
}

const requestOptions = (apiURL, data) => ({
  //This function creates and return an object which is used by axios for API call
  method: 'POST',
  url: ApiConst.BASE_URL + apiURL,
  data,
  headers: {
    "token": cookie.load('user_token'),
    'Content-Type': 'application/json'
  },
  // cancelToken: source ? source.token : ''
});

const requestOptionsForSearch = (apiURL, data) => ({
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

const searchFilter = (client_id, emailid) => dispatch => {
  dispatch(showLoading());
  axios(requestOptions(ApiConst.SEARCH_FILTER, { client_id, emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(searchFilterApi(res.data.data, dummyArray))
        dispatch(hideLoading());
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
    .catch(_ => {
      dispatch(resetLoading())
    })
  // .finally(_ => dispatch(resetLoading()))
}

const rep_by_channel_id = (channels, client_id, emailid) => dispatch => {
  axios(requestOptions(ApiConst.REP_BY_CHANNEL_ID, { channels, client_id, emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(rep_by_channle_id_Api(res.data.data))
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
}


const loadSearchList = (filter, pagination, client_id, emailid) => dispatch => {
  if (typeof source != typeof undefined) {
    source.cancel('Operation canceled due to new request.')
  }
  source = axios.CancelToken.source();
  dispatch(showLoading());
  axios(requestOptionsForSearch(ApiConst.SEARCH, { filter, pagination, client_id, emailid }))
    .then(res => {
      if (res.status == 200) {
        dispatch(searchListApi(res.data));
        dispatch(hideLoading());
        // toast.info('Search Complete', {
        //   position: "top-right",
        //   autoClose: 2000,
        //   hideProgressBar: true,
        //   closeOnClick: false,
        //   pauseOnHover: false,
        //   // draggable: true,
        // })

      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
    .catch(error => {
      if (axios.isCancel(error)) {
        dispatch(hideLoading());
      } else {
        dispatch(resetLoading());
      }
    })
    .finally(_ => (dispatch(resetLoading())))
}

const loadRecentlyUpdatedList = (client_id, emailid) => dispatch => {
  axios(requestOptions(ApiConst.RECENTLY_SAVED_COLLECTION, { client_id, emailid }))
    .then(res => {
      if (res.data.status === actionConstants.STATUS) {
        dispatch(recentlySavedCollection(res.data.data))
      }
      if (res.data.message === actionConstants.MESSAGE) {
        dispatch(conversationAction.tokenInvalid())
      }
    })
}

const resetSearch = () => dispatch => {
  if (window.location.pathname.split('/')[1] !== "conversation-detail")
    dispatch(resetResult())
}

const retainFilter = (data) => dispatch => {
  if (window.location.pathname.split('/')[1] === "conversation-detail")
    dispatch(persistFilters(data))
}

const cancelApiRequest = () => dispatch => {
  source && source.cancel()
  dispatch(resetLoading())
}

const setDatePicker = (from, to) => dispatch => {
  from && to && dispatch(setDate(from, to))
}


const searchFilterApi = (data, preData) => (
  { type: 'SEARCH_FILTER', payload: Object.assign(data, preData) }
)

const searchListApi = (data) => ({ type: 'SEARCH', payload: data });

const rep_by_channle_id_Api = (data) => ({ type: 'REP_CHANNEL_ID', payload: data });

const recentlySavedCollection = (data) => ({ type: 'RECENTLY_SAVED_COLLECTION', payload: data })

const resetResult = () => ({ type: 'RESET_RESULT' })

const persistFilters = (data) => ({ type: 'FILTER_STATE', payload: data })

const setDate = (f, t) => ({ type: 'SET_DATE_PICKER', payload: [f, t] })

export const searchAction = {
  loadSearchList,
  searchFilter,
  rep_by_channel_id,
  loadRecentlyUpdatedList,
  resetSearch,
  retainFilter,
  cancelApiRequest,
  setDatePicker
}

