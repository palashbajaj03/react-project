/* Info: This file is for Dashboard which contains all the components in it */
/* Created on {3-07-19} By {Siddhant Chopra}*/
/* Modified on {11-07-19} By {Siddhant Chopra}*/

import React from "react";
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import { Redirect, withRouter } from 'react-router-dom';
import moment from 'moment'
import { userActions, dashboardAction, dashboardInsight } from '../actions';
import Header from '../components/Header/Header';
import LastDayMetrics from '../components/Last-Day-Metric/LastDayMetric';
import ConversationGraph from '../components/Conversation-Graph/ConversationGraph';
// import MostDiscussedTopics from '../components/Most-Discussed-Topics/MostDiscussedTopics';
import ActivityStream from '../components/Activity-Stream/ActivityStream';
// import RecentlyUpdatedCollection from '../components/Recently-Updated-Collection/RecentlyUpdatedCollection';
import { notificationAction, configureAction } from '../actions'
import TopicTrends from '../components/TopicTrends/topicTrends'
import FeedbackDash from "../components/Activity-Stream/FeedbackDash";
import {timezoneDateCalculator, timezoneDatePrint} from '../constants'
// import TopTraitGraph from '../components/Top-Trait-Graph/TopTraitGraph'
// import TopPerformers from '../components/Top-Performers/TopPerformers'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.state = {

    }
  }
  componentDidMount() {
    const { client_id, emailid, rep_id } = this.props.user
    this.props.loadNotifications({ client_id, emailid, rep_id })
    this.props.LoadPluginList(client_id, emailid)
    this.props.loadTopicList(client_id, emailid)
  }
  componentDidUpdate() {
    window.scrollTo(0, 0)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.pluginListInsight !== this.props.pluginListInsight) {
      this.setState(({ plugins: this.props.pluginListInsight && this.props.pluginListInsight.map((plugin) => plugin.id) }), () => {
      })
    }
    if (this.props.readTopics !== prevProps.readTopics) {
      this.setState(({ topics: this.props.readTopics }))
    }
  }
  logout() {
    this.props.onLogOut(this.props);
  }

  componentWillUnmount() {
    this.props.cancel()
  }
  
  render() {
    // let date_from = moment().subtract(7, 'days').format("YYYY-MM-DD") + "T00:00:00Z"
    // let date_to = moment().subtract(1, 'days').format("YYYY-MM-DD") + "T23:59:59Z"
    let time = timezoneDateCalculator('Last 7 Days', this.props.user.timezone)
    let dat = localStorage.getItem('fadeuponce') !== null && 'translate(0px, -40px)'
    return (
      cookie.load('user_token') ? <div className="content-wrapper" style={{ transform: dat }}>
    { this.props.user && this.props.user.last_data_sync.display_alert && <div class="alert alert-info alert-dismissible fade show" style={{margin:'50px 0px'}}>
        <strong>Note: </strong> No Recent Conversations Found (From {timezoneDatePrint(this.props.user && this.props.user.last_data_sync.datetime, this.props.user.timezone, 'Do MMMM YYYY', 'time')} till now) 
        <button type="button" class="close" data-dismiss="alert">&times;</button>
    </div>}
        <Header firstname={this.props.user.firstname} pathname={this.props.history.location.pathname}/>
        <LastDayMetrics plugins={this.state.plugins !== undefined && this.state.plugins !== null && this.state.plugins} />
        <div className="key-matrices-graph mt45">
          <h4 className="component-headings mb15"> Key Metrics </h4>
          <div className="row">
            <div className="col-lg-8 col-md-8 col-md-12">
              <ConversationGraph plugins={this.state.plugins !== undefined && this.state.plugins !== null && this.state.plugins} />
            </div>

            <div className="col-lg-4 col-md-4 col-sm-12">
              {/* <MostDiscussedTopics /> */}
              <FeedbackDash />

            </div>

            {/* <TopTraitGraph /> */}
            {/* <TopicTrends/> */}


          </div>
          <div className="row mt25">

            <div className="col-lg-8 col-md-8 col-md-12">
              <TopicTrends date_filter={{ from: time.from, to: time.to }} plugin={this.state.plugins !== undefined && this.state.plugins !== null && this.state.plugins} topics={this.state.topics !== null && this.state.topics !== undefined && this.state.topics} />
            </div>

            <div className="col-lg-4 col-md-4 col-sm-12">
              <ActivityStream />
            </div>

            {/* <RecentlyUpdatedCollection /> */}
            {/* <TopPerformers /> */}
          </div>
        </div>
      </div> :
        <Redirect to={'/'} />
    )
  }
};

const mapStateToProps = state => {
  return {
    loggedIn: state.authentication.loggedIn,
    user: state.authentication.user,
    pluginListInsight: state.dashboardInsightReducer.pluginList,
    readTopics: state.configureReducer.readTopics
  }
}

const mapActionToProps = {
  onLogOut: userActions.logout,
  cancel: dashboardAction.cancelRequest,
  loadNotifications: notificationAction.loadNotifications,
  LoadPluginList: dashboardInsight.LoadPluginList,
  loadTopicList: configureAction.loadTopicList,
}

export default withRouter(connect(mapStateToProps, mapActionToProps)(Dashboard));