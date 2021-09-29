import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { dashboardInsight } from '../../actions'
import { routingConstants } from '../../constants'
import Scrollbar from 'react-scrollbars-custom';
const RepsFollowAppointment = (props) => {
   let [data, setData] = useState([]);
   useEffect(() => {
      const { client_id, emailid } = props.user;
      switch (props.cardType) {
         case 'followup':
            (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadRepsFollowUp(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);
            break;
         case 'appointment':
            (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadRepsAppointment(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);
      }
   }, [props.plugin, props.date_filter.from, props.date_filter.to, props.cardType])
   useEffect(() => {
      switch (props.cardType) {
         case 'followup':
            setData((
               props.reps_follow_ups
            ))
            break;
         case 'appointment':
            setData((
               props.reps_appointment
            ))
            break;
      }
   }, [props.plugin, props.date_filter.from, props.date_filter.to, props.cardType, props.reps_follow_ups, props.reps_appointment])
   const getInitials = (string) => {
      var names = string.split(' '),
         initials = names[0].substring(0, 1).toUpperCase();

      if (names.length > 1) {
         initials += names[names.length - 1].substring(0, 1).toUpperCase();
      }
      return initials;
   }
   return (
      <div className="follow-ups custom-component mt25 pad0">
         <div className="follow-ups-title">
            <h4 className="component-title"> {props.cardType === 'followup' ? 'Follow up' : 'Appointment '} </h4>
            <p className="component-title-text"> {props.cardType === 'followup' ? 'List of upcoming follow ups' : 'List of upcoming appointments'}  </p>
         </div>
         <div className="total-expert-body mt25 pad0">
        {/* <Scrollbars
            className="scroll" style={{ minHeight: "477px", height: "auto" }}
            id="myDivId"
            renderTrackVertical={props => <div className="track-vertical" />}
            renderThumbVertical={props => <div className="thumb-horizontal" />}
        >*/}
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
                              {value.visitors.map(visitor => (
                                 <h5> {visitor.name}, <span>{visitor.designation}, {visitor.organization}</span> </h5>
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
                           {/* {<img src={data.image} alt="profile" />} */}
                        </div>
                     </div>
                  </Link>
               ))}

            </div>
         </Scrollbar>
         </div>
      </div>
   )
}

const mapStateToProps = state => ({
   user: state.authentication.user,
   reps_follow_ups: state.dashboardInsightReducer.reps_follow_ups,
   reps_appointment: state.dashboardInsightReducer.reps_appointment
});

const mapActionToProps = {
   LoadRepsFollowUp: dashboardInsight.LoadRepsFollowUp,
   LoadRepsAppointment: dashboardInsight.LoadRepsAppointment
}


export default connect(mapStateToProps, mapActionToProps)(RepsFollowAppointment);