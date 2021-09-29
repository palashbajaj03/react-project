import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions';
import { Link } from 'react-router-dom';
import { routingConstants } from '../../constants'
const InsightCards = (props) => {

  let [imageUrl, setImageUrl] = useState({});
  let [data, setData] = useState({});
  let [title, setTitle] = useState({})


  useEffect(() => {
    const { client_id, emailid } = props.user;
    switch (props.dashboard) {
      case 'conversation':
        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadConversationTotal(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadConversationOpportunity(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadConversationPurchaseStage(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadConversationPricingMention(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

        setImageUrl({
          one: '/static/images/total-conversations.png',
          two: '/static/images/total-opportunities.png',
          three: '/static/images/total-conversions.png',
          four: '/static/images/total-pricing-mentions.png'
        })

        setTitle({
          // one: 'Total Conversations',
          one: 'Conversations with Questions',
          // two: 'Total Opportunities',
          two: 'High Switches Conversations',
          // three: 'Purchase Stage',
          three: 'High Dead Air Conversations',
          four: 'Negative Sentiment Conversations'
        })

        break;
      case 'representative':
        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadRepsTotal(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadRepsFollowUps(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadRepsRogue(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadRepsDeadAir(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

        setImageUrl({
          one: '/static/images/total-conversations.png',
          two: '/static/images/follow-ups.png',
          three: '/static/images/rogue-conversations-2.png',
          four: '/static/images/dead-air-conversations.png'
        })

        setTitle({
          one: 'Active Reps',
          two: 'Reps with Opportunities',
          three: 'Reps with Feedback',
          four: 'Reps with High Interactivity'
        })
        break;
      case 'customer':
        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadCustomerTotal(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadCustomerTotalNegative(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadCustomerTotalProblem(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadCustomerTotalPriceSensitive(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);

        setImageUrl({
          one: '/static/images/total-conversations.png',
          two: '/static/images/happy-sentiments.png',
          three: '/static/images/price-sensitive.png',
          four: '/static/images/converted-customers.png'
        })

        setTitle({
          one: 'Total Conversations',
          two: 'Total Negative Sentiments',
          three: 'Total Price Sensitive',
          four: 'Total Problems'
        })
    }

  }, [props.plugin, props.date_filter.from, props.date_filter.to, props.dashboard])

  useEffect(() => {
    switch (props.dashboard) {
      case 'conversation':
        setData({
          one: props.conversation_total,
          two: props.conversation_opportunity,
          three: props.conversation_purchase_stage,
          four: props.conversation_pricing_mention,
        })
        break;
      case 'representative':
        setData({
          one: props.reps_total,
          two: props.reps_followups,
          three: props.reps_rogue,
          four: props.reps_dead_air,
        })
        break;
      case 'customer':
        setData({
          one: props.customer_total,
          two: props.customer_total_negative,
          three: props.customer_total_price_sensitive,
          four: props.customer_total_problem,
        })
    }
  }, [props.conversation_total, props.conversation_opportunity, props.conversation_pricing_mention, props.conversation_purchase_stage, props.reps_total, props.reps_followups, props.reps_rogue, props.reps_dead_air, props.customer_total, props.customer_total_negative, props.customer_total_problem, props.customer_total_price_sensitive, props.dashboard])

  return (
    <div className="row">
      <div className="col-lg-3 col-md-6 col-sm-6 ">
        <Link to={{
          pathname: (data.one && (data.one.cta !== undefined)) ? routingConstants.SEARCH : '',
          cta: data.one && data.one.cta
        }}>
          <div className={`card-box apportunity-box ${(data.one && data.one.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
            {/* <!-- <span className="oval-span"></span> --> */}
            <h5 className="toalHeading"><span> {title.one} </span></h5>
            <h2>{data.one && data.one.current_count} </h2>
            <div className="apport-icon insightIcon">
              <img src={imageUrl.one} alt="icon" />
            </div>
            <div className="upDownPercent">
              {(data.one && data.one.delta_percent > 0) ? <i className="icon-upward-arrow"></i> : <i className="icon-downward-arrow"></i>}
              <span className="perc">{data.one && Math.abs(data.one.delta_percent)}%</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="col-lg-3 col-md-6 col-sm-6 ">
        <Link to={{
          pathname: (data.two && (data.two.cta !== undefined)) ? routingConstants.SEARCH : '',
          cta: data.two && data.two.cta
        }}>
          <div className={`card-box missed-appor-box ${(data.two && data.two.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
            {/* <!-- <span className="oval-span"></span> --> */}
            <h5 className="toalHeading"><span> {title.two} </span></h5>
            <h2> {data.two && data.two.current_count} </h2>
            <div className="missed-icon">
              <img src={imageUrl.two} alt="icon" />
            </div>
            <div className="upDownPercent">
              {(data.two && data.two.delta_percent > 0) ? <i className="icon-upward-arrow"></i> : <i className="icon-downward-arrow"></i>}
              <span className="perc">{data.two && Math.abs(data.two.delta_percent)}%</span>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-lg-3 col-md-6 col-sm-6 ">
        <Link to={{
          pathname: (data.three && (data.three.cta !== undefined)) ? routingConstants.SEARCH : '',
          cta: data.three && data.three.cta
        }}>
          <div className={`card-box ${props.dashboard === 'customer' ? 'rogue-box' : 'nagative-box'} ${(data.three && data.three.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
            {/* <!-- <span className="oval-span"></span> --> */}
            <h5 className="toalHeading"><span> {title.three} </span></h5>
            <h2> {data.three && data.three.current_count} </h2>
            <div className="nagative-icon">
              <img src={imageUrl.three} alt="icon" />
            </div>
            <div className="upDownPercent">
              {(data.three && data.three.delta_percent > 0) ? <i className="icon-upward-arrow"></i> : <i className="icon-downward-arrow"></i>}
              <span className="perc">{data.three && Math.abs(data.three.delta_percent)}%</span>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-lg-3 col-md-6 col-sm-6 ">
        <Link to={{
          pathname: (data.four && (data.four.cta !== undefined)) ? routingConstants.SEARCH : '',
          cta: data.four && data.four.cta
        }}>
          <div className={`card-box ${props.dashboard === 'customer' ? 'nagative-box' : 'rogue-box'} ${(data.four && data.four.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>

            <h5 className="toalHeading"><span> {title.four} </span></h5>
            <h2> {data.four && data.four.current_count} </h2>
            <div className="rogue-icon">
              <img src={imageUrl.four} alt="icon" />
            </div>
            <div className="upDownPercent">
              {(data.four && data.four.delta_percent > 0) ? <i className="icon-upward-arrow"></i> : <i className="icon-downward-arrow"></i>}
              <span className="perc">{data.four && Math.abs(data.four.delta_percent)}%</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    conversation_total: state.dashboardInsightReducer.conversation_total,
    conversation_opportunity: state.dashboardInsightReducer.conversation_opportunity,
    conversation_purchase_stage: state.dashboardInsightReducer.conversation_purchase_stage,
    conversation_pricing_mention: state.dashboardInsightReducer.conversation_pricing_mention,
    reps_total: state.dashboardInsightReducer.reps_total,
    reps_followups: state.dashboardInsightReducer.reps_followups,
    reps_rogue: state.dashboardInsightReducer.reps_rogue,
    reps_dead_air: state.dashboardInsightReducer.reps_dead_air,
    customer_total: state.dashboardInsightReducer.customer_total,
    customer_total_negative: state.dashboardInsightReducer.customer_total_negative,
    customer_total_problem: state.dashboardInsightReducer.customer_total_problem,
    customer_total_price_sensitive: state.dashboardInsightReducer.customer_total_price_sensitive
  }
}

const mapActionToProps = {
  LoadConversationTotal: dashboardInsight.LoadConversationTotal,
  LoadConversationOpportunity: dashboardInsight.LoadConversationOpportunity,
  LoadConversationPurchaseStage: dashboardInsight.LoadConversationPurchaseStage,
  LoadConversationPricingMention: dashboardInsight.LoadConversationPricingMention,
  LoadRepsTotal: dashboardInsight.LoadRepsTotal,
  LoadRepsFollowUps: dashboardInsight.LoadRepsFollowUps,
  LoadRepsRogue: dashboardInsight.LoadRepsRogue,
  LoadRepsDeadAir: dashboardInsight.LoadRepsDeadAir,
  LoadCustomerTotal: dashboardInsight.LoadCustomerTotal,
  LoadCustomerTotalNegative: dashboardInsight.LoadCustomerTotalNegative,
  LoadCustomerTotalProblem: dashboardInsight.LoadCustomerTotalProblem,
  LoadCustomerTotalPriceSensitive: dashboardInsight.LoadCustomerTotalPriceSensitive
}


export default connect(mapStateToProps, mapActionToProps)(InsightCards);
