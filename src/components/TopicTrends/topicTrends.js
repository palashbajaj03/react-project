/* Info: This file is for Topic Trends Component */
/* Created on {20-01-20} By {Siddhant Chopra}*/
/* Last Modified on {21-01-20} By {Siddhant Chopra}*/

import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { connect } from 'react-redux';
import moment from 'moment';
import { dashboardAction } from '../../actions/dashboardAction';
import { dashboardInsight } from '../../actions/dashboardInsightAction';
import { routingConstants } from '../../constants'
import { Link } from 'react-router-dom';
import { searchAction } from '../../actions/searchAction';
import Scrollbar from 'react-scrollbars-custom';

Highcharts.setOptions({
  time: {
    useUTC: false
  },

})

const TopicTrends = props => {
  let [toggle, updateToggle] = useState(false)
  let [lastSelectedTopic, updateLastSelectedTopic] = useState('competition')
  let [lastSelectedId, updateLastSelectedId] = useState('')
  let [topics, updateTopics] = useState({
    options: {
      chart: {
        type: 'areaspline',
        // styledMode: false
      },
      legend: {
        enabled: true
      },
      credits: {
        enabled: false
      },
      title: {
        text: null,
      },
      yAxis: {
        type: 'linear',
        tickInterval: 5,
        title: {
          enabled: false
        }
      },
    }
  })

  useEffect(() => {
    const { client_id, emailid } = props.user
    const { date_filter, plugin, topics } = props
    let val = props.topics !== undefined && props.topics !== false && props.topics.filter(data => data.name === titleCase(lastSelectedTopic))
    let id = val !== undefined && val.length > 0 && val[0].id
    id !== false && lastSelectedId.length > 0 && id !== lastSelectedId && updateLastSelectedId(id)
    plugin !== undefined && plugin.length > 0 && topics !== undefined && topics.length > 0 && lastSelectedId.length !== '' && props.loadTopicTrends(client_id, emailid, date_filter.from, date_filter.to, id, plugin)
  }, [lastSelectedId, props.date_filter.from, props.date_filter.to, props.plugin, props.topics])

  useEffect(() => {
    let { xAxis, series,tooltip } = updateGraph();
    let options = {
      ...topics.options,
      xAxis,
      series,
      tooltip
    };
    updateTopics({
      ...topics,
      ...options
    })
  }, [props.topictrends, toggle])

  const updateGraph = _ => {
    if (!toggle) {
      let filteredData = props.topictrends && props.topictrends.filter(data => data.period === "current")
      let categories = filteredData && filteredData.map((data) => { return moment(data.date).format('MMM DD') })
      let cta = []
      filteredData && filteredData.forEach(data => {
        if (data.cta) {
          cta.push(data.cta)
        }
      })
      if (cta.length > 0) {
        localStorage.setItem('ctaTopicTrends', JSON.stringify(cta));
      }
      return {
        xAxis: {
          categories,
          labels: {
            formatter: function () {
              if (cta.length > 0) {
                return `<a href="/search?val=${this.pos}">${this.value}<a>`
              }
              return this.value
            }
          },
        },
        tooltip: {
          formatter: function () {
            return "<b>"+titleCase(lastSelectedTopic.replace("_", " "))+" :"+this.point.y;
          }
        },
        series: [
          {
            name: 'Current',
            data: filteredData && filteredData.map((data) => { return data.count }),
            color: '#555ff6',
            fillColor: {
              linearGradient: [0, 0, 0, 300],
              stops: [
                [0, '#555ff6'],
                [1, '#555ff6']
              ]
            }
          }
        ]
      }
    } else {
      let filteredData1 = props.topictrends && props.topictrends.filter(data => data.period === "previous")
      let filteredData2 = props.topictrends && props.topictrends.filter(data => data.period === "current")
      // let categories1 = filteredData1 && filteredData1.map((data) => { return moment(data.date).format('MMM DD') })
      let categories2 = filteredData2 && filteredData2.map((data) => { return moment(data.date).format('MMM DD') })
      let cta = []
      filteredData2 && filteredData2.forEach(data => {
        if (data.cta) {
          cta.push(data.cta)
        }
      })
      if (cta.length > 0) {
        localStorage.setItem('ctaTopicTrends', JSON.stringify(cta));
      }
      return {
        xAxis: {
          categories2,
          labels: {
            formatter: function () {
              if (cta.length > 0) {
                return `<a href="/search?val=${this.pos}">${this.value}<a>`
              }
              return this.value
            }
          },
        },
        tooltip: {
          formatter: function () {
            return "<b>"+titleCase(lastSelectedTopic.replace("_", " "))+" :"+this.point.y;
          }
        },
        series: [
          {
            name: "Previous",
            data: filteredData1 && filteredData1.map((data) => { return data.count }),
            color: '#38a7ed',
            fillColor: {
              linearGradient: [0, 0, 0, 300],
              stops: [
                [0, '#38a7ed'],
                [1, '#38a7ed']
              ]
            }
          },
          {
            name: "Current",
            data: filteredData2 && filteredData2.map((data) => { return data.count }),
            color: '#555ff6',
            fillColor: {
              linearGradient: [0, 0, 0, 300],
              stops: [
                [0, '#555ff6'],
                [1, '#555ff6']
              ]
            }
          }
        ]
      }
    }
  }

  const onDropDownTopic = e => {
    let lst = e.target.id
    let lstVAL = e.target.value
    updateLastSelectedTopic(lst)
    updateLastSelectedId(lstVAL)
  }

  const togglePrevious = e => {
    let val = toggle
    updateToggle(!val)
  }

  const titleCase = (str) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-md-12">
          <div className="conversation-graph bordered pad0 padtp0">
            <div className="Rep-wise-header">
              <div className="headings">
                <h4 className="component-title">Topic Trends</h4>
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
            <div className="graph-img mb15 pad15">
              <HighchartsReact highcharts={Highcharts} options={topics} />
            </div>
            <div className="customize-bar-row">
              <div className="customizable-btn">
                <div className="comp-btn">
                  <button className={toggle ? 'toggleActive' : ''} onClick={togglePrevious}>Compare
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
    topictrends: state.dashboardInsightReducer.topictrends,
    dateRange: state.searchReducer.dateRange
  }
}

const mapActionToProps = {
  loadTopicTrends: dashboardInsight.LoadTopicTrends,
  setDatePicker: searchAction.setDatePicker
}

export default connect(mapStateToProps, mapActionToProps)(TopicTrends);