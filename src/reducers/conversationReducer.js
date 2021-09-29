/* Info: This file is Default listing of Conversation */
/* Created on {15-07-19} By {Pravesh Sharma}*/
/* Modified on {19-07-19} By {Pravesh Sharma}*/

const conversationReducerDefaults = {}

export const conversationReducer = (state = conversationReducerDefaults, { type, payload }) => {
  switch (type) {
    case 'DEFAULT_LISTING':
      return {
        ...state,
        convesationList:payload
      }
    case 'LOAD_MANUAL_COLLECTION_LIST':
        return {
          ...state,
          manualCollection:payload
        }
        case 'CONVERSATION_DETAIL':
          return {
            ...state,
            conversationDetail:payload
          }
        case 'LOAD_USER_HIERARCHY':
          return {
            ...state,
            hierarchy:payload
          }
        case 'COMPONENT_REMOVE':
          return {
            ...state,
            conversationDetail:undefined
          }
          case 'TOKEN_INVALID':
            return {
              ...state,
              tokenInvalid:payload
            }
    default:
      return state;
  }
}