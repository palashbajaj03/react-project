import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions';
import { Link } from 'react-router-dom'
import { routingConstants } from '../../constants';

const SentimentLevelCard = (props) => {
  let [data, setData] = useState({});
  const Total_Conversation = data.one && (data.one.positive + data.one.neutral + data.one.negative)
  useEffect(() => {
    const { client_id, emailid } = props.user;
    switch (props.dashboard) {
      case 'representative':
        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadRepsSentimentLevel(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);
        break;
      case 'customer':
        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadCustomerSentimentLevel(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin);
        break;
    }

  }, [props.plugin, props.date_filter.from, props.date_filter.to, props.dashboard])

  useEffect(() => {
    switch (props.dashboard) {
      case 'customer':
        setData({
          one: props.customer_sentiment_level,
        })
        break;
      case 'representative':
        setData({
          one: props.reps_sentiment_level,
        })
    }
  }, [props.reps_sentiment_level, props.customer_sentiment_level])

  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 col-sm-12">
        <div className="custom-component total-expert-mentions">
          <div>
            <h4 className="component-title"> Sentiment Level of {Total_Conversation} conversations </h4>
            <p className="component-title-text"> Number of conversations of different Sentiment </p>
          </div>
          <div className="total-expert-body mt25">
            <div className="round-cover">
              <Link
                to={{
                  pathname:routingConstants.SEARCH,
                  cta:data.one&&data.one.positive_cta
                }}
              >
                <div className="round1">
                  <div className="rounds-img">
                    <img src="/static/images/happy-smiley.svg" width="65px" />
                  </div>
                  <div className="round-text">
                    <p>Positive</p>
                    <span>{data.one && data.one.positive}</span>
                  </div>
                </div>
              </Link>
              <Link
                to={{
                  pathname:routingConstants.SEARCH,
                  cta:data.one&&data.one.neutral_cta
                }}
              >
              <div className="round2">
                <div className="rounds-img">
                  <img src="/static/images/neutral-smiley.svg" width="90px" />
                </div>
                <div className="round-text">
                  <p>Neutral</p>
                  <span>{data.one && data.one.neutral}</span>
                </div>
              </div>
              </Link>
              <Link
                to={{
                  pathname:routingConstants.SEARCH,
                  cta:data.one&&data.one.negative_cta
                }}
              >
              <div className="round3">
                <div className="rounds-img">
                  <img src="/static/images/sad-smiley.svg" width="65px" />
                </div>
                <div className="round-text">
                  <p>Negative</p>
                  <span>{data.one && data.one.negative}</span>
                </div>
              </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    reps_sentiment_level: state.dashboardInsightReducer.reps_sentiment_level,
    customer_sentiment_level: state.dashboardInsightReducer.customer_sentiment_level
  }
}

const mapActionToProps = {
  LoadRepsSentimentLevel: dashboardInsight.LoadRepsSentimentLevel,
  LoadCustomerSentimentLevel: dashboardInsight.LoadCustomerSentimentLevel
}


export default connect(mapStateToProps, mapActionToProps)(SentimentLevelCard);
