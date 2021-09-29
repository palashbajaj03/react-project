/* Info: This file is for Custom Topics Component */
/* Created on {22-01-20} By {Pratul Majumdar}*/
/* Last Modified on {23-01-20} By {Pratul Majumdar}*/

import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions';
import { Link } from 'react-router-dom';
import Scrollbar from 'react-scrollbars-custom'
import { routingConstants } from '../../constants'


const ConversationCustomTopics = (props) => {
    useEffect(() => {
        const { client_id, emailid } = props.user;
        (props.date_filter.from && props.date_filter.to && props.plugin.length > 0) && props.LoadCustomTopicsBlock(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin)

    }, [props.plugin, props.date_filter.from, props.date_filter.to, props.dashboard])
    const titleCase = (str) => {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    const getUniqueItems = (topics) => {
        let items = []
        topics.length > 0 && topics.map((data) => {
            items.push(data.heading)
        })
        const customTopics = topics.length > 0 && topics.sort((a, b) => Number(b.current_count) - Number(a.current_count))
        let uniqueTopics = [...new Set(items)]
        return <div className="row" >
            {
                uniqueTopics.map((data, index) => {
                    let c = 0
                    return <React.Fragment key={index}>
                        <div className="col-lg-4 col-md-4 col-sm-12" >
                            <div className="custom-component mt25 total-expert-keyword pad0">
                                <div className="total-expert-keyword-head">
                                    <h4 className="component-title"> Topics: {titleCase(data)} </h4>
                                </div>
                                <div className="total-expert-body common-body-top mt20 pad0">
                                    <Scrollbar>
                                        <div className="scroll-wrapper">
                                            {
                                                customTopics.map((d, i) => {
                                                    return <React.Fragment key={i}>{
                                                        d.heading === data ? <Link to={{
                                                            pathname: routingConstants.SEARCH,
                                                            cta: d.cta
                                                        }}>
                                                            <div className="recent-deatil-row">
                                                                <div className="recent-deatil">
                                                                    <div className="conver-oval mr15">{c = c + 1}</div>
                                                                    <div className="total-expert-text">
                                                                        <h5>{titleCase(d.keyword)}</h5>
                                                                    </div>
                                                                </div>
                                                                <div className="total-expert-result">
                                                                    <span className="competition-text"> {d.current_count} </span>
                                                                    <div className={`upDownPercent without-bg ${(d.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                                                                        {(d.delta_percent > 0) ? <i className="icon-upward-arrow"></i> : <i className="icon-downward-arrow"></i>}
                                                                        <span className="perc">{d.delta_percent}%</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link> : ""}</React.Fragment>
                                                })
                                            }
                                        </div>
                                    </Scrollbar>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                })
            }
        </div>
    }
    return (
        <React.Fragment>
            {props.conversation_custom_topics && getUniqueItems(props.conversation_custom_topics)}
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    return {
        user: state.authentication.user,
        conversation_custom_topics: state.dashboardInsightReducer.custom_topics && state.dashboardInsightReducer.custom_topics
    }
}

const mapActionToProps = {
    LoadCustomTopicsBlock: dashboardInsight.LoadCustomTopicsBlock
}

export default connect(mapStateToProps, mapActionToProps)(ConversationCustomTopics);