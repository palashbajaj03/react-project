/* Info: This file is for Most Discussed Topics Component */
/* Created on {3-07-19} By {Siddhant Chopra}*/
/* Modified on {11-07-19} By {Siddhant Chopra}*/

import React, { useEffect } from 'react';
import './MostDiscussedTopics.css'
import { dashboardAction } from '../../actions';
import { routingConstants } from '../../constants';
import { connect } from 'react-redux';
import Scrollbar from "react-scrollbars-custom";
import { Link } from 'react-router-dom';

const MostDiscussedTopics = (props) => {
  useEffect(() => {
    const { client_id, emailid } = props.user;
    props.mostDiscussedTopicsData(client_id, emailid)
  }, [])
  return (
    <div className="custom-component most-discus-topic padbt0">
      <div className="most-discus-topic-head">
        <h4 className="component-title"> Most Discussed Topics </h4>
        <p className="component-title-text"> Top topics discussed in the last 7 days </p>
      </div>
      <Scrollbar>
        <div className="most-discus-topic-body">

          {
            props.mdt ? <ul className="most-discus-ul">
              {
                props.mdt.data.map((data, index) => {
                  return <Link key={index} to={{
                    pathname: routingConstants.SEARCH,
                    cta: data.cta
                  }}> <li>
                      <h5>
                        {/* <span className="ring brd-green mr10"></span>  */}
                        {data.name} </h5>
                      <p className="sub-pra mt5"> Occured in {data.count} conversations</p>
                    </li>
                  </Link>
                })
              }
            </ul> : ''
          }
        </div>
      </Scrollbar>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  mdt: state.dashboardReducer.mdt,
})

const mapActionToProps = {
  mostDiscussedTopicsData: dashboardAction.mostDiscussedTopicsData
}

export default connect(mapStateToProps, mapActionToProps)(MostDiscussedTopics)