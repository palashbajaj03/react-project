import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { routingConstants } from '../../constants'
import { Link } from 'react-router-dom'
import Scrollbar from "react-scrollbars-custom";

import { notificationAction } from '../../actions'
import './notifications.css'

class Notifications extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { client_id, emailid, rep_id } = this.props.user
    this.props.loadNotifications({ client_id, emailid, rep_id })
  }

  closeNotificationTab = () => {
    document.getElementsByClassName('notification-bar')[0].classList.remove('slideInLeft');
    document.getElementsByClassName('notification-bar')[0].classList.add('slideOutLeft');
    setTimeout(() => {
      this.props.close()
    }, 1000)
  }

  clicked = (e) => {
    let { client_id, emailid, rep_id } = this.props.user;
    if (e.target.id) {
      let notification_ids = [e.target.id]
      this.props.markRead({ client_id, emailid, notification_ids, rep_id })
    } else {
      let notification_ids = this.props.notification_list && this.props.notification_list.map(notification => notification.id);
      this.props.markRead({ client_id, emailid, notification_ids, rep_id })
    }
  }

  clearAll = () => {
    const { emailid, client_id, rep_id } = this.props.user;
    let notification_ids = this.props.notification_list && this.props.notification_list.map(notification => notification.id);
    this.props.clearAll({ client_id, emailid, rep_id, notification_ids })
  }

  render() {
    const { notification_list } = this.props
    const notification_lists = notification_list !== undefined && notification_list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    let flag = false
    notification_list && notification_list.map(notification => {
      if (notification.is_read) {
        flag = true
      } else {
        flag = false
      }
    })
    return (
      <div className="notification-bar animated slideInLeft">
        <div className="notification-bar-head mb30">
          <h2>Notifications</h2>
          {notification_list && notification_list.length > 0 && <div className="mark-all-btn">
            {flag ? <span onClick={this.clearAll}>Clear All</span> : <span onClick={this.clicked}>Mark all as read</span>}
          </div>}
          <div className="close-notification">
            <span><i className="icon-close" onClick={this.closeNotificationTab}></i></span>
          </div>
        </div>
        <div className="notification-bar-body">
          <div className="notification-body-wrapper">
            <Scrollbar>
              {
                notification_lists && notification_lists.length > 0 ? notification_lists.map((notification, index) => {
                  return <Link id={notification.id} key={index}
                    onClick={this.clicked}
                    to={{
                      pathname: routingConstants.CONVERSATION_DETAIL + "/" + notification.intent_data.conversation_id,
                      data: notification.intent_data.message_id
                    }}> <div className="notification-item mb20" style={{ pointerEvents: "none" }}>
                      <div className="n-msg-wrapper">
                        {/* <div className="n-msg">
                      <span className="n-by bold">Jason Roy </span> commented <span className="n-comment bold">“Good Work”</span> on the conversation
                            </div> */}
                        <div className="n-msg">
                          {notification.message}
                        </div>
                        <div className="n-time-ago">
                          <i className="icon-time"></i> <span className="n-ago">{moment(notification.created_at).fromNow()}</span>
                        </div>
                      </div>

                      <div className="notification-unread-mark">
                        {!notification.is_read && <span className="n-mark"></span>}
                      </div>
                    </div> </Link>
                }) : <div className="notification-empty text-center">
                    <img src="/static/images/notification-empty.svg" alt="notification-empty" width="350px" />
                    <p className="mt40 notification-empty-text">{this.props.no_notifications}</p>
                  </div>
              }
            </Scrollbar>
          </div>

        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  notification_list: state.notificationReducer.notifications_list,
  no_notifications: state.notificationReducer.no_notifications
})

const mapActionToProps = {
  loadNotifications: notificationAction.loadNotifications,
  clearAll: notificationAction.clearAll,
  markRead: notificationAction.markRead
}

export default connect(mapStateToProps, mapActionToProps)(Notifications);
