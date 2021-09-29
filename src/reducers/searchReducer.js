const searchListReducerDefaults = {}

export const searchReducer = (state = searchListReducerDefaults, { type, payload }) => {
  switch (type) {
    case 'SEARCH':
      return {
        ...state,
        searchList: payload,
        ...payload
      }
    case 'SEARCH_FILTER':
      return {
        ...state,
        searchFilter: {
          ...payload
        },
        ...payload
      }
    case 'REP_CHANNEL_ID':
      return {
        ...state,
        repChannelId: payload,

      }
    case 'RECENTLY_SAVED_COLLECTION':
      return {
        ...state,
        recentlySavedCollection: payload,

      }
    case 'RESET_RESULT':
      return {
        ...state,
        searchList: undefined,
        recentlySavedCollection: undefined,
        filterState: undefined,
       // repChannelId: undefined
      }
    case 'FILTER_STATE':
      return {
        ...state,
        filterState: payload
      }
    case 'SET_DATE_PICKER':
      return {
        ...state,
        dateRange: payload
      }
    default:
      return state;
  }
}
