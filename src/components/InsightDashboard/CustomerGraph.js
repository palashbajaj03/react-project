import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { dashboardInsight } from '../../actions';
import moment from 'moment'

Highcharts.setOptions({
  time: {
    useUTC: false
  },
  colors: [
    '#3edbd3',
    '#38a7ed'
  ]
})

class CustomerGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: 'graph_data',
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
          text: 'Conversations',
          align: 'left',
          margin: 40
        },

        subtitle: {
          text: 'Total number of conversations by your reps',
          align: 'left',
        },
        yAxis: {
          type: 'linear',
          tickInterval: 20,
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
    this.updateGraph = this.updateGraph.bind(this);
  }

  // componentDidMount() {
  //   const { client_id, emailid } = this.props.user;
  //   const { date_filter, plugin } = this.props
  //   this.props.LoadCustomerConversations(client_id, emailid, date_filter.from, date_filter.to, plugin)
  // }

  componentDidUpdate(prevProps, prevState) {
    const { plugin, date_filter } = prevProps;
    if ((plugin !== this.props.plugin) || (date_filter.from !== this.props.date_filter.from) || (date_filter.to !== this.props.date_filter.to)) {
      const { client_id, emailid } = this.props.user;
      const { date_filter, plugin } = this.props
      this.props.LoadCustomerConversations(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }

    if ((this.props.graph_data !== prevProps.graph_data) || (this.state.graph !== prevState.graph)) {
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

    let enabled = categories.length > 1 ? false : true;

    if (!this.state.toggle) {
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
      };
    } else {
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
            data:this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
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
            name: 'Previous',
            marker: {
              enabled
            },
            data:this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter(value => {
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
          }
        ]
      };
    }
  }

  changeView = (e) => {
    const graph = e.target.value;
    this.setState(({ graph }))
  }

  togglePrevious = (e) => {
    if(this.props.graph_data){
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
    return (
      <Fragment>
        <div className="graph-img">
          <div className="graph-btn-row">
            <button type="button" onClick={this.changeView} className={`${this.state.graph === 'graph_data' ? 'graph-btn active' : 'graph-btn'}`} value="graph_data"> Day </button>
            <button type="button" onClick={this.changeView} className={`${this.state.graph === 'week' ? 'graph-btn active' : 'graph-btn'}`} value="week"> Week </button>
            <button type="button" onClick={this.changeView} className={`${this.state.graph === 'month' ? 'graph-btn active' : 'graph-btn'}`} value="month"> Month </button>
          </div>
          <HighchartsReact highcharts={Highcharts} options={this.state.options} />
        </div>
        <div className="customize-bar-row">
          <div className="customizable-btn">
            {/*       <div className="avg-btn">
              <button>Average
                            <div className="in-out-btn">
                  <span className="in-out-ball"></span>
                </div>
              </button>
            </div>
    <div className="vertical-bar"></div>*/}
            <div className="comp-btn">
              <button className={this.state.toggle ? 'toggleActive' : ''} onClick={this.togglePrevious} >Compare with previous period
                            <div className="in-out-btn">
                  <span className="in-out-ball"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  graph_data: state.dashboardInsightReducer.customer_conversations && state.dashboardInsightReducer.customer_conversations.graph_data,
  week: state.dashboardInsightReducer.customer_conversations && state.dashboardInsightReducer.customer_conversations.graph_data_week,
  month: state.dashboardInsightReducer.customer_conversations && state.dashboardInsightReducer.customer_conversations.graph_data_month
})

const mapActionsToProps = {
  LoadCustomerConversations: dashboardInsight.LoadCustomerConversations
}

export default connect(mapStateToProps, mapActionsToProps)(CustomerGraph);