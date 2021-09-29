/* Info: This file is for Last Day Metrics Component */
/* Created on {3-07-19} By {Siddhant Chopra}*/
/* Modified on {19-07-19} By {Pravesh Sharma}*/

import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { dashboardAction } from '../../actions'
import './LastDayMetric.css'
import ReactGA from 'react-ga';
import { PageView, initGA } from '../Tracking/index';
import { routingConstants, timezoneDateCalculator } from '../../constants'


const LastDayMetric = (props) => {

  useEffect(() => {
    const { client_id, emailid } = props.user;
    initGA('UA-144819158-1', { standardImplementation: true });
    PageView();
    ReactGA.ga('create', 'UA-144819158-1', { 'userId': { emailid } })
    let time = timezoneDateCalculator('Yesterday', props.user.timezone)
    // let date_from = moment().subtract(1, 'days').format("YYYY-MM-DD") + "T00:00:00Z"
    // let date_to = moment().subtract(1, 'days').format("YYYY-MM-DD") + "T23:59:59Z"
    props.plugins && props.loadConversion(client_id, emailid, time.from, time.to, props.plugins && props.plugins)
  }, [props.plugins])

  const conversation = Object.keys(props.conversation !== undefined && props.conversation).map((data) => {
    return [(data), props.conversation[data]];
  })
  conversation.sort((a, b) => Number(a[1].display_index) - Number(b[1].display_index))

  return (
    <div className="car-box-row mt50 animated">
      <h4 className="component-headings mb15"> Previous Day Metrics </h4>
      <div className="row">
        {
          conversation && conversation.map((data, index) => {
            return <div key={index} className="col-lg-3 col-md-6 col-sm-6 ">
              <Link to={{
                pathname: routingConstants.SEARCH,
                cta: Object.keys(data[1].cta).length !== 0 && data[1].cta
              }}>
                <div className={data[0] === "bant" ? "card-box apportunity-box" : data[0] === "next_steps" ? "card-box missed-appor-box" : data[0] === "opportunities" ? "card-box nagative-box" : data[0] === "total" && "card-box rogue-box"} >
                  <h5 className="toalHeading"><span> {data[0] === "bant" ? "BANT Conversations" : data[0] === "next_steps" ? "Next Steps Conversations" : data[0] === "opportunities" ? "Opportunities" : data[0] === "total" && "Total Conversations"} </span></h5>
                  <h2>{data[1].current_count} </h2>
                  <div className={data[0] === "bant" ? "apport-icon" : data[0] === "next_steps" ? "missed-icon" : data[0] === "opportunities" ? "nagative-icon" : data[0] === "total" && "rogue-icon"}>
                    {
                      data[0] === "bant" ? <img src="/static/images/opportunity-conversion-icon.svg" alt="icon" /> : data[0] === "next_steps" ? <img src="/static/images/missed-opportunities-icon.svg" alt="icon" /> : data[0] === "opportunities" ? <img src="/static/images/negative-conversations-icon.svg" alt="icon" /> : data[0] === "total" && <img src="/static/images/rogue-conversations-icon.svg" alt="icon" />
                    }

                  </div>
                  <div className="upDownPercent">
                    {(data[1].delta_percent > 0) ? <i className="icon-upward-arrow"></i> : <i className="icon-downward-arrow"></i>}
                    <span className="perc">{Math.abs(data[1].delta_percent)}%</span>
                  </div>
                </div>
              </Link>
            </div>
          })
        }

        {/* 
      <div className="col-lg-3 col-md-6 col-sm-6 ">
          <Link to={{
            pathname: routingConstants.SEARCH,
            cta: props.missed && props.missed.cta
          }}>
            <div className="card-box missed-appor-box" onClick={_ => ReactGA.event({ category: "Missed Opportunities widget", action: "User clicked the Missed Opportunities widget", label: "Missed Opportunities" })}>
              <span className="oval-span"></span>
              <h2> {props.missed ? props.missed.count : 0}{<span> <i>/</i> {props.missed ? props.missed.total : 0}  </span>}</h2>
              <p> Total Opportunities </p>
              <h5 className="percent-coversation"> {props.missed ? props.missed.percent : 0}% <span> of total conversations </span></h5>
              <div className="missed-icon">
                <img src="/static/images/missed-opportunities-icon.svg" alt="icon" />
              </div>
            </div>
          </Link>
        </div> */}
        {/* <BantMention/> */}
        {/* <div className="col-lg-3 col-md-6 col-sm-6 ">
          <Link to={{
            pathname: routingConstants.SEARCH,
            cta: props.rogue && props.rogue.cta
          }}>
            <div className="card-box rogue-box" onClick={_ => ReactGA.event({ category: "Rogue: Conversation widget", action: "User clicked the Rogue: Conversation widget", label: "Rogue: Conversation" })}>
              <span className="oval-span"></span>
              <h2>{props.rogue ? props.rogue.count : 0}{<span> <i>/</i> {props.rogue ? props.rogue.total : 0} </span>} </h2>
              <p> Pricing Mentions </p>
              <h5 className="percent-coversation">{props.rogue ? props.rogue.percent : 0}%<span> of total conversations </span></h5>
              <div className="rogue-icon">
                <img src="/static/images/rogue-conversations-icon.svg" alt="icon" />
              </div>
            </div>
          </Link>
        </div> */}
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    conversation: state.dashboardReducer.opportunityConversion,
  }
}

const mapActionToProps = {
  loadConversion: dashboardAction.opportunityConversion,
}

export default connect(mapStateToProps, mapActionToProps)(LastDayMetric);