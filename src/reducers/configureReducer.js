const topicsReducerDefaults = {};

export const configureReducer = (state = topicsReducerDefaults, { type, payload }) => {
  switch (type) {
    case 'READ_TOPICS':
      return {
        ...state,
        readTopics: payload
      }
    case 'LOAD_PLUGINS_LIST':
      return {
        ...state,
        pluginsList: payload
      }
    case 'LOAD_REPS_BY_PLUGIN':
      return {
        ...state,
        reps: payload
      }
    case 'RESET_REPS_LIST':
      return {
        ...state,
        reps: undefined
      }
    case 'READ_USERS_LIST':
      return {
        ...state,
        users_list: payload
      }
    case 'CONFIGURE_ROLES_READ_ALL':
      return {
        ...state,
        configure_Roles_Read_All: payload
      }
    case 'CONFIGURE_ROLES_ACCESS_OBJECT':
      return {
        ...state,
        configure_Roles_object: payload
      }
    case 'CONFIGURE_ORGANIZATION_HIERARCHY':
      return {
        ...state,
        organization_hierarchy: payload
      }
      case 'DEAUTHINTEGRATION':
      return {
        ...state,
        deauth: payload
      }
    default:
      return state;
  }
}