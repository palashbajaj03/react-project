/* Info: This file is for Activity Stream Component */
/* Created on {3-07-19} By {Siddhant Chopra}*/
/* Last Modified on {01-10-19} By {Pravesh Sharma}*/
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Scrollbar from "react-scrollbars-custom";

import { dashboardAction } from '../../actions/'
import { routingConstants } from '../../constants';
import moment from 'moment'
//import './activityStream.css'

const FeedbackDash = (props) => {

  let [counter, setCounter] = useState(10)

  useEffect(() => {
    const { client_id, emailid, rep_id } = props.user;
    const pagination = {
      "itemsCountPerPage": counter,
      "activePage": 0
    }
    props.LoadFeedback({
      pagination, client_id, emailid, rep_id
    });
  }, [counter])

  const changeFun = (values) => {
    if (values.clientHeight + values.scrollTop >= values.scrollHeight) {
      setCounter(counter + 10)
    }
  }
  const getInitials = (string) => {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }

  return (
    <div className="custom-component h-100 feedback" >
      <div className="active-stream-head">
        <h4 className="component-title"> Recent Feedback </h4>
        {/* <p className="component-title-text"> List of recent conversations performed by by you or your team </p> */}
      </div>
      <Scrollbar
        onScroll={(values) => changeFun(values)}
      >
        <div className="active-stream-body" id="myDivId2">
          {
            props.readFeedBack!== undefined && props.readFeedBack.length > 0 ? props.readFeedBack.map((data, index) => {
              let newtime = data.datetime.replace("Z", "")
              return <Link
                key={index}
                to={`${routingConstants.CONVERSATION_DETAIL}/${data.record_id}`}>
                <div className="active-user-wrapp" key={index}>
                  <div className="active-user-img as-img">
                    <span className="initials-logo">
                      {
                        getInitials(data.user.first_name + " " + data.user.last_name)
                      }
                    </span>

                  </div>
                  <div className="active-user-info">
                    <h5 className="user-chat-heading">
                      <span className="active-user-name">
                        {
                          data.user.first_name + " " + data.user.last_name
                        } </span> gave a feedback
                        {/* {data.customer.length >= 1 ? data.customer.map(cust => cust.name).toString() : ''},{data.customer.length >= 1 ? data.customer[0].designation : ''} */}
                      {/* of {data.customer.length >= 1 ? data.customer[0].organization : ''}  */}

                    </h5>
                    <p className="sub-pra mt5"> <img src={"/static/images/time.svg"} className="time-icon mr5" alt="activity-stream" />{moment(newtime).fromNow()}</p>
                  </div>
                </div>

              </Link>
            }) : props.readFeedBack!== undefined && <div className="noFeedback">No recent feedback. Give some now!</div>
          }
        </div>
      </Scrollbar>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  readFeedBack: state.dashboardReducer.readFeedBack,
})

const mapActionToProps = {
  LoadFeedback: dashboardAction.LoadFeedback
}

export default connect(mapStateToProps, mapActionToProps)(FeedbackDash)
