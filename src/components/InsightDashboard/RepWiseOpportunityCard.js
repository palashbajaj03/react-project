import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { routingConstants } from '../../constants'
import { dashboardInsight } from '../../actions';
import Scrollbar from 'react-scrollbars-custom'
const RepWiseOpportunityCard = (props) => {

  const titleCase = (str) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }
  useEffect(() => {
    const { client_id, emailid } = props.user;
    (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadRepsWiseOpportunity(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin)

  }, [props.plugin, props.date_filter.from, props.date_filter.to])

  const current_data = props.rep_wise_opportunity && props.rep_wise_opportunity.sort((a, b) => Number(b.current_opportunity_count) - Number(a.current_opportunity_count));
  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 col-sm-12">
        <div className="conv-high custom-component mt25 total-expert-keyword pad0">
          <div className="top-rep-wise-title">
            <h4 className="component-title"> Opportunities </h4>
          </div>
          <div className="total-expert-body common-body-top mt20 pad0">
              <Scrollbar>
                <div className="scroll-wrapper">
                  {
                    current_data && current_data.length > 0 ?current_data.map((data, index) => {
                      return <div className="recent-deatil-row">
                      <div className="recent-deatil">
                        <div className="conver-oval mr15">{index + 1}</div>
                        <div className="total-expert-text">
                          <h5> {titleCase(data.rep_name)} </h5>

                        </div>
                      </div>
                      <div className="total-expert-result">
                        <span className="competition-text"> {data.current_opportunity_count}</span>
                        <div className={`upDownPercent without-bg ${(data.opportunity_delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                          {(data.opportunity_delta_percent > 0) ? <i className="icon-upward-arrow"></i> : <i className="icon-downward-arrow"></i>}
                          <span className="perc">{data.opportunity_delta_percent}%</span>

                        </div>
                      </div>
                    </div> 

                      //  <Link key={index}
                      //   to={{
                      //     pathname: routingConstants.SEARCH,
                      //     cta: data.cta
                      //   }}>
                          
                          
                        // </Link>
                    }): current_data && current_data !== undefined && <div className="noFeedback">No Data Available</div>
                  }

                </div>
              </Scrollbar>
            </div>
        </div>
      </div>
    </div >
  )
}
const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    rep_wise_opportunity: state.dashboardInsightReducer.rep_wise_opportunity
  }
}

const mapActionToProps = {
  LoadRepsWiseOpportunity: dashboardInsight.LoadRepsWiseOpportunity
}


export default connect(mapStateToProps, mapActionToProps)(RepWiseOpportunityCard);
