const initialState = {}

export const notificationReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'NOTIFICATION_FETCH':
      return {
        notifications_list:payload
      }
      case 'NO_NOTIFICATION':
      return {
        no_notifications:payload
      }
    default:
      return state
  }
}