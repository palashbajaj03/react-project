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
const requestOptionsPlugins = (apiURL, requestType, data) => ({
    //This function creates and return an object which is used by axios for API call
    method: requestType,
    url: ApiConst.BASE_URL_PLUGINS + apiURL,
    data,
    headers: {
        "token": cookie.load('user_token'),
        'Content-Type': 'application/json'
    }
});

const pluginAuth = (apiURL, data) => ({
    method: 'POST',
    url: ApiConst.BASE_URL_PLUGINS + apiURL,
    data,
    headers: {
        "token": cookie.load('user_token'),
        'Content-Type': 'application/json'
    }
})

const loadTopicList = (client_id, emailid) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.TOPICS_READ, { client_id, emailid }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(readTopics(res.data.data));
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

const createTopics = (client_id, emailid, name, value) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.CREATE_TOPIC, { client_id, emailid, name, value }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(CreateTopic());
                dispatch(hideLoading());
                dispatch(loadTopicList(client_id, emailid))
            }
            if (res.data.message === actionConstants.MESSAGE) {
                dispatch(conversationAction.tokenInvalid())
            }
            if (res.data.message) {
                toast.info(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                })
            }
        })
        .catch(_ => {
            dispatch(hideLoading())
        })
        .finally(_ => dispatch(resetLoading()))
}

const updateTopics = (client_id, emailid, name, value, id) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.UPDATE_TOPIC, { client_id, emailid, name, value, id }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(UpdateTopics());
                dispatch(hideLoading());
                dispatch(loadTopicList(client_id, emailid))
            }
            if (res.data.message === actionConstants.MESSAGE) {
                dispatch(conversationAction.tokenInvalid())
            }
            if (res.data.message) {
                toast.info(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                })
            }
        })
        .catch(_ => {
            dispatch(hideLoading())
        })
        .finally(_ => dispatch(resetLoading()))
}

const deleteTopics = (client_id, emailid, id) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.DELETE_TOPIC, { client_id, emailid, id }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(DeleteTopics());
                dispatch(loadTopicList(client_id, emailid))
                dispatch(hideLoading());
            }
            if (res.data.message === actionConstants.MESSAGE) {
                dispatch(conversationAction.tokenInvalid())
            }
            if (res.data.message) {
                toast.info(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                })
            }
        })
        .catch(_ => {
            dispatch(hideLoading())
        })
        .finally(_ => dispatch(resetLoading()))
}

const listPlugins = (client_id, emailid) => dispatch => {
    dispatch(showLoading());
    axios(requestOptionsPlugins(ApiConst.PUGINS_LIST, "POST", { client_id, emailid }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(loadPluginsList(res.data.data.plugins));
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

const integratePlugin = (data) => dispatch => {
    dispatch(showLoading());
    axios(pluginAuth(ApiConst.PLUGIN_AUTH, data))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                let source = new EventSource("https://demo-app.scoop.ai/stream");
                let openWindow = window.open(res.data.data.oauth_url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=1000,height=800")
                source.addEventListener('authorization', function (event) {
                    openWindow.close();
                    dispatch(listPlugins(data.scoop_client_id, data.emailid));
                    source.close();
                }, false);
                source.addEventListener('error', function (event) {
                }, false);
                dispatch(hideLoading())
            }
        })
        .catch(_ => {
            dispatch(hideLoading())
        })
        .finally(_ => dispatch(resetLoading()))
}

const loadReps = data => dispatch => {
    dispatch(showLoading());
    axios(requestOptionsPlugins(ApiConst.PLUGIN_REPS, "POST", data))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(loadRepsByPlugin(res.data.data))
                dispatch(hideLoading())
            }
        })
        .catch(_ => dispatch(hideLoading()))
        .finally(_ => dispatch(resetLoading()))
}

const syncPlugin = data => dispatch => {
    dispatch(showLoading());
    axios(requestOptionsPlugins(ApiConst.PLUGIN_SYNC, "POST", data))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(hideLoading());
                toast.info(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                })
            }
            if (res.data.status === actionConstants.FAILURE) {
                toast.info(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                })
            }
        })
        .catch(_ => dispatch(hideLoading()))
        .finally(_ => dispatch(resetLoading()))
}

const resetReps = _ => dispatch => {
    dispatch(resetRepsList())
}

const readAllUsers = data => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.CONFIGURE_USERS_LIST, data))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(readUsersList(res.data.data))
                dispatch(hideLoading());
            }
        })
        .catch(_ => dispatch(hideLoading()))
        .finally(_ => dispatch(resetLoading()))
}

const LoadRolesReadAll = (client_id, emailid) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.CONFIGURE_ROLES_READ_ALL, { client_id, emailid }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRolesReadAll(res.data.data));
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

const createUser = (data, emailid, client_id) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.CONFIGURE_USERS_CREATE_USER, { user: data, client_id, emailid }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(hideLoading());
                dispatch(readAllUsers({ client_id, emailid }))
                toast.info(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                })
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

const editUser = (data, emailid, client_id) => dispatch => {
    axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id, emailid }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                cookie.save('user_token', res.data.token,
                    {
                        path: '/'
                        // secure: true,
                        // httpOnly: true
                    })
                dispatch(showLoading());
                axios(requestOptions(ApiConst.CONFIGURE_USERS_UPDATE_USER, { user: data, client_id, emailid }))
                    .then(res => {
                        if (res.data.status === actionConstants.STATUS) {
                            dispatch(hideLoading());
                            dispatch(readAllUsers({ client_id, emailid }))
                            toast.info(res.data.message, {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: true,
                                closeOnClick: false,
                                pauseOnHover: false,
                            })
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
        })
        .catch(e => {
            cookie.save('user_token', e.response.data.token,
                {
                    path: '/'
                    // secure: true,
                    // httpOnly: true
                })
            dispatch(hideLoading())
        })
        .finally(_ => resetLoading())
}

const deleteUser = (data, emailid, client_id) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.CONFIGURE_USERS_DELETE_USER, { user: data, client_id, emailid }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(hideLoading());
                dispatch(readAllUsers({ client_id, emailid }))
                toast.info(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                })
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

const LoadRolesAccessObject = (client_id, emailid) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.CONFIGURE_ROLES_ACCESS_OBJECT, { client_id, emailid }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRolesAccessObject(res.data.data));
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

const LoadRolesCreate = (client_id, emailid, role) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.CONFIGURE_ROLES_CREATE, { client_id, emailid, role }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRoleCreate(res.data.data));
                dispatch(LoadRolesReadAll(client_id, emailid))
                dispatch(hideLoading());
                toast.info(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                })
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

const LoadRolesUpdate = (client_id, emailid, role) => dispatch => {
    axios(requestOptions(ApiConst.REFRESH_TOKEN, { client_id, emailid }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                cookie.save('user_token', res.data.token,
                    {
                        path: '/'
                    })
                dispatch(showLoading());
                axios(requestOptions(ApiConst.CONFIGURE_ROLES_UPDATE, { client_id, emailid, role }))
                    .then(res => {
                        if (res.data.status === actionConstants.STATUS) {
                            dispatch(hideLoading());
                            dispatch(LoadRolesReadAll(client_id, emailid))
                            toast.info(res.data.message, {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: true,
                                closeOnClick: false,
                                pauseOnHover: false,
                            })
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
        })
        .catch(e => {
            cookie.save('user_token', e.response.data.token,
                {
                    path: '/'
                    // secure: true,
                    // httpOnly: true
                })
            dispatch(hideLoading())
        })
        .finally(_ => resetLoading())
}

const LoadRolesDelete = (client_id, emailid, role_id) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.CONFIGURE_ROLES_DELETE, { client_id, emailid, role_id }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(readRoleDelete());
                dispatch(hideLoading());
                dispatch(LoadRolesReadAll(client_id, emailid))
                toast.info(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                })
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

const loadOrganizationHierarchy = (client_id, emailid) => dispatch => {
    dispatch(showLoading());
    axios(requestOptions(ApiConst.CONFIGURE_ORGANIZATION_HIERARCHY, { client_id, emailid }))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(readOrganizationHierarchy(res.data.data));
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

const deleteIntegrationChannel = (data) => dispatch => {
    // dispatch(showLoading());
    // console.log(data)
    axios(requestOptions(ApiConst.DEAUTHINTEGRATION, data))
        .then(res => {
            if (res.data.status === actionConstants.STATUS) {
                dispatch(deauthIntegrate())
                dispatch(hideLoading());
                window.location.href = "/configure/integration"
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


const deauthIntegrate = () => ({ type: 'DEAUTHINTEGRATION', payload: true })
const readRolesUpdate = () => ({ type: 'CONFIGURE_ROLES_UPDATE', payload: true })
const readRoleCreate = () => ({ type: 'CONFIGURE_ROLES_CREATE', payload: true })
const readRoleDelete = () => ({ type: 'CONFIGURE_ROLES_DELETE', payload: true })
const readRolesAccessObject = (data) => ({ type: 'CONFIGURE_ROLES_ACCESS_OBJECT', payload: data })
const readTopics = (data) => ({ type: 'READ_TOPICS', payload: data });
const CreateTopic = () => ({ type: 'CREATE_TOPIC', payload: true })
const UpdateTopics = () => ({ type: 'UPDATE_TOPIC', payload: true })
const DeleteTopics = () => ({ type: 'DELETE_TOPIC', payload: true })
const loadPluginsList = (data) => ({ type: 'LOAD_PLUGINS_LIST', payload: data })
const loadRepsByPlugin = (data) => ({ type: 'LOAD_REPS_BY_PLUGIN', payload: data })
const resetRepsList = () => ({ type: 'RESET_REPS_LIST' })
const readUsersList = (data) => ({ type: 'READ_USERS_LIST', payload: data })
const readRolesReadAll = (data) => ({ type: 'CONFIGURE_ROLES_READ_ALL', payload: data })
const readOrganizationHierarchy = (data) => ({type:'CONFIGURE_ORGANIZATION_HIERARCHY',payload:data})

export const configureAction = {
    loadTopicList,
    createTopics,
    updateTopics,
    deleteTopics,
    listPlugins,
    integratePlugin,
    loadReps,
    syncPlugin,
    resetReps,
    readAllUsers,
    LoadRolesReadAll,
    createUser,
    editUser,
    deleteUser,
    LoadRolesAccessObject,
    LoadRolesCreate,
    loadOrganizationHierarchy,
    LoadRolesUpdate,
    LoadRolesDelete,
    deleteIntegrationChannel
}
