import React, { Component, Fragment } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { connect } from 'react-redux';

import { dashboardInsight } from '../../actions';

class Tone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardType: "tone",
      graph: "graph_data",
      toggle: false,
      options: {
        chart: {
          type: 'areaspline',
          // styledMode: true
        },
        legend: {
          enabled: false
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
    }
  }

  componentDidMount() {
    const { client_id, emailid } = this.props.user;
    const { date_filter, plugin } = this.props
    if (plugin && plugin.length > 0) {
      this.props.LoadCustomerTone(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { plugin, date_filter } = prevProps;
    if ((plugin !== this.props.plugin) || (date_filter.from !== this.props.date_filter.from) || (date_filter.to !== this.props.date_filter.to)) {
      const { client_id, emailid } = this.props.user;
      const { date_filter, plugin } = this.props
      this.props.LoadCustomerTone(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }

    if ((this.props.graph_data !== prevProps.graph_data) || (this.state.graph !== prevState.graph) || (this.state.cardType !== prevState.cardType)) {
      const { xAxis, series } = this.updateGraph();
      this.setState(() => {
        return {
          options: {
            ...this.state.options,
            xAxis,
            series
          }
        }
      })
    }
  }

  updateGraph() {
    let current_graph_enabled = this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
      return data.period === 'current'
    })
    let categories = this.state.graph === 'graph_data' ?this.props[this.state.graph] !== undefined &&  this.props[this.state.graph].filter((data) => {
      if (data.period === "current") {
        return data.new_date = moment(data.date).format('MMM DD')
      }
    }).map(data => data.new_date) : this.state.graph === 'week' ? this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
      if (data.period === 'current') {
        return data
      }
    }).map(data => "Week " + data.week) : this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
      if (data.period === 'current') {
        return data
      }
    }).map(data => data.year_mon)
    if (!this.state.toggle) {
      if (this.state.cardType === 'tone') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        return {
          xAxis: {
            categories,
            labels: {
              formatter: function () {
                return this.value
              }
            },
          },
          series: [
            {
              name: 'Current',
              marker: {
                enabled
              },
              data: this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
                if (value.period === 'current') {
                  return value
                }
              }).map(data => data.tone),
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
      } else if (this.state.cardType === 'praise') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        return {
          xAxis: {
            categories,
            labels: {
              formatter: function () {
                return this.value
              }
            },
          },
          series: [
            {
              name: 'Current',
              marker: {
                enabled
              },
              data: this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
                if (value.period === 'current') {
                  return value
                }
              }).map(data => data.praise),
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
      } else if (this.state.cardType === 'problem') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        return {
          xAxis: {
            categories,
            labels: {
              formatter: function () {
                return this.value
              }
            },
          },
          series: [
            {
              name: 'Current',
              marker: {
                enabled
              },
              data:this.props[this.state.graph] !== undefined &&  this.props[this.state.graph].filter(value => {
                if (value.period === 'current') {
                  return value
                }
              }).map(data => data.problem),
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
      } else if (this.state.cardType === 'suggestions') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        return {
          xAxis: {
            categories,
            labels: {
              formatter: function () {
                return this.value
              }
            },
          },
          series: [
            {
              name: 'Current',
              marker: {
                enabled
              },
              data:this.props[this.state.graph] !== undefined &&  this.props[this.state.graph].filter(value => {
                if (value.period === 'current') {
                  return value
                }
              }).map(data => data.suggestion),
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
    } else {
      if (this.state.cardType === 'tone') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        return {
          xAxis: {
            categories,
            labels: {
              formatter: function () {
                return this.value
              }
            },
          },
          series: [
            {
              name: 'Current',
              marker: {
                enabled
              },
              data: this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
                if (value.period === 'current') {
                  return value
                }
              }).map(data => data.tone),
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
              name: 'Previous',
              marker: {
                enabled
              },
              data: this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
                if (value.period === 'previous') {
                  return value
                }
              }).map(data => data.tone),
              color: '#38a7ed',
              fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                  [0, '#38a7ed'],
                  [1, '#38a7ed']
                ]
              }
            }
          ]
        }
      } else if (this.state.cardType === 'praise') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        return {
          xAxis: {
            categories,
            labels: {
              formatter: function () {
                return this.value
              }
            },
          },
          series: [
            {
              name: 'Current',
              marker: {
                enabled
              },
              data: this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
                if (value.period === 'current') {
                  return value
                }
              }).map(data => data.praise),
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
              name: 'Previous',
              marker: {
                enabled
              },
              data: this.props[this.state.graph] !== undefined &&  this.props[this.state.graph].filter(value => {
                if (value.period === 'previous') {
                  return value
                }
              }).map(data => data.praise),
              color: '#38a7ed',
              fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                  [0, '#38a7ed'],
                  [1, '#38a7ed']
                ]
              }
            }
          ]
        }
      } else if (this.state.cardType === 'problem') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        return {
          xAxis: {
            categories,
            labels: {
              formatter: function () {
                return this.value
              }
            },
          },
          series: [
            {
              name: 'Current',
              marker: {
                enabled
              },
              data: this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
                if (value.period === 'current') {
                  return value
                }
              }).map(data => data.problem),
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
              name: 'Previous',
              marker: {
                enabled
              },
              data: this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
                if (value.period === 'previous') {
                  return value
                }
              }).map(data => data.problem),
              color: '#38a7ed',
              fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                  [0, '#38a7ed'],
                  [1, '#38a7ed']
                ]
              }
            }
          ]
        }
      } else if (this.state.cardType === 'suggestions') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        return {
          xAxis: {
            categories,
            labels: {
              formatter: function () {
                return this.value
              }
            },
          },
          series: [
            {
              name: 'Current',
              marker: {
                enabled
              },
              data: this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
                if (value.period === 'current') {
                  return value
                }
              }).map(data => data.suggestion),
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
              name: 'Previous',
              marker: {
                enabled
              },
              data:this.props[this.state.graph] !== undefined &&  this.props[this.state.graph].filter(value => {
                if (value.period === 'previous') {
                  return value
                }
              }).map(data => data.suggestion),
              color: '#38a7ed',
              fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                  [0, '#38a7ed'],
                  [1, '#38a7ed']
                ]
              }
            }
          ]
        }
      }
    }
  }

  changeView = (e) => {
    const graph = e.target.value;
    this.setState(({ graph }))
  }

  changeCard = (e) => {
    let cardType = e.target.value;
    this.setState(({ cardType }))
  }

  togglePrevious = (e) => {
    if(this.props.customer_tone){

      this.setState(prevState => ({
        toggle: !prevState.toggle
      }), () => {
        if (this.state.toggle) {
          const { xAxis, series } = this.updateGraph();
          this.setState(() => {
            return {
              options: {
                ...this.state.options,
                xAxis,
                series
              }
            }
          })
        } else {
          const { xAxis, series } = this.updateGraph();
          this.setState(() => {
            return {
              options: {
                ...this.state.options,
                xAxis,
                series
              }
            }
          })
        }
      })
    }
  }

  render() {
    const { customer_tone } = this.props
    return (
      <div className="conversation-graph all-calc-graph mt25" style={{ position: "relative" }}>
        <div className="topLeftCorner sub4 negmt20">
          <button className={`${this.state.cardType === 'tone' ? 'topLeftBtn graph-tabBtn' : 'topLeftBtn'}`} onClick={this.changeCard} value="tone" >
            <div className="topLeftItem">
              <div className="subItemWraper">
                <p> Total Tone <span><i className="icon-tone"></i></span></p>
                <h2 className="subItemTitle">{customer_tone && customer_tone.widget1_response.current_count}</h2>
                <div className={`upDownPercent without-bg ${(customer_tone && customer_tone.widget1_response.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                  <i className={`${(customer_tone && customer_tone.widget1_response.delta_percent > 0) ? 'icon-upward-arrow' : 'icon-downward-arrow'}`}></i> <span className="perc">{customer_tone && Math.abs(customer_tone.widget1_response.delta_percent)}%</span>
                </div>
              </div>
            </div>
          </button>
          <button className={`${this.state.cardType === 'praise' ? 'topLeftBtn graph-tabBtn' : 'topLeftBtn'}`} onClick={this.changeCard} value="praise">
            <div className="topLeftItem">
              <div className="subItemWraper">
                <p> Praise <span><i className="icon-praise"></i></span></p>
                <h2 className="subItemTitle">{customer_tone && customer_tone.widget2_response.current_count}</h2>
                <div className={`upDownPercent without-bg ${(customer_tone && customer_tone.widget2_response.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                  <i className={`${(customer_tone && customer_tone.widget2_response.delta_percent > 0) ? 'icon-upward-arrow' : 'icon-downward-arrow'}`}></i> <span className="perc">{customer_tone && Math.abs(customer_tone.widget2_response.delta_percent)}%</span>
                </div>
              </div>
            </div>
          </button>
          <button className={`${this.state.cardType === 'problem' ? 'topLeftBtn graph-tabBtn' : 'topLeftBtn'}`} onClick={this.changeCard} value="problem">
            <div className="topLeftItem">
              <div className="subItemWraper">
                <p> Problem <span><i className="icon-problem"></i></span></p>
                <h2 className="subItemTitle">{customer_tone && customer_tone.widget3_response.current_count}</h2>
                <div className={`upDownPercent without-bg ${(customer_tone && customer_tone.widget3_response.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                  <i className={`${(customer_tone && customer_tone.widget3_response.delta_percent > 0) ? 'icon-upward-arrow' : 'icon-downward-arrow'}`}></i> <span className="perc">{customer_tone && Math.abs(customer_tone.widget3_response.delta_percent)}%</span>
                </div>
              </div>
            </div>
          </button>
          <button className={`${this.state.cardType === 'suggestions' ? 'topLeftBtn graph-tabBtn' : 'topLeftBtn'}`} onClick={this.changeCard} value="suggestions">
            <div className="topLeftItem">
              <div className="subItemWraper">
                <p> Suggestions <span><i className="icon-suggestions"></i></span></p>
                <h2 className="subItemTitle">{customer_tone && customer_tone.widget4_response.current_count}</h2>
                <div className={`upDownPercent without-bg ${(customer_tone && customer_tone.widget4_response.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                  <i className={`${(customer_tone && customer_tone.widget4_response.delta_percent > 0) ? 'icon-upward-arrow' : 'icon-downward-arrow'}`}></i> <span className="perc">{customer_tone && Math.abs(customer_tone.widget4_response.delta_percent)}%</span>
                </div>
              </div>
            </div>
          </button>
        </div>
        <div className="graph-img">
          <Fragment>
            <div className="graph-btn-row">
              <button type="button" onClick={this.changeView} className={`${this.state.graph === 'graph_data' ? 'graph-btn active' : 'graph-btn'}`} value="graph_data"> Day </button>
              <button type="button" onClick={this.changeView} className={`${this.state.graph === 'week' ? 'graph-btn active' : 'graph-btn'}`} value="week"> Week </button>
              <button type="button" onClick={this.changeView} className={`${this.state.graph === 'month' ? 'graph-btn active' : 'graph-btn'}`} value="month"> Month </button>
            </div>
            <HighchartsReact highcharts={Highcharts} options={this.state.options} />
          </Fragment>
        </div>
        <div className="customize-bar-row">
          <div className="customizable-btn">
            {/* <div className="avg-btn">
              <button>Average
                           <div className="in-out-btn">
                  <span className="in-out-ball"></span>
                </div>
              </button>
            </div>
    <div className="vertical-bar"></div>*/}
            <div className="comp-btn">
              <button className={this.state.toggle ? 'toggleActive' : ''} onClick={this.togglePrevious}>Compare with previous period
                           <div className="in-out-btn">
                  <span className="in-out-ball"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  customer_tone: state.dashboardInsightReducer.customer_tone,
  graph_data: state.dashboardInsightReducer.customer_tone && state.dashboardInsightReducer.customer_tone.graph_data,
  week: state.dashboardInsightReducer.customer_tone && state.dashboardInsightReducer.customer_tone.graph_data_week,
  month: state.dashboardInsightReducer.customer_tone && state.dashboardInsightReducer.customer_tone.graph_data_month
});

const mapActionToProps = {
  LoadCustomerTone: dashboardInsight.LoadCustomerTone
}

export default connect(mapStateToProps, mapActionToProps)(Tone);