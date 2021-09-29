/* Info: This is the routing file for the application */
/* Created on {3-7-19} By {Siddhant Chopra}*/
/* Modified on {19-7-19} By {Pravesh Sharma}*/


import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { routingConstants } from "./constants";
import Collection from './components/Collection/collection'
import LoginScreen from './containers/LoginScreen';
import Dashboard from './containers/Dashboard';
import Sidebar from './components/SideBar/SideBar'
import ConversationList from './components/Conversation-List/ConversationList';
import SearchContainer from './containers/searchContainer'
import Profile from './components/Profile/Profile';
import ConversationDetail from './components/Conversation-Detail/ConversationDetail'
import ConfigureContainer from './containers/ConfigureContainer'
import DashboardContainer from './containers/DashboardInsightContainer';
import VerifyUser from './components/login/verifyUser'
import IntegrationDetail from './components/Configure/integrationDetail'
import EditRuleBased from './components/Collection/EditRuleBased';


const AppRouter = (props) => {
  return (
    <BrowserRouter>
      <React.Fragment>
        <Sidebar />
        <Switch>
          <Route path={routingConstants.VERIFY_USER} component={VerifyUser} />
          <Route exact path={routingConstants.ROOT} component={LoginScreen} />
          <Route path={routingConstants.DASHBOARD} component={Dashboard} />
          {/*props.page_list_conversations&&<Route path={routingConstants.CONVERSATION_LIST} component={ConversationList} />*/}
          <Route path={routingConstants.EDITRULEBASED+ "/:collection"} component={EditRuleBased} />
          {(props.access && props.access.page_collections) && <Route path={routingConstants.COLLECTION + "/:collection"} component={Collection} />}
          {(props.access && props.access.page_search) && <Route path={routingConstants.SEARCH} component={SearchContainer} />}
          <Route path={routingConstants.PROFILE} component={Profile} />
          {(props.access && props.access.page_conversations_detail) && <Route path={`${routingConstants.CONVERSATION_DETAIL}/:id`} component={ConversationDetail} />}
          {(props.access && (props.access.page_roles || props.access.page_scripts || props.access.page_topics || props.access.page_user_hierarchy || props.access.page_users || props.access.page_integration)) && <Route exact path={`${routingConstants.CONFIGURE}/:page/:integration_channel?`} component={ConfigureContainer} />}
          {/* <Route path={`${routingConstants.INTEGRATION_DETAIL}/:integration_channel/`} component={IntegrationDetail} /> */}
          <Route path={`${routingConstants.INSIGHT_DASHBOARD}/:value`} render={(props) => <DashboardContainer val={props.location.value} {...props} />} />
          <Route render={() => { return (<p>404! page not found</p>) }} />
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  );
}

const mapStateToProps = state => ({
  access: state.authentication.access
})

export default connect(mapStateToProps)(AppRouter);
