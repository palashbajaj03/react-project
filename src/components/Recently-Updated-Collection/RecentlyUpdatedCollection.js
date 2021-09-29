/* Info: This file is for Recently Updated Collection Component */
/* Created on {3-07-19} By {Siddhant Chopra}*/
/* Modified on {11-07-19} By {Siddhant Chopra}*/

import React, { Component, useEffect } from 'react'

import { dashboardAction } from '../../actions';
import { connect } from 'react-redux';
import Scrollbar from "react-scrollbars-custom";
import moment from 'moment'
import { Link } from 'react-router-dom'
import { routingConstants } from "../../constants";


const RecentlyUpdatedCollection = (props) => {
  useEffect(() => {
    const { client_id, emailid } = props.user;
    props.recentlyUpdatedCollectionData(client_id, emailid)
  }, []);

  let user = props.user && props.user.firstname + " " + props.user.lastname;
  const current_data_s = props.ruc && props.ruc.data.sort((a, b) => {

    if (Math.abs(a.total - a.last_day_total) > Math.abs(b.total - b.last_day_total)) {
      return -1;
    } else {
      return 1;
    }
  }
  );

  useEffect(() => {
    if (props.ruc) {
      let count = 0;
      props.ruc.data.forEach(value => {
        if ((value.total - value.last_day_total) !== 0) {
          count++;
        }
      })
      // console.log(count)
      window.Appcues && window.Appcues.identify(props.user.emailid, {
        updatedCollection: count
      });
    }
  }, [props.ruc])

  return (
    <div className="col-lg-8 col-md-12 col-sm-12">
      <div className="custom-component mt25 recent-update-collection">
        <div className="recent-update-head">
          <h4 className="component-title"> Recently Updated Collections </h4>
          <p className="component-title-text"> List of collections in which coversations were added or removed </p>
        </div>
        {/*<Scrollbars className="scroll" style={{ maxHeight: "100%", minHeight: "396px" }}
          renderTrackVertical={props => <div className="track-vertical" />}
          renderThumbVertical={props => <div className="thumb-horizontal" />}
  >*/}
        {/*<PerfectScrollbar>*/}
        <Scrollbar>
          <div className="recent-update-body">
            {

              current_data_s ? current_data_s.map((data, index) => {
                let last_day_total = data.last_day_total
                let total = data.total

                let date = moment(data.datetime).format("Do MMM YYYY")
                return <Link to={
                  {
                    pathname: routingConstants.COLLECTION + "/" + data.id,
                    state: {
                      name: data.name
                    }
                  }
                } key={index}><div className="recent-deatil-row">
                    <div className="recent-deatil">
                      <div className="conver-oval mr15">{index + 1}</div>
                      <div className="recent-deatil-text">
                        <h5> {data.name} </h5>
                        <small className="recent-small-text"> Updated on: <strong>{date}</strong> By  <strong>{data.created_by.toLowerCase() === user.toLowerCase() ? "You" : data.created_by}</strong> </small>

                      </div>
                    </div>
                    <div className="recent-coversation">
                      <span className="coversation-text mr20 mb10"> {data.total} Conversations </span>
                      {total < last_day_total ? <small className="coversation-minus"> {total - last_day_total + ' Remove'} </small> :
                        <small className="coversation-add"> {`+${total - last_day_total} Added`} </small>
                      }

                    </div>
                  </div> </Link>
              }) : ''

            }
          </div>
        </Scrollbar>
        {/* </PerfectScrollbar>*/}
        {/*</Scrollbars>*/}
        <div className="see-all">
          <Link to={
            {
              pathname: routingConstants.COLLECTION + "/starred",
              state: {
                name: 'Starred Conversation'
              }
            }
          } className="see-all-text"> View All Collections </Link>
        </div>
      </div>

    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  ruc: state.dashboardReducer.ruc
})

const mapActionToProps = {
  recentlyUpdatedCollectionData: dashboardAction.recentlyUpdatedCollectionData
}

export default connect(mapStateToProps, mapActionToProps)(RecentlyUpdatedCollection)