// import React, { Component } from 'react'
import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import addTreemapModule from 'highcharts/modules/treemap';
import addHeatmapModule from 'highcharts/modules/heatmap';
// import moment from 'moment'
import Scrollbar from 'react-scrollbars-custom';

const ConversationTopicTreeMap = (props) => {
    addTreemapModule(Highcharts);
    addHeatmapModule(Highcharts);
    let [lastSelectedTopic, updateLastSelectedTopic] = useState('competition')
    let [lastSelectedId, updateLastSelectedId] = useState('')
    let [tempTop, updateTempTop] = useState([])
    let [toggle, updateToggle] = useState(true)
    let [toggleCompare, updateToggleCompare] = useState(false)
    let [treeMap, updateTreeMap] = useState({
        series: [{
            type: 'treemap',
            // styledMode: true,
            // allowDrillToNode: true,
            // layoutAlgorithm: 'squarified',
            data: []
        }],
        title: {
            text: null,
        },
        credits: {
            enabled: false
        },
        colorAxis: {
            minColor: '#38a7ed',
            maxColor: '#ffffff'
        }
    })

    useEffect(() => {
        const { client_id, emailid } = props.user
        const { date_filter, plugin, topics } = props
        let val = props.topics !== undefined && props.topics !== false && props.topics.filter(data => data.name === titleCase(lastSelectedTopic))
        let id = val !== undefined && val.length > 0 && val[0].id
        id !== false && lastSelectedId.length > 0 && id !== lastSelectedId && updateLastSelectedId(id)
        plugin !== undefined && plugin.length > 0 && topics !== undefined && topics.length > 0 && lastSelectedId.length !== '' && props.LoadTopicsBlockConvTree(client_id, emailid, date_filter.from, date_filter.to, id, plugin)
    }, [lastSelectedId, props.date_filter.from, props.date_filter.to, props.plugin, props.topics])

    useEffect(() => {
        let { series, top } = updateGraph();
        top = top.length > 0 ? top : []
        updateTempTop(top)
        top.length > 0 && updateToggle(false)
        updateTreeMap({
            ...treeMap,
            series
        })

    }, [props.conversation_TreeMap, toggleCompare])

    const titleCase = (str) => {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    const updateGraph = () => {
        if (!toggleCompare) {
            let top = props.conversation_TreeMap !== undefined && props.conversation_TreeMap.filter((data) => {
                return data.current_count !== 0 && data
            }).map((dat) => {
                return {
                    colorValue: dat.current_count,
                    value: dat.current_count,
                    name: titleCase(dat.keyword),
                }
            })

            props.conversation_TreeMap !== undefined && setInterval(() => {
                window.jQuery('.treemap .highcharts-point').removeClass('highcharts-color-0')
            }, 100)

            return {
                top,
                series: [
                    {
                        type: 'treemap',
                        layoutAlgorithm: 'squarified',
                        data: top
                    },
                ]
            }
        } else {
            let top = props.conversation_TreeMap !== undefined && props.conversation_TreeMap.filter((data) => {
                return data.previous_count !== 0 && data
            }).map((dat) => {
                return {
                    colorValue: dat.previous_count,
                    value: dat.previous_count,
                    name: titleCase(dat.keyword),
                }
            })

            props.conversation_TreeMap !== undefined && setInterval(() => {
                window.jQuery('.treemap .highcharts-point').removeClass('highcharts-color-0')
            }, 100)

            return {
                top,
                series: [
                    {
                        type: 'treemap',
                        layoutAlgorithm: 'squarified',
                        data: top
                    },
                ]
            }
        }

    }
    const controlToggle = e => {
        let tog = !toggleCompare
        updateToggleCompare(tog)
    }
    const onDropDownTopic = e => {
        let lst = e.target.id
        let lstVAL = e.target.value
        updateLastSelectedTopic(lst)
        updateLastSelectedId(lstVAL)
    }

    Highcharts.setOptions({
        time: {
            useUTC: false
        },
        colors: [
            '#7cb5ec',
            '#38a7ed'
        ]
    })

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="custom-component total-expert-mentions topics pad0 ttm overflow-visible">
                        <div className="total-expert-mentions-head set-flex justify-space-btwn">
                            <div className="left-heading">
                                <h4 className="component-title"> Topics TreeMap</h4>
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

                            {/* <div className="right-btn">
                                <div className="dropdown">
                                    <button type="button" className="btn selectdropdwon dropdown-toggle " data-toggle="dropdown">
                                        {topicsName === '' ? props.topics && props.topics[0].name : topicsName}
                                    </button>
                                    <div className="dropdown-menu pad0 custom-transform">
                                        {
                                            props.topics && props.topics.map((data, index) => {
                                                return data.type !== 'signals' && data.value.length > 0 && <button id={data.id} key={index} className="dropdown-item set-anchor"
                                                    onClick={handleTopicsSelection} data-name={data.name}
                                                >{data.name}</button>
                                            })
                                        }
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div className="total-expert-body common-body-top mt20 pad0 mb3">
                            <div className="top-traits-chart  treemap">
                                {
                                    tempTop.length > 0 ? <HighchartsReact highcharts={Highcharts} options={treeMap} />
                                        : toggle ? <div className="spinner-token set-flex set-center set-height-432">
                                            <img src="/static/images/Eclipse-1s-100px.gif" />
                                        </div> : <div className="set-flex set-center set-height-432">No Data Available</div>
                                }
                            </div>
                        </div>
                        <div className="customize-bar-row">
                            <div className="customizable-btn">
                                <div className="comp-btn">
                                    <button className={toggleCompare ? 'toggleActive' : ''} onClick={controlToggle}>Compare
                         <div className="in-out-btn">
                                            <span className="in-out-ball"></span>
                                        </div>
                                    </button>
                                </div>
                            </div>
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
        conversation_TreeMap: state.dashboardInsightReducer.conversation_TreeMap
    }
}

const mapActionToProps = {
    LoadConversationBlocks: dashboardInsight.LoadConversationBlocks,
    // loadTopicList: configureAction.loadTopicList,
    LoadTopicsBlockConvTree: dashboardInsight.LoadTopicsBlockConvTree
}

export default connect(mapStateToProps, mapActionToProps)(ConversationTopicTreeMap);