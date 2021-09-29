/* Info: This file is Default listing of Conversation */
/* Created on {15-07-19} By {Pravesh Sharma}*/
/* Modified on {19-07-19} By {Pravesh Sharma}*/

const dashboardInsightReducerDefaults = {}

export const dashboardInsightReducer = (state = dashboardInsightReducerDefaults, { type, payload }) => {
  switch (type) {
    case 'READ_PLUGIN_DATA':
      return {
        ...state,
        pluginList: payload
      }
    case 'INSIGHT_CONVERSATION_TOTAL':
      return {
        ...state,
        conversation_total: payload
      }
    case 'INSIGHT_CONVERSATION_OPPORTUNITY':
      return {
        ...state,
        conversation_opportunity: payload
      }
    case 'INSIGHT_CONVERSATION_PURCHASE_STAGE':
      return {
        ...state,
        conversation_purchase_stage: payload
      }
    case 'INSIGHT_CONVERSATION_PRICING_MENTION':
      return {
        ...state,
        conversation_pricing_mention: payload
      }
    case 'INSIGHT_REPS_TOTAL':
      return {
        ...state,
        reps_total: payload
      }
    case 'INSIGHT_REPS_FOLLOWUPS':
      return {
        ...state,
        reps_followups: payload
      }
    case 'INSIGHT_REPS_ROGUE':
      return {
        ...state,
        reps_rogue: payload
      }
    case 'INSIGHT_REPS_DEAD_AIR':
      return {
        ...state,
        reps_dead_air: payload
      }
    case 'INSIGHT_CUSTOMER_TOTAL':
      return {
        ...state,
        customer_total: payload
      }
    case 'INSIGHT_CUSTOMER_TOTAL_NEGATIVE':
      return {
        ...state,
        customer_total_negative: payload
      }
    case 'INSIGHT_CUSTOMER_TOTAL_PROBLEM':
      return {
        ...state,
        customer_total_problem: payload
      }
    case 'INSIGHT_CUSTOMER_TOTAL_PRICE_SENSITIVE':
      return {
        ...state,
        customer_total_price_sensitive: payload
      }
    case 'INSIGHT_CUSTOMER_CONVERSATIONS':
      return {
        ...state,
        customer_conversations: payload
      }
    case 'INSIGHT_CUSTOMER_SENTIMENT_LEVEL':
      return {
        ...state,
        customer_sentiment_level: payload
      }
    case 'INSIGHT_CUSTOMER_FOLLOW_UPS':
      return {
        ...state,
        customer_followups: payload
      }
    case 'INSIGHT_CUSTOMER_FOLLOW_UPS_APPOINTMENT':
      return {
        ...state,
        customer_followups_appointment: payload
      }
    case 'INSIGHT_CUSTOMER_APPOINTMENT':
      return {
        ...state,
        customer_appointment: payload
      }
    case 'INSIGHT_REPS_SENTIMENT_LEVEL':
      return {
        ...state,
        reps_sentiment_level: payload
      }
    case 'INSIGHT_REPS_WISE_OPPORTUNITY':
      return {
        ...state,
        rep_wise_opportunity: payload
      }
    case 'INSIGHT_CUSTOMER_TONE':
      return {
        ...state,
        customer_tone: payload
      }
    case 'INSIGHT_REPS_FOLLOW_UPS':
      return {
        ...state,
        reps_follow_ups: payload
      }
    case 'INSIGHT_REPS_APPOINTMENTS':
      return {
        ...state,
        reps_appointment: payload
      }
    case 'INSIGHT_REPS_FOLLOWUPAPPOINTMENT':
      return {
        ...state,
        reps_follow_appointment: payload
      }
    case 'INSIGHT_REPS_DASHBOARD_GRAPH':
      return {
        ...state,
        reps_dashboard_graph: payload
      }
    case 'INSIGHT_CONVERSATION_REP_WISE_PERFORMANCE':
      return {
        ...state,
        conversation_rep_wise_performance: payload
      }

    case 'INSIGHT_CONVERSATION_OPPORTUNITY_STAGE':
      return {
        ...state,
        conversation_opportunity_stage: payload
      }
    case 'INSIGHT_CONVERSATION_GRAPH':
      return {
        ...state,
        conversation_dashboard_graph: payload
      }
    case 'INSIGHT_CONVERSATION_DURATION':
      return {
        ...state,
        conversation_duration: payload
      }
    case 'INSIGHT_CONVERSATION_PEAKDAYTIME':
      return {
        ...state,
        conversation_peakdaytime: payload
      }
    case 'INSIGHT_CONVERSATION_BLOCKS':
      return {
        ...state,
        conversation_blocks: payload
      }
    case 'INSIGHT_CUSTOMER_BLOCKS':
      return {
        ...state,
        customer_blocks: payload
      }
    case 'INSIGHT_CUSOMER_CONTATCTABILITY':
      return {
        ...state,
        customer_contactability: payload
      }
    case 'INSIGHT_CUSTOM_TOPICS':
      return {
        ...state,
        custom_topics: payload
      }
    case 'INSIGHT_CONVERSATION_TOPICS':
      return {
        ...state,
        conversationTopics: payload
      }
    case 'CONVERSATIONHIGHLIGHTS':
      return {
        ...state,
        conversationHighlights: payload
      }
    case 'BANT_CONV':
      return {
        ...state,
        bantConvDash: payload
      }
      case 'CONNECT_CONV':
        return {
          ...state,
          connectConvDash: payload
        }
    case 'TOPICTRENDS':
      return {
        ...state,
        topictrends: payload
      }
      case 'CONVERSATION_SUMMARY_TAGS':
      return {
        ...state,
        summaryTags: payload
      }
      case 'CONVERSATION_TREE_MAP':
        return {
          ...state,
          conversation_TreeMap: payload
        }
        case 'REPWISECONVERSATION':
          return {
            ...state,
            repWiseConversation: payload
          }
          case 'REPWISETOPICS':
          //  console.log(payload)
          return {
            ...state,
            repWiseTopics: payload
          }
    default:
      return state;
  }
}