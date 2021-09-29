/* Info: This file is for Dashboard Component Data by Redux */
/* Created on {5-07-19} By {Siddhant Chopra}*/
/* Modified on {11-07-19} By {Pravesh Sharma}*/

const defaultState = {}

export const dashboardReducer = (
  state = defaultState, {
    type,
    payload
  }) => {
  switch (type) {
    case 'OPPORTUNITY_CONVERSION':
      return {
        ...state,
        opportunityConversion: payload
      }

    case 'MOST_DISCUSSED_TOPICS_DATA':
      return {
        ...state,
        mdt: payload,
      }
    case 'ACTIVITY_STREAM_DATA':
      return {
        ...state,
        as: payload
      }
      case 'FEEDBACK_DASH':
        return {
          ...state,
          readFeedBack: payload
        }
    case 'RECENTLY_UPDATED_COLLECTION_DATA':
      return {
        ...state,
        ruc: payload
      }
      
    case 'CONVERSATIONS':
        return {
          ...state,
          graph_data:payload.graph_data,
          total_conversation:payload.total_conversation,
          buying_journey:payload.buying_journey,
          graph_data_month:payload.graph_data_month,
          graph_data_week:payload.graph_data_week,
          cta:payload.cta
        }
    default:
      return state;
  }
}

