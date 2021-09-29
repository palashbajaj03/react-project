/* Info: This file is for Conversation Graph Component */
/* Created on {3-07-19} By {Siddhant Chopra}*/
/* Modified on {31-01-20} By {Pratul Majumdar}*/

import React, { useEffect, Component, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { dashboardInsight } from '../../actions'
import { routingConstants, timezoneDateCalculator } from "../../constants";
import './ConversationGraph.css';

const ConversationGraph = (props) => {
  let [toggle, updateToggle] = useState(false)
  let [convGraph, updateConvGraph] = useState({
    options: {

      chart: {
        type: 'areaspline',
        // styledMode: true
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Conversations',
        align: 'left',
        margin: 40
      },
      // subtitle: {
      //   text: 'Total number of conversations by your reps',
      //   align: 'left',
      // },
      legends: {

      },
      yAxis: {
        type: 'linear',
        //tickInterval: 70,
        title: {
          enabled: false
        },
        startOnTick: true,
        endOnTick: true
      },
      defs: {
        gradient0: {
          tagName: 'linearGradient',
          id: 'gradient-0',
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1,
          children: [{
            tagName: 'stop',
            offset: 0
          }, {
            tagName: 'stop',
            offset: 1
          }]
        },
        gradient1: {
          tagName: 'linearGradient',
          id: 'gradient-1',
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1,
          children: [{
            tagName: 'stop',
            offset: 0
          }, {
            tagName: 'stop',
            offset: 1
          }]
        }
      }
    }

  })
  useEffect(() => {
    const { client_id, emailid } = props.user;
    // let date_from = moment().subtract(7, 'days').format("YYYY-MM-DD") + "T00:00:00Z";
    // let date_to = moment().subtract(1, 'days').format("YYYY-MM-DD") + "T23:59:59Z";
    let time = timezoneDateCalculator('Last 7 Days', props.user.timezone)
    props.plugins && props.plugins.length > 0 && props.LoadConversationDasboardGraph(client_id, emailid, time.from, time.to, props.plugins && props.plugins);
  }, [props.plugins])

  useEffect(() => {

    let { xAxis, series, tooltip } = updateGraph();

    let options = {
      ...convGraph.options,
      xAxis,
      
      series,
      tooltip
    };
    updateConvGraph({
      ...convGraph,
      ...options
    })
  }, [props.dashboard_graph, toggle])

  const updateGraph = () => {
    
    if (!toggle) {
      let current_graph_enabled = props.graph_data && props.graph_data.filter((data) => {
        return data.period === 'current'
      })
      let categories = current_graph_enabled && current_graph_enabled.map(data => moment(data.date).format('MMM DD'))
      let tempVal = []
        current_graph_enabled && current_graph_enabled.map(data => tempVal.push(data.count))
        let maxValue = current_graph_enabled && Math.max(...tempVal)
      return {
        xAxis: {
          categories,
          labels: {
            formatter: function () {
              return this.value
            }
          },
        },
       
        tooltip: {
          formatter: function () {
            return '<b>Total Conversations: '+this.point.y;
          }
        },
        series: [
          {
            name: "Current",
            marker: {
              // enabled
            },
            data: current_graph_enabled && current_graph_enabled.map(data => data.count),
            color: '#555ff6',
            fillColor: {
              linearGradient: [0, 0, 0, 300],
              stops: [
                [0, '#555ff6'],
                [1, '#555ff6']
              ]
            }
          },
        ]
      }
    }
    else {
      let current_graph_enabled1 = props.graph_data && props.graph_data.filter((data) => {
        return data.period === 'previous'
      })
      let current_graph_enabled2 = props.graph_data && props.graph_data.filter((data) => {
        return data.period === 'current'
      })
      let categories = current_graph_enabled2 && current_graph_enabled2.map(data => moment(data.date).format('MMM DD'))

      let tempVal = []
      current_graph_enabled2 && current_graph_enabled2.map(data => tempVal.push(data.count))
      let maxValue = current_graph_enabled2 && Math.max(...tempVal)
      return {
    
        xAxis: {
          categories,
          labels: {
            formatter: function () {
              return this.value
            }
          },
        },
        tooltip: {
          formatter: function () {
            return '<b>Total Conversations: '+this.point.y;
          }
        },
        series: [
          {
            name: "Current",
            marker: {
              // enabled
            },
            data: current_graph_enabled2 && current_graph_enabled2.map(data => data.count),
            color: '#555ff6',
            fillColor: {
              linearGradient: [0, 0, 0, 300],
              stops: [
                [0, '#555ff6'],
                [1, '#555ff6']
              ]
            }
          },
          {
            name: "Previous",
            marker: {
              // enabled
            },
            data: current_graph_enabled1 && current_graph_enabled1.map(data => data.count),
            color: '#38a7ed',
            fillColor: {
              linearGradient: [0, 0, 0, 300],
              stops: [
                [0, '#38a7ed'],
                [1, '#38a7ed']
              ]
            }
          },
        ]
      }
    }
  }

  const controlToggle = e => {
    let tog = !toggle
    updateToggle(tog)
  }

  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 col-md-12">
        <div className="conversation-graph bordered pad0">
          <div className="graph-img pad15">
            <HighchartsReact highcharts={Highcharts} options={convGraph} />
          </div>
          {<div className="customize-bar-row">
            <div className="customizable-btn">
              <div className="comp-btn">
                <button className={toggle ? 'toggleActive' : ''} onClick={controlToggle}>Compare
                         <div className="in-out-btn">
                    <span className="in-out-ball"></span>
                  </div>
                </button>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, props) => ({
  user: state.authentication.user,
  dashboard_graph: state.dashboardInsightReducer.conversation_dashboard_graph,
  graph_data: state.dashboardInsightReducer.conversation_dashboard_graph && state.dashboardInsightReducer.conversation_dashboard_graph.graph_data,
  props
})

const mapActionToProps = {
  LoadConversationDasboardGraph: dashboardInsight.LoadConversationDasboardGraph
}

export default connect(mapStateToProps, mapActionToProps)(ConversationGraph);