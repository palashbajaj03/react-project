import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions';

const TotalContact = (props) => {

   useEffect(() => {
      const { client_id, emailid } = props.user;
      (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.loadCustomerContactability(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

   }, [props.plugin, props.date_filter.from, props.date_filter.to, props.dashboard])

   return (
      <div className="row">
         <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="custom-component mt25 total-expert-keyword pad0">
               <div className="total-expert-body">
                  <div className="total-contact-row">
                     <div className="contact-deatil">
                        <div className="contact-icon"><i className="icon-person"></i></div>
                        <div className="contact-text">
                           <h5> Total Contact Mentioned </h5>
                           <small className="contact-sub-text"> {props.customer_contactability && props.customer_contactability[0].total_mention_current} </small>

                        </div>
                     </div>
                     <div className="total-contact-result">
                        <div className={`upDownPercent without-bg ${(props.customer_contactability && props.customer_contactability[0].total_mention_delta > 0) ? 'arrUp' : 'arrDown'} `}>
                           {(props.customer_contactability && props.customer_contactability[0].total_mention_delta > 0) ? <i className="icon-upward-arrow"></i> : <i className="icon-downward-arrow"></i>}
                           <span className="perc">{props.customer_contactability && Math.abs(props.customer_contactability[0].total_mention_delta)}%</span>
                        </div>
                     </div>
                  </div>

                  <div className="total-contact-row">
                     <div className="contact-deatil">
                        <div className="contact-icon"><i className="icon-email"></i></div>
                        <div className="contact-text">
                           <h5> Email Mentioned </h5>
                           <small className="contact-sub-text"> {props.customer_contactability && props.customer_contactability[0].email_mention_current} </small>

                        </div>
                     </div>
                     <div className="total-contact-result">
                        <div className={`upDownPercent without-bg ${(props.customer_contactability && props.customer_contactability[0].email_mention_delta > 0) ? 'arrUp' : 'arrDown'} `}>
                           {(props.customer_contactability && props.customer_contactability[0].email_mention_delta > 0) ? <i className="icon-upward-arrow"></i> : <i className="icon-downward-arrow"></i>}
                           <span className="perc">{props.customer_contactability && Math.abs(props.customer_contactability[0].email_mention_delta)}%</span>
                        </div>
                     </div>
                  </div>

                  <div className="total-contact-row">
                     <div className="contact-deatil">
                        <div className="contact-icon"><i className="icon-phone"></i></div>
                        <div className="contact-text">
                           <h5> Mobile Mentioned </h5>
                           <small className="contact-sub-text"> {props.customer_contactability && props.customer_contactability[0].mobile_mention_current} </small>

                        </div>
                     </div>
                     <div className="total-contact-result">
                        <div className={`upDownPercent without-bg ${(props.customer_contactability && props.customer_contactability[0].mobile_mention_delta > 0) ? 'arrUp' : 'arrDown'} `}>
                           {(props.customer_contactability && props.customer_contactability[0].mobile_mention_delta > 0) ? <i className="icon-upward-arrow"></i> : <i className="icon-downward-arrow"></i>}
                           <span className="perc">{props.customer_contactability && Math.abs(props.customer_contactability[0].mobile_mention_delta)}%</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

const mapStateToProps = state => ({
   user: state.authentication.user,
   customer_contactability: state.dashboardInsightReducer.customer_contactability
})

const mapActionToProps = {
   loadCustomerContactability: dashboardInsight.LoadCustomerContactability
}

export default connect(mapStateToProps, mapActionToProps)(TotalContact);