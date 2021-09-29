/* Info: This file contains reducer (state) for collection component*/
/* Created on {22-07-19} By {Pravesh Sharma}*/
/* Modified on {22-07-19} By {Pravesh Sharma}*/

const collectionReducerDefaults = {};

export const collectionReducer = (state = collectionReducerDefaults, { type, payload }) => {
  switch (type) {
    case 'LOAD_ALL_COLLECTION':
      return {
        ...state,
        allCollections: payload
      }
    case 'LOAD_COLLECTION':
      return {
        ...state,
        selectedCollection: payload
      }
    case 'CREATE_COLLECTION_SUCCESS':
      return {
        ...state,
        createSuccess: payload
      }
    case 'DELETE_COLLECTION_SUCCESS':
      return {
        ...state,
        deleteSuccess: payload
      }
    case 'LOAD_STARRED_CONVERSATION':
      return {
        ...state,
        starredConversation: payload
      }
    case 'COLLECTION_CREATING':
      return {
        ...state,
        status:payload
      }
    case 'COLLECTION_CREATE_COMPLETE':
      return {
        ...state,
        status:payload
      }
      case 'UPDATE_COLLECTION_STATUS':
        return {
          ...state,
          Collectionstatus:payload
        }
    default:
      return state;
  }
}