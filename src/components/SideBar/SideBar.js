/* Info: This file is for Activity Stream Component */
/* Created on {3-07-19} By {Pravesh Sharma}*/
/* Modified on {15-07-19} By {Pravesh Sharma}*/

import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect, Link, withRouter, matchPath } from 'react-router-dom';
import cookie from 'react-cookies';
import VerifyUser from '../login/verifyUser'
import { routingConstants } from '../../constants';
import Notifications from '../Notifications/Notifications'
import './SideBar.css'


class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: false,
      notificationCount: 0,
    }
    this.param = '/topics'
  }

  getInitials = (string) => {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }

  componentDidMount() {
    window.jQuery('div.navbar-custom').click(function () {
      window.jQuery('div.navbar-custom').addClass('getSmall')
    })
    window.jQuery('div.navbar-custom').hover(() => {

    }, () => {
      window.jQuery('div.navbar-custom').removeClass('getSmall')
    })
    window.jQuery('div.navbar-custom').mousemove(() => {
      window.jQuery('div.navbar-custom').removeClass('getSmall')
    })
  }

  componentDidUpdate(prevProps) {
    window.jQuery('div.navbar-custom').click(function () {
      window.jQuery('div.navbar-custom').addClass('getSmall')
    })
    window.jQuery('div.navbar-custom').hover(() => {

    }, () => {
      window.jQuery('div.navbar-custom').removeClass('getSmall')
    })
    window.jQuery('div.navbar-custom').mousemove(() => {
      window.jQuery('div.navbar-custom').removeClass('getSmall')
    })
    const { location: { pathname } } = this.props;
    const previousLocation = prevProps.location.pathname;
    if (pathname !== previousLocation) {
      window.Appcues && window.Appcues.page();
      this.setState(({ notification: false }))
      window.scrollTo(0, 0)
    }
    if (prevProps.access !== this.props.access && this.props.access !== undefined) {
      const { page_users, page_user_hierarchy, page_topics, page_scripts, page_roles, page_integration } = this.props.access
      if (page_roles && page_scripts && page_topics && page_user_hierarchy && page_users && page_integration) {
        this.param = '/topics'
      } else if (page_roles) {
        this.param = '/roles'
      } else if (page_scripts) {

      } else if (page_topics) {
        this.param = '/topics'
      } else if (page_user_hierarchy) {
        this.param = '/team'
      } else if (page_users) {
        this.param = '/users'
      } else if (page_integration) {
        this.param = '/integration'
      }
    }
    if (prevProps.notification_list !== this.props.notification_list) {
      let notificationCount = this.props.notification_list && this.props.notification_list.length
      this.setState(({ notificationCount }))
    }
  }

  toggleNotification = () => {
    this.setState((prevState) => ({ notification: !prevState.notification }))
  }

  getQueryStringValue = (key) => {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  }

  render() {
    const fname = this.props.user && this.props.user.firstname
    const lname = this.props.user && this.props.user.lastname
    const str = fname + " " + lname

    if(window.location.pathname.indexOf("/conversation-detail") === 0){
      localStorage.setItem('conversationPage', window.location.pathname)
    }
    if (window.location.pathname.indexOf("/configure/integration/") === 0) {
      let token = this.getQueryStringValue("token")
      if (!localStorage.getItem('reauthToken')) {
        localStorage.setItem('reauthToken', token)
        localStorage.setItem('reauth_destination', window.location.pathname)
      }
    }
    return (
      cookie.load('user_token') ?
        <React.Fragment>
          <div className="navbar-custom">
            <div className="logo">
              <Link to={routingConstants.DASHBOARD} className="small-img"> <img src="/static/images/Asset 4.svg" alt="logo" /> </Link>
              <Link to={routingConstants.DASHBOARD} className="long-img"> <img src="/static/images/scoop-logo-blue.png" alt="logo" /> </Link>
            </div>
            <ul className="nav-ul" >
              <li className={matchPath(this.props.location.pathname, { path: routingConstants.DASHBOARD }) ? 'active' : ''}>
                <Link to={routingConstants.DASHBOARD}><i className="icon-home"></i><span>Home</span></Link>
              </li>
              {(this.props.access && this.props.access.page_search) && <li className={matchPath(this.props.location.pathname, { path: routingConstants.SEARCH }) ? 'active' : ''}>
                <Link to={routingConstants.SEARCH}><i className="icon-search"></i><span>Search</span></Link>
              </li>}

              {/*            <li className={matchPath(this.props.location.pathname, { path: routingConstants.CONVERSATION_LIST }) ? 'active' : ''}>
              <Link to={routingConstants.CONVERSATION_LIST}><i className="icon-conversations"></i><span>Conversations</span></Link>
    </li>*/}
              {(this.props.access && this.props.access.page_collections) && <li className={matchPath(this.props.location.pathname, { path: routingConstants.COLLECTION }) ? 'active' : ''}>
                <Link to={routingConstants.COLLECTION + "/starred"}><i className="icon-collections"></i><span>Collections</span></Link>
              </li>}
              {(this.props.access && (this.props.access.page_customer_dashboard || this.props.access.page_conversation_dashboard || this.props.access.page_rep_dashboard)) && <li className={matchPath(this.props.location.pathname, { path: `${routingConstants.INSIGHT_DASHBOARD}/:value` }) ? "insight-dashboard active" : "insight-dashboard"}>
                <a href="#"><i className="icon-insights"></i> <span>Insights</span></a>
                <div className="hover-item" style={{ minWidth: "250px" }}>
                  <ul>
                    {(this.props.access && this.props.access.page_conversation_dashboard) && <li><Link to={{ pathname: `${routingConstants.INSIGHT_DASHBOARD}/${routingConstants.CONVERSATION_DASHBOARD}`, value: 'Conversation' }}>Conversations Dashboard</Link></li>}

                    {(this.props.access && this.props.access.page_rep_dashboard) && <li><Link to={{ pathname: `${routingConstants.INSIGHT_DASHBOARD}/${routingConstants.REPS_DASHBOARD}`, value: 'Reps' }}>Reps Dashboard</Link></li>}

                    {/* {(this.props.access && this.props.access.page_customer_dashboard) && <li><Link to={{ pathname: `${routingConstants.INSIGHT_DASHBOARD}/${routingConstants.CUSTOMER_DASHBOARD}`, value: 'Customer' }}>Customer Dashboard</Link></li>} */}
                  </ul>
                </div>
              </li>}

            </ul>

            <ul className="nav-btm-ul">
              <li className="notification-li" onClick={this.toggleNotification} >
                {this.state.notificationCount > 0 && <span className="oval"> {this.state.notificationCount}</span>}
                <a href="#" className="notification"> <i className="icon-notifications"></i> <span className="help">Notifications</span></a>
              </li>
              {(this.props.access && (this.props.access.page_roles || this.props.access.page_scripts || this.props.access.page_topics || this.props.access.page_user_hierarchy || this.props.access.page_users || this.props.access.page_integration)) && <li className={matchPath(this.props.location.pathname, { path: routingConstants.CONFIGURE }) ? 'active' : ''}>
                <Link to={`${routingConstants.CONFIGURE + this.param}`}><i className="icon-configurations"> <small className="path1"></small><small className="path2"></small><small className="path3"></small><small className="path4"></small></i> <span className="configure">Configure</span></Link>
              </li>}

              <li>
                <a href="https://docs.scoop.ai/" target="_blank" ><i className="icon-help"></i><span className="help">Help</span></a>
              </li>

              <li className={matchPath(this.props.location.pathname, { path: routingConstants.PROFILE }) ? 'active' : ''}>
                <Link to={routingConstants.PROFILE}>
                  <div className="active-user-img as-img profileImg">
                    <span className="initials-logo">
                      {

                        this.getInitials(str)

                      } </span>
                  </div>
                  <span className="userName">{this.props.user && this.props.user.firstname} {this.props.user && this.props.user.lastname}</span></Link>
              </li>
            </ul>
          </div>
          {this.state.notification && <Notifications close={this.toggleNotification} />}
        </React.Fragment> :
        // <Redirect to="/" />
        window.location.pathname === '/onboard' ? <VerifyUser /> : <Redirect to="/" />
    )
  }
}


const mapStateToProps = (state) => {
  return {
    notification_list: state.notificationReducer.notifications_list,
    loggedIn: state.authentication.loggedIn,
    user: state.authentication.user,
    access: state.authentication.access
  }
}
export default withRouter(connect(mapStateToProps)(SideBar));