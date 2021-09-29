import axios from 'axios';
import cookie from 'react-cookies';
import { showLoading, hideLoading, resetLoading } from 'react-redux-loading-bar';
import { ApiConst, actionConstants } from '../constants'
import { conversationAction } from './conversationAction'
import { toast } from 'react-toastify';

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

const LoadPluginList = (client_id, emailid) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.READ_PLUGIN_DATA, { client_id, emailid }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(readPluginList(res.data.data));
                dispatch(hideLoading());
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

const LoadConversationTotal = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CONVERSATION_TOTAL, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readConversationTotal(res.data.data));
                dispatch(hideLoading());
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

const LoadConversationOpportunity = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CONVERSATION_OPPORTUNITY, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readConversationOpportunity(res.data.data));
                dispatch(hideLoading());
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

const LoadConversationPurchaseStage = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CONVERSATION_PURCHASE_STAGE, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readConversationPurchaseStage(res.data.data));
                dispatch(hideLoading());
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

const LoadConversationPricingMention = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CONVERSATION_PRICING_MENTION, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readConversationPricingMention(res.data.data));
                dispatch(hideLoading());
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

const LoadRepsTotal = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_REPS_TOTAL, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRepsTotal(res.data.data));
                dispatch(hideLoading());
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

const LoadRepsFollowUps = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_REPS_FOLLOWUPS, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRepsFollowUps(res.data.data));
                dispatch(hideLoading());
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

const LoadRepsRogue = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_REPS_ROGUE, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRepsRogue(res.data.data));
                dispatch(hideLoading());
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

const LoadRepsDeadAir = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_REPS_DEAD_AIR, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRepsDeadAir(res.data.data));
                dispatch(hideLoading());
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

const LoadCustomerTotal = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSTOMER_TOTAL, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readCustomerTotal(res.data.data));
                dispatch(hideLoading());
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

const LoadCustomerTotalNegative = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSTOMER_TOTAL_NEGATIVE, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readCustomerTotalNegative(res.data.data));
                dispatch(hideLoading());
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

const LoadCustomerTotalProblem = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSTOMER_TOTAL_PROBLEM, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readCustomerTotalProblem(res.data.data));
                dispatch(hideLoading());
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

const LoadCustomerTotalPriceSensitive = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSTOMER_TOTAL_PRICE_SENSITIVE, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readCustomerTotalPriceSensitive(res.data.data));
                dispatch(hideLoading());
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

const LoadCustomerConversations = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSTOMER_CONVERSATIONS, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readCustomerConversations(res.data.data));
                dispatch(hideLoading());
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

const LoadCustomerSentimentLevel = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSTOMER_SENTIMENT_LEVEL, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readCustomerSentimentLevel(res.data.data));
                dispatch(hideLoading());
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

const LoadCustomerFollowUps = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSTOMER_FOLLOW_UPS, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readCustomerFollowUps(res.data.data));
                dispatch(hideLoading());
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

const LoadCustomerFollowUpsGraph = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSTOMER_FOLLOW_UPS_APPOINTMENT, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readCustomerFollowUpsGraph(res.data.data));
                dispatch(hideLoading());
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

const LoadCustomerAppointment = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSTOMER_APPOINTMENT, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readCustomerAppointment(res.data.data));
                dispatch(hideLoading());
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
const LoadRepsWiseOpportunity = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_REPS_WISE_OPPORTUNITY, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRepsWiseOpportunity(res.data.data));
                dispatch(hideLoading());
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

const LoadRepsSentimentLevel = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_REPS_SENTIMENT_LEVEL, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRepsSentimentLevel(res.data.data));
                dispatch(hideLoading());
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

const LoadCustomerTone = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSTOMER_TONE, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readCustomerTone(res.data.data));
                dispatch(hideLoading());
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

const LoadRepsFollowUp = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_REPS_FOLLOW_UPS, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRepsFollowUp(res.data.data));
                dispatch(hideLoading());
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

const LoadRepsAppointment = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_REPS_APPOINTMENTS, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRepsAppointment(res.data.data));
                dispatch(hideLoading());
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
const LoadRepsFollowAppointment = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_REPS_FOLLOWUPAPPOINTMENT, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRepsFollowAppointment(res.data.data));
                dispatch(hideLoading());
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

const LoadRepsDashboardGraph = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_REPS_DASHBOARD_GRAPH, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRepsDashboardGraph(res.data.data));
                dispatch(hideLoading());
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

const LoadConversationRepWisePerformance = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CONVERSATION_REP_WISE_PERFORMANCE, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readConversationRepWisePerformance(res.data.data));
                dispatch(hideLoading());
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

const LoadConversationOpportunityStage = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CONVERSATION_OPPORTUNITY_STAGE, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readConversationOpportunityStage(res.data.data));
                dispatch(hideLoading());
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

const LoadConversationDasboardGraph = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CONVERSATION_GRAPH, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readConversationDasboardGraph(res.data.data));
                dispatch(hideLoading());
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

const LoadConversationDuration = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CONVERSATION_DURATION, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readConversationDuration(res.data.data));
                dispatch(hideLoading());
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

const LoadConversationPeakDayTime = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CONVERSATION_PEAKDAYTIME, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {

            if (res.data.status === actionConstants.STATUS) {
                dispatch(readConversationPeakDayTime(res.data.data));
                dispatch(hideLoading());
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

const LoadConversationBlocks = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CONVERSATION_BLOCKS, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(readConversationBlocks(res.data.data));
                dispatch(hideLoading());
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

const LoadCustomerBlocks = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSTOMER_BLOCKS, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(readCustomerBlocks(res.data.data));
                dispatch(hideLoading());
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

const LoadCustomerContactability = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSOMER_CONTATCTABILITY, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(readCustomerContactablity(res.data.data));
                dispatch(hideLoading());
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
const LoadCustomTopicsBlock = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CUSTOM_TOPICS, { client_id, emailid, date_from, date_to, list_plugins }))
        .then(res => {
            if (res.status === 200) {
                dispatch(readCustomTopics(res.data));
                dispatch(hideLoading());
            }
            if (res.message === actionConstants.MESSAGE) {
                dispatch(conversationAction.tokenInvalid())
            }
        })
        .catch(_ => {
            dispatch(hideLoading())
        })
        .finally(_ => dispatch(resetLoading()))
}

const LoadTopicsBlock = (client_id, emailid, date_from, date_to, id, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.INSIGHT_CONVERSATION_TOPICS, { client_id, emailid, date_from, date_to, id,list_plugins }))
        .then(res => {
            if (res.status === 200) {
                dispatch(readConversationTopics(res.data.data));
                dispatch(hideLoading());
            }
            if (res.message === actionConstants.MESSAGE) {
                dispatch(conversationAction.tokenInvalid())
            }
        })
        .catch(_ => {
            dispatch(hideLoading())
        })
        .finally(_ => dispatch(resetLoading()))
}

const LoadConversationHighlights = (client_id, emailid, date_from, date_to, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.CONVERSATIONHIGHLIGHTS, { client_id, emailid, date_from, date_to,list_plugins }))
        .then(res => {
            if (res.status === 200) {
                dispatch(readConversationHighlights(res.data.data));
                dispatch(hideLoading());
            }
            if (res.message === actionConstants.MESSAGE) {
                dispatch(conversationAction.tokenInvalid())
            }
        })
        .catch(_ => {
            dispatch(hideLoading())
        })
        .finally(_ => dispatch(resetLoading()))
}

const LoadBantConvDash = (client_id, emailid, date_from, date_to, ids, condition, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.BANT_CONV, { client_id, emailid, date_from, date_to, ids,condition,list_plugins }))
        .then(res => {
            if (res.status === 200) {
                dispatch(readBantConvDash(res.data.data));
                dispatch(hideLoading());
            }
            if (res.message === actionConstants.MESSAGE) {
                dispatch(conversationAction.tokenInvalid())
            }
        })
        .catch(_ => {
            dispatch(hideLoading())
        })
        .finally(_ => dispatch(resetLoading()))
}

const LoadConnectConvDash = (client_id, emailid, date_from, date_to, states, condition, list_plugins) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.CONNECT_CONV, { client_id, emailid, date_from, date_to, states,condition,list_plugins }))
        .then(res => {
            if (res.status === 200) {
                dispatch(readConnectConvDash(res.data.data));
                dispatch(hideLoading());
            }
            if (res.message === actionConstants.MESSAGE) {
                dispatch(conversationAction.tokenInvalid())
            }
        })
        .catch(_ => {
            dispatch(hideLoading())
        })
        .finally(_ => dispatch(resetLoading()))
}

const LoadTopicTrends = (client_id, emailid, date_from, date_to, id, list_plugins) => dispatch => {
    // Loads graph data and buying journy data
    dispatch(showLoading())
    // call9 = cancelToken.source(); , call9.token
    axios(requestOptions(ApiConst.TOPICTRENDS, { client_id, emailid, date_from, date_to, id, list_plugins }))
        .then(res => {
            if (res.status === 200) {
                dispatch(readTopicTrends(res.data.data))
                dispatch(hideLoading())
            }
            if (res.data.message === actionConstants.MESSAGE) {
                dispatch(conversationAction.tokenInvalid())
            }
        })
        .catch(_ => dispatch(hideLoading()))
        .finally(_ => dispatch(resetLoading()))
}


const readTopicTrends = data => ({ type: 'TOPICTRENDS', payload: data })
const readBantConvDash = (data) => ({ type: 'BANT_CONV', payload: data });
const readConnectConvDash = (data) => ({ type: 'CONNECT_CONV', payload: data });
const readPluginList = (data) => ({ type: 'READ_PLUGIN_DATA', payload: data });
const readConversationTotal = (data) => ({ type: 'INSIGHT_CONVERSATION_TOTAL', payload: data });
const readConversationOpportunity = (data) => ({ type: 'INSIGHT_CONVERSATION_OPPORTUNITY', payload: data });
const readConversationPurchaseStage = (data) => ({ type: 'INSIGHT_CONVERSATION_PURCHASE_STAGE', payload: data });
const readConversationPricingMention = (data) => ({ type: 'INSIGHT_CONVERSATION_PRICING_MENTION', payload: data });
const readRepsTotal = (data) => ({ type: 'INSIGHT_REPS_TOTAL', payload: data });
const readRepsFollowUps = (data) => ({ type: 'INSIGHT_REPS_FOLLOWUPS', payload: data });
const readRepsRogue = (data) => ({ type: 'INSIGHT_REPS_ROGUE', payload: data });
const readRepsDeadAir = (data) => ({ type: 'INSIGHT_REPS_DEAD_AIR', payload: data });
const readCustomerTotal = (data) => ({ type: 'INSIGHT_CUSTOMER_TOTAL', payload: data });
const readCustomerTotalNegative = (data) => ({ type: 'INSIGHT_CUSTOMER_TOTAL_NEGATIVE', payload: data });
const readCustomerTotalProblem = (data) => ({ type: 'INSIGHT_CUSTOMER_TOTAL_PROBLEM', payload: data });
const readCustomerTotalPriceSensitive = (data) => ({ type: 'INSIGHT_CUSTOMER_TOTAL_PRICE_SENSITIVE', payload: data });
const readCustomerConversations = (data) => ({ type: 'INSIGHT_CUSTOMER_CONVERSATIONS', payload: data });
const readCustomerSentimentLevel = (data) => ({ type: 'INSIGHT_CUSTOMER_SENTIMENT_LEVEL', payload: data });
const readCustomerFollowUps = (data) => ({ type: 'INSIGHT_CUSTOMER_FOLLOW_UPS', payload: data });
const readCustomerFollowUpsGraph = (data) => ({ type: 'INSIGHT_CUSTOMER_FOLLOW_UPS_APPOINTMENT', payload: data });
const readCustomerAppointment = (data) => ({ type: 'INSIGHT_CUSTOMER_APPOINTMENT', payload: data });
const readRepsWiseOpportunity = (data) => ({ type: 'INSIGHT_REPS_WISE_OPPORTUNITY', payload: data });
const readRepsSentimentLevel = (data) => ({ type: 'INSIGHT_REPS_SENTIMENT_LEVEL', payload: data });
const readCustomerTone = (data) => ({ type: 'INSIGHT_CUSTOMER_TONE', payload: data });
const readRepsFollowUp = (data) => ({ type: 'INSIGHT_REPS_FOLLOW_UPS', payload: data });
const readRepsAppointment = (data) => ({ type: 'INSIGHT_REPS_APPOINTMENTS', payload: data });
const readRepsFollowAppointment = (data) => ({ type: 'INSIGHT_REPS_FOLLOWUPAPPOINTMENT', payload: data });
const readRepsDashboardGraph = (data) => ({ type: 'INSIGHT_REPS_DASHBOARD_GRAPH', payload: data });
const readConversationRepWisePerformance = (data) => ({ type: 'INSIGHT_CONVERSATION_REP_WISE_PERFORMANCE', payload: data })
const readConversationOpportunityStage = (data) => ({ type: 'INSIGHT_CONVERSATION_OPPORTUNITY_STAGE', payload: data });
const readConversationDasboardGraph = (data) => ({ type: 'INSIGHT_CONVERSATION_GRAPH', payload: data });
const readConversationDuration = (data) => ({ type: 'INSIGHT_CONVERSATION_DURATION', payload: data });
const readConversationPeakDayTime = (data) => ({ type: 'INSIGHT_CONVERSATION_PEAKDAYTIME', payload: data });
const readConversationBlocks = (data) => ({ type: 'INSIGHT_CONVERSATION_BLOCKS', payload: data });
const readCustomerBlocks = (data) => ({ type: 'INSIGHT_CUSTOMER_BLOCKS', payload: data });
const readCustomerContactablity = (data) => ({ type: 'INSIGHT_CUSOMER_CONTATCTABILITY', payload: data });
const readCustomTopics = (data) => ({ type: 'INSIGHT_CUSTOM_TOPICS', payload: data });
const readConversationTopics = (data) => ({ type: 'INSIGHT_CONVERSATION_TOPICS', payload: data });
const readConversationHighlights = (data) => ({ type: 'CONVERSATIONHIGHLIGHTS', payload: data });

export const dashboardInsight = {
    LoadConversationTotal,
    LoadPluginList,
    LoadConversationOpportunity,
    LoadConversationPurchaseStage,
    LoadConversationPricingMention,
    LoadRepsTotal,
    LoadRepsFollowUps,
    LoadRepsRogue,
    LoadRepsDeadAir,
    LoadCustomerTotal,
    LoadCustomerTotalNegative,
    LoadCustomerTotalProblem,
    LoadCustomerTotalPriceSensitive,
    LoadCustomerConversations,
    LoadCustomerSentimentLevel,
    LoadCustomerFollowUps,
    LoadCustomerFollowUpsGraph,
    LoadCustomerAppointment,
    LoadRepsSentimentLevel,
    LoadRepsWiseOpportunity,
    LoadCustomerTone,
    LoadRepsFollowUp,
    LoadRepsAppointment,
    LoadRepsFollowAppointment,
    LoadRepsDashboardGraph,
    LoadConversationRepWisePerformance,
    LoadConversationOpportunityStage,
    LoadConversationDasboardGraph,
    LoadConversationPeakDayTime,
    LoadConversationDuration,
    LoadConversationBlocks,
    LoadCustomerBlocks,
    LoadCustomerContactability,
    LoadCustomTopicsBlock,
    LoadTopicsBlock,
    LoadConversationHighlights,
    LoadBantConvDash,
    LoadTopicTrends,
    LoadConnectConvDash
}
