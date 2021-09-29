import { dashboardInsight } from '../../actions';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { routingConstants } from '../../constants';
import { connect } from 'react-redux';
import Scrollbar from 'react-scrollbars-custom'
const ConversationCompetitionMentionCard = (props) => {

  useEffect(() => {
    const { client_id, emailid } = props.user;
    (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadConversationHighlights(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);
  }, [props.plugin, props.date_filter.from, props.date_filter.to, props.dashboard])
 
  return (
    <div className="carousel-container">

      <div className="conv-high follow-ups custom-component pad0">
        <div className="follow-ups-title">
          <h4 className="component-title"> Highlights</h4>
          <p className="component-title-text"> </p>
        </div>
        <div className="total-expert-body mt25 pad0">
          <Scrollbar>
            <div className="scroll-wrapper">
              {
                props.conversationHighlights && props.conversationHighlights.length > 0 ? props.conversationHighlights.map((value, index) => {
                  return <Link
                    key={index}
                    to={`${routingConstants.CONVERSATION_DETAIL}/${value.record_id}`}
                  >
                    <div key={index} className="total-expert-row">
                      <div className="recent-deatil">
                        {/* <div className="conver-oval mr15">{index + 1}</div> */}
                        <div className="total-expert-text highlight">
                          <h5>{value.feature}</h5>
                          <p className="component-title-text"> {value.label}</p>
                        </div>
                      </div>
                        <div className="active-user-img as-img">
                          <span className="initials-logo">
                            {value.value}
                          </span>
                        </div>

                    </div>
                  </Link>
                }): props.conversationHighlights && props.conversationHighlights!== undefined && <div className="noFeedback">No Data Available</div>
              }

            </div>
          </Scrollbar>
        </div>
      </div>

    </div>
  )
}
const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    conversationHighlights: state.dashboardInsightReducer.conversationHighlights
  }
}

const mapActionToProps = {
  LoadConversationHighlights: dashboardInsight.LoadConversationHighlights
}

export default connect(mapStateToProps, mapActionToProps)(ConversationCompetitionMentionCard);