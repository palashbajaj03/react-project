// import React, { Component } from 'react'
import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions';
import { Link } from 'react-router-dom';
import Scrollbar from 'react-scrollbars-custom'
import { routingConstants } from '../../constants'
import { configureAction } from '../../actions'

const ConversationPredefinedTopics = (props) => {

  let [lastSelectedTopic, updateLastSelectedTopic] = useState('competition')
  let [lastSelectedId, updateLastSelectedId] = useState('')

  useEffect(() => {
    const { client_id, emailid } = props.user
    const { date_filter, plugin, topics } = props
    let val = props.topics !== undefined && props.topics !== false && props.topics.filter(data => data.name === titleCase(lastSelectedTopic))
    let id = val !== undefined && val.length > 0 && val[0].id
    id !== false && lastSelectedId.length > 0 && id !== lastSelectedId && updateLastSelectedId(id)
    plugin !== undefined && plugin.length > 0 && topics !== undefined && topics.length > 0 && lastSelectedId.length !== '' && props.LoadTopicsBlock(client_id, emailid, date_filter.from, date_filter.to, id, plugin)
  }, [lastSelectedId, props.date_filter.from, props.date_filter.to, props.plugin, props.topics])


  const titleCase = (str) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  const onDropDownTopic = e => {
    let lst = e.target.id
    let lstVAL = e.target.value
    updateLastSelectedTopic(lst)
    updateLastSelectedId(lstVAL)
  }

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="custom-component total-expert-mentions topics overflow-visible pad0">
            <div className="total-expert-mentions-head set-flex justify-space-btwn">
              <div className="left-heading">
                <h4 className="component-title"> Topics</h4>
                {/* <p className="component-title-text fix-40"> Number of conversations with competition mentioned </p> */}
              </div>
              <div className="btn-group">
                {<button type="button" className="btn selectdropdwon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {titleCase(lastSelectedTopic).replace("_", " ")}
                </button>}
                <div className="dropdown-menu graph-dropdown set-custom-size-dropdown" onClick={onDropDownTopic} style={{ width: "100%" }}>
                  <Scrollbar style={{height:'260px'}}>

                  {props.topics && props.topics.map((data, index) => {
                    return <button key={index} className="dropdown-item" value={data.id} id={data.name}>{data.name}</button>
                  })}
                  </Scrollbar>
                </div>
              </div>

            </div>
            <div className="total-expert-body common-body-top mt20 pad0">
              {/*<Scrollbars
                className="scroll" style={{ minHeight: "320px", height: "auto" }}
                id="myDivId"
                renderTrackVertical={props => <div className="track-vertical" />}
                renderThumbVertical={props => <div className="thumb-horizontal" />}
              >*/}
              <Scrollbar>
                <div className="scroll-wrapper">
                  {
                    props.conversationTopics && props.conversationTopics.map((data, index) => {
                      return <Link key={index}
                        to={{
                          pathname: routingConstants.SEARCH,
                          cta: data.cta
                        }}><div className="recent-deatil-row">
                          <div className="recent-deatil">
                            <div className="conver-oval mr15">{index + 1}</div>
                            <div className="total-expert-text">
                              <h5> {titleCase(data.keyword)} </h5>
                              {/* <small className="total-expert-small-text"> Occured in 60 conversations </small> */}

                            </div>
                          </div>
                          <div className="total-expert-result">
                            <span className="competition-text"> {data.current_count}</span>
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
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    // readTopics: state.configureReducer.readTopics,
    conversationTopics: state.dashboardInsightReducer.conversationTopics
  }
}

const mapActionToProps = {
  LoadConversationBlocks: dashboardInsight.LoadConversationBlocks,
  // loadTopicList: configureAction.loadTopicList,
  LoadTopicsBlock: dashboardInsight.LoadTopicsBlock
}

export default connect(mapStateToProps, mapActionToProps)(ConversationPredefinedTopics);