import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { dashboardInsight } from '../../actions';
import { routingConstants } from '../../constants'
import Scrollbar from 'react-scrollbars-custom'
import moment from 'moment';

const CustomerFollowUpAppointment = (props) => {
   let [data, setData] = useState([]);
   useEffect(() => {
      const { client_id, emailid } = props.user;
      switch (props.cardType) {
         case 'followup':
            (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadCustomerFollowUps(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);
            break;
         case 'appointment':
            (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadCustomerAppointment(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);
      }
   }, [props.plugin, props.date_filter.from, props.date_filter.to, props.cardType])
   useEffect(() => {
      switch (props.cardType) {
         case 'followup':
            setData((
               props.customer_followups
            ))
            break;
         case 'appointment':
            setData((
               props.customer_appointment
            ))
            break;
      }
   }, [props.plugin, props.date_filter.from, props.date_filter.to, props.cardType, props.customer_followups, props.customer_appointment])
   const getInitials = (string) => {
      var names = string.split(' '),
         initials = names[0].substring(0, 1).toUpperCase();

      if (names.length > 1) {
         initials += names[names.length - 1].substring(0, 1).toUpperCase();
      }
      return initials;
   }
   return (
      <div className="follow-ups custom-component pad0 mt25">
         <div className="follow-ups-title">
            <h4 className="component-title"> {props.cardType === 'followup' ? 'Follow up' : 'Appointment '} </h4>
            <p className="component-title-text"> {props.cardType === 'followup' ? 'List of upcoming follow ups' : 'List of upcoming appointments'}  </p>
         </div>
         <div className="total-expert-body mt25 pad0">
         <Scrollbar>
            <div className="scroll-wrapper">
               {data && data.map((value, index) => (
                  <Link
                     key={index}
                     to={`${routingConstants.CONVERSATION_DETAIL}/${value.record_id}`}
                  >
                     <div key={index} className="total-expert-row">
                        <div className="recent-deatil">
                           <div className="conver-oval mr15">{index + 1}</div>
                           <div className="total-expert-text">
                              {value.visitors.map((visitor,index) => (
                                 <h5 key={index}> {visitor.name}, <span>{visitor.designation}, {visitor.organization}</span> </h5>
                              ))}
                              <small className="total-expert-small-text"> follow up on {moment(value.date).format('DD-MM-YY')} </small>
                           </div>
                        </div>
                        <div className="active-user-img as-img">
                           <span className="initials-logo">
                              {
                                 value.visitors.length > 1 ? value.visitors.map((rep) =>
                                    getInitials(rep.name)) : value.visitors.map((rep) => getInitials(rep.name))
                              }
                           </span>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </Scrollbar>
         </div>
      </div>
   );
}

const mapStateToProps = state => ({
   user: state.authentication.user,
   customer_followups: state.dashboardInsightReducer.customer_followups,
   customer_appointment: state.dashboardInsightReducer.customer_appointment
});

const mapActionToProps = {
   LoadCustomerFollowUps: dashboardInsight.LoadCustomerFollowUps,
   LoadCustomerAppointment: dashboardInsight.LoadCustomerAppointment
}


export default connect(mapStateToProps, mapActionToProps)(CustomerFollowUpAppointment);