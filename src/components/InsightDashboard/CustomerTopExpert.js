import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions';
import { Link } from 'react-router-dom';
import Scrollbar from 'react-scrollbars-custom'
import { routingConstants } from '../../constants'


const CustomerTopExpert = (props) => {
   useEffect(() => {
     const { client_id, emailid } = props.user;
     (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) &&  props.LoadCustomerBlocks(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin)
 
   }, [props.plugin, props.date_filter.from, props.date_filter.to, props.dashboard])

const titleCase = (str) => {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
     splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   return splitStr.join(' ');
 }
   return (
      <div className="row">
         <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="custom-component mt25 total-expert-keyword pad0">
               <div className="total-expert-header">
                  <h4 className="component-title"> Top Expert Keywords </h4>
                  <p className="component-title-text"> Number of conversations with expert keywords mentioned  </p>
               </div>
               <div className="total-expert-body top-expert mt20 pad0">
              {/* <Scrollbars
                          className="scroll" style={{ minHeight: "370px", height: "auto" }}
                          id="myDivId"
                          renderTrackVertical={props => <div className="track-vertical" />}
                          renderThumbVertical={props => <div className="thumb-horizontal" />}
              >*/}
              <Scrollbar>
               <div className="scroll-wrapper">
                  {
                     props.customer_blocks_expert && props.customer_blocks_expert.map((data,index)=>{
                      return  <Link key={index}
                 to={{
                   pathname: routingConstants.SEARCH,
                   cta: data.cta
                 }}>  <div className="total-expert-row">
                 <div className="recent-deatil">
                   <div className="conver-oval mr15">{index+1}</div>
                   <div className="total-expert-text">
                     <h5> {titleCase(data.keyword)} </h5>
                     {/* <small className="total-expert-small-text"> Occured in 60 conversations </small> */}
 
                   </div>
                 </div>
                 <div className="total-expert-result">
                   <span className="competition-text"> {data.current_count} </span>
                   {/* <span className={(data.current_count - data.previous_count) >= 0 ? "added-text small-side-text" : "removed-text small-side-text"}>
                          {data.current_count - data.previous_count > 0 ? "+" + (data.current_count - data.previous_count) : data.current_count - data.previous_count}
                          {(data.current_count - data.previous_count) >= 0 ? " Added" : " Removed"}</span> */}
                            <div className={`upDownPercent without-bg ${(data.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                                  {(data.delta_percent > 0) ? <i className="icon-upward-arrow"></i> : <i className="icon-downward-arrow"></i>}
                                    <span className="perc">{data.delta_percent}%</span>
                                    
                                  </div>
                 </div>
               </div> </Link>
                     })
                  }
               </div>
               </Scrollbar>
               </div>
            </div>
         </div>
      </div>
   )
}

const mapStateToProps = state => {
   return {
     user: state.authentication.user,
     customer_blocks_expert: state.dashboardInsightReducer.customer_blocks && state.dashboardInsightReducer.customer_blocks.expert_return_array
   }
 }
 
 const mapActionToProps = {
   LoadCustomerBlocks: dashboardInsight.LoadCustomerBlocks
 }
 
 export default connect(mapStateToProps, mapActionToProps)(CustomerTopExpert);
