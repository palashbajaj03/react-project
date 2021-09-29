import React, { Component } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment, { max } from 'moment'

Highcharts.setOptions({
  time: {
    useUTC: false
  },
  // colors: [
  //   '#555ff6',
  //   '#38a7ed',
  //   '#83e3e4'
  // ]
})

class ConversationDashboardGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: "graph_data",
      cardType: 'conversations',
      toggle: false,
      options: {

        chart: {
          type: 'areaspline',
          // styledMode: true
        },
        credits: {
          enabled: false
        },
        title: {
          text: null,
        },
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
    }
  }

  // componentDidMount() {
  //   const { client_id, emailid } = this.props.user;
  //   const { date_filter, plugin } = this.props
  //   if (plugin.length > 0) {
  //     this.props.LoadConversationDasboardGraph(client_id, emailid, date_filter.from, date_filter.to, plugin)
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    const { plugin, date_filter } = prevProps;
    if ((plugin !== this.props.plugin) || (date_filter.from !== this.props.date_filter.from) || (date_filter.to !== this.props.date_filter.to)) {
      const { client_id, emailid } = this.props.user;
      const { date_filter, plugin } = this.props
      plugin.length > 0 &&  this.props.LoadConversationDasboardGraph(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }

    if ((this.props.graph_data !== prevProps.graph_data) || (this.state.graph !== prevState.graph) || (this.state.cardType !== prevState.cardType)) {
      const { xAxis, series,tooltip } = this.updateGraph();
     // console.log(yAxis)
      this.setState(() => {
        return {
          options: {
            ...this.state.options,
            xAxis,
            
            series,
            tooltip
          }
        }
      })
    }
  }

  updateGraph() {

    let current_graph_enabled = this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
      return data.period === 'current'
    })
    if (!this.state.toggle) {
      if (this.state.cardType === 'conversations') {

        let enabled = current_graph_enabled.length > 1 ? false : true;
        let categories = this.state.graph === 'graph_data' ? this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
          if (data.period === "current") {
            return data.new_date = moment(data.date).format('MMM DD')
          }
        }).map(data => data.new_date) : this.state.graph === 'week' ? this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
          if (!this.state.toggle && data.period === 'current') {
            return data
          }
        }).map(data => "Week " + data.week) : this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
          if (!this.state.toggle && data.period === 'current') {
            return data
          }
        }).map(data => data.year_mon)
        let tempVal = []
        this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
          if (value.period === 'current') {
            return value
          }
        }).map(data => tempVal.push(data.count))
      let maxValue = Math.max(...tempVal)
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
                enabled
              },
              data: this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
                if (value.period === 'current') {
                  return value
                }
              }).map(data => data.count),
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
      } else if (this.state.cardType === 'opportunities') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        let categories = this.state.graph === 'graph_data' ? this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
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

        let tempVal = []
        this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
          if (value.period === 'current') {
            return value
          }
        }).map(data => tempVal.push(data.opportunity))
        let maxValue = Math.max(...tempVal)
          //console.log(maxValue)
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
              return '<b>Total Opportunities: '+this.point.y;
            }
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
              }).map(data => data.opportunity),
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
      } else if (this.state.cardType === 'purchase') {
    
        let enabled = current_graph_enabled.length > 1 ? false : true;
        let categories = this.state.graph === 'graph_data' ? this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
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
              return '<b>Purchase: '+this.point.y;
            }
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
              }).map(data => data.purchase),
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
      } else if (this.state.cardType === 'comparison') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        let categories = this.state.graph === 'graph_data' ? this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
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
              return '<b>Comparison: '+this.point.y;
            }
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
              }).map(data => data.comparison),
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
      } else if (this.state.cardType === 'considerations') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        let categories = this.state.graph === 'graph_data' ? this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
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
              return '<b>Consideration: '+this.point.y;
            }
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
              }).map(data => data.consideration),
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
      if (this.state.cardType === 'conversations') {

        let enabled = current_graph_enabled.length > 1 ? false : true;
        let categories = this.state.graph === 'graph_data' ? this.props[this.state.graph].filter((data) => {
          if (data.period === "current") {
            return data.new_date = moment(data.date).format('MMM DD')
          }
        }).map(data => data.new_date) : this.state.graph === 'week' ? this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
          if (!this.state.toggle && data.period === 'current') {
            return data
          }
        }).map(data => "Week " + data.week) : this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
          if (!this.state.toggle && data.period === 'current') {
            return data
          }
        }).map(data => data.year_mon)
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
                enabled
              },
              data: this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
                if (value.period === 'current') {
                  return value
                }
              }).map(data => data.count),
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
                enabled
              },
              data: this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
                if (value.period === 'previous') {
                  return value
                }
              }).map(data => data.count),
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
      } else if (this.state.cardType === 'opportunities') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        let categories = this.state.graph === 'graph_data' ? this.props[this.state.graph].filter((data) => {
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
              return '<b>Total Opportunities: '+this.point.y;
            }
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
              }).map(data => data.opportunity),
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
              }).map(data => data.opportunity),
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
      } else if (this.state.cardType === 'purchase') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        let categories = this.state.graph === 'graph_data' ? this.props[this.state.graph].filter((data) => {
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
              return '<b>Purchase: '+this.point.y;
            }
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
              }).map(data => data.purchase),
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
              }).map(data => data.purchase),
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
      } else if (this.state.cardType === 'comparison') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        let categories = this.state.graph === 'graph_data' ? this.props[this.state.graph].filter((data) => {
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
              return '<b>Comparison: '+this.point.y;
            }
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
              }).map(data => data.comparison),
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
              }).map(data => data.comparison),
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
      } else if (this.state.cardType === 'considerations') {
        let enabled = current_graph_enabled.length > 1 ? false : true;
        let categories = this.state.graph === 'graph_data' ? this.props[this.state.graph].filter((data) => {
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
              return '<b>Consideration: '+this.point.y;
            }
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
              }).map(data => data.consideration),
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
              }).map(data => data.consideration),
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

  }

  changeView = (e) => {
    const graph = e.target.value;
    this.setState(({ graph }), () => {
      // this.updateGraph();
    })
  }
  changeCard = (e) => {
    let cardType = e.target.value;
    this.setState(({ cardType }))
  }

  togglePrevious = (e) => {
    if (this.props.dashboard_graph) {
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
    const { dashboard_graph } = this.props
    return (

      <div className="conversation-graph all-calc-graph">
        <div className="topLeftCorner sub5 negmt20">
          <button className={`${this.state.cardType === 'conversations' ? 'topLeftBtn graph-tabBtn' : 'topLeftBtn'}`} onClick={this.changeCard} value="conversations" >
            <div className="topLeftItem">
              <div className="subItemWraper">
                <p> Conversations <span><i className="icon-conversations"></i></span></p>
                <h2 className="subItemTitle">{dashboard_graph && dashboard_graph.top_widget_total_conversations.current_count}</h2>
                <div className={`upDownPercent without-bg ${(dashboard_graph && dashboard_graph.top_widget_total_conversations.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                  <i className={`${(dashboard_graph && dashboard_graph.top_widget_total_conversations.delta_percent > 0) ? 'icon-upward-arrow' : 'icon-downward-arrow'}`}></i> <span className="perc">{dashboard_graph && Math.abs(dashboard_graph.top_widget_total_conversations.delta_percent)}%</span>
                </div>
              </div>
            </div>
          </button>
          <button className={`${this.state.cardType === 'opportunities' ? 'topLeftBtn graph-tabBtn' : 'topLeftBtn'}`} onClick={this.changeCard} value="opportunities" >
            <div className="topLeftItem">
              <div className="subItemWraper">
                <p> Opportunities <span><i className="icon-total-opportunities"></i></span></p>
                <h2 className="subItemTitle">{dashboard_graph && dashboard_graph.top_widget_total_opportunities.current_count}</h2>
                <div className={`upDownPercent without-bg ${(dashboard_graph && dashboard_graph.top_widget_total_opportunities.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                  <i className={`${(dashboard_graph && dashboard_graph.top_widget_total_opportunities.delta_percent > 0) ? 'icon-upward-arrow' : 'icon-downward-arrow'}`}></i> <span className="perc">{dashboard_graph && Math.abs(dashboard_graph.top_widget_total_opportunities.delta_percent)}%</span>
                </div>
              </div>
            </div>
          </button>
          <button className={`${this.state.cardType === 'purchase' ? 'topLeftBtn graph-tabBtn' : 'topLeftBtn'}`} onClick={this.changeCard} value="purchase" >
            <div className="topLeftItem">
              <div className="subItemWraper">
                <p> Purchase <span><i className="icon-purchase"></i></span></p>
                <h2 className="subItemTitle">{dashboard_graph && dashboard_graph.top_widget_total_purchase.current_count}</h2>
                <div className={`upDownPercent without-bg ${(dashboard_graph && dashboard_graph.top_widget_total_purchase.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                  <i className={`${(dashboard_graph && dashboard_graph.top_widget_total_purchase.delta_percent > 0) ? 'icon-upward-arrow' : 'icon-downward-arrow'}`}></i> <span className="perc">{dashboard_graph && Math.abs(dashboard_graph.top_widget_total_purchase.delta_percent)}%</span>
                </div>
              </div>
            </div>
          </button>
          <button className={`${this.state.cardType === 'comparison' ? 'topLeftBtn graph-tabBtn' : 'topLeftBtn'}`} onClick={this.changeCard} value="comparison" >
            <div className="topLeftItem">
              <div className="subItemWraper">
                <p> Comparison <span><i className="icon-comparison"></i></span></p>
                <h2 className="subItemTitle">{dashboard_graph && dashboard_graph.top_widget_total_comparison.current_count}</h2>
                <div className={`upDownPercent without-bg ${(dashboard_graph && dashboard_graph.top_widget_total_comparison.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                  <i className={`${(dashboard_graph && dashboard_graph.top_widget_total_comparison.delta_percent > 0) ? 'icon-upward-arrow' : 'icon-downward-arrow'}`}></i> <span className="perc">{dashboard_graph && Math.abs(dashboard_graph.top_widget_total_comparison.delta_percent)}%</span>
                </div>
              </div>
            </div>
          </button>
          <button className={`${this.state.cardType === 'considerations' ? 'topLeftBtn graph-tabBtn' : 'topLeftBtn'}`} onClick={this.changeCard} value="considerations" >
            <div className="topLeftItem">
              <div className="subItemWraper">
                <p> Considerations <span><i className="icon-consideration"></i></span></p>
                <h2 className="subItemTitle">{dashboard_graph && dashboard_graph.top_widget_total_consideration.current_count}</h2>
                <div className={`upDownPercent without-bg ${(dashboard_graph && dashboard_graph.top_widget_total_consideration.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                  <i className={`${(dashboard_graph && dashboard_graph.top_widget_total_consideration.delta_percent > 0) ? 'icon-upward-arrow' : 'icon-downward-arrow'}`}></i> <span className="perc">{dashboard_graph && Math.abs(dashboard_graph.top_widget_total_consideration.delta_percent)}%</span>
                </div>
              </div>
            </div>
          </button>

        </div>
        <div className="conv graph-img convo-first-graph-btn">
          <HighchartsReact highcharts={Highcharts} options={this.state.options} />
        </div>

        {<div className="customize-bar-row">
          <div className="customizable-btn">
            <div className="comp-btn">
              <button className={this.state.toggle ? 'toggleActive' : ''} onClick={this.togglePrevious}>Compare
                      <div className="in-out-btn">
                  <span className="in-out-ball"></span>
                </div>
              </button>
            </div>
          </div>
        </div>}
      </div>

    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  dashboard_graph: state.dashboardInsightReducer.conversation_dashboard_graph,
  graph_data: state.dashboardInsightReducer.conversation_dashboard_graph && state.dashboardInsightReducer.conversation_dashboard_graph.graph_data,
  week: state.dashboardInsightReducer.conversation_dashboard_graph && state.dashboardInsightReducer.conversation_dashboard_graph.graph_data_week,
  month: state.dashboardInsightReducer.conversation_dashboard_graph && state.dashboardInsightReducer.conversation_dashboard_graph.graph_data_month
})

const mapActionToProps = {
  LoadConversationDasboardGraph: dashboardInsight.LoadConversationDasboardGraph
}

export default connect(mapStateToProps, mapActionToProps)(ConversationDashboardGraph)