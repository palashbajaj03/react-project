/* Info: This file is for User Authentication by Redux */
/* Created on {3-07-19} By {Pravesh Sharma}*/
/* Modified on {8-07-19} By {Pravesh Sharma}*/


const initialState = {}
export const profileReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'USER_READ':
            return {
                ...state,
                 userDataRead: payload
             
            };
        case 'USER_DATA_SAVE':
            return {
                ...state,
                userDataSave: payload,
            };
        case 'USER_CHANGE_PASSWORD':
            return {
                ...state,
                userChangePassword: payload,
            };
        default:
            return state
    }
}