import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Highcharts from 'highcharts';
import moment from 'moment'
import HighchartsReact from 'highcharts-react-official';
import { dashboardInsight } from '../../actions';
import CustomerFollowUpAppointment from './CustomerFollowUpAppointment';

Highcharts.setOptions({
  time: {
    useUTC: false
  },
  colors: [
    '#555ff6',
    '#38a7ed'
  ]
})

class CustomerFollowUpGraph extends Component {
  constructor(props) {
    super(props);
    this.chart = React.createRef();
    this.state = {
      cardType: 'followup',
      graph: 'graph_data',
      toggle: false,
      options: {
        chart: {
          type: 'areaspline',
          // styledMode: false
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

      }
    }
    this.updateGraph = this.updateGraph.bind(this);
  }
  componentDidMount() {
    const { client_id, emailid } = this.props.user;
    const { date_filter, plugin } = this.props
    if (plugin && plugin.length > 0) {
      this.props.LoadCustomerFollowUpsGraph(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { plugin, date_filter } = prevProps;
    if ((plugin !== this.props.plugin) || (date_filter.from !== this.props.date_filter.from) || (date_filter.to !== this.props.date_filter.to)) {
      const { client_id, emailid } = this.props.user;
      const { date_filter, plugin } = this.props
      this.props.LoadCustomerFollowUpsGraph(client_id, emailid, date_filter.from, date_filter.to, plugin)
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
    if (this.state.cardType === 'followup') {
      if (!this.state.toggle) {
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
              }).map(data => data.follow_up),
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
        let categories = this.state.graph === 'graph_data' ? this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
          if (data.period === "current") {
            return data.new_date = moment(data.date).format('MMM DD')
          }
        }).map(data => data.new_date) : this.state.graph === 'week' ? this.props[this.state.graph] !== undefined && this.props[this.state.graph].filter((data) => {
          if (data.period === 'current') {
            return data
          }
        }).map(data => "Week " + data.week) :this.props[this.state.graph] !== undefined &&  this.props[this.state.graph].filter((data) => {
          if (data.period === 'current') {
            return data
          }
        }).map(data => data.year_mon)

        let enabled = categories.length > 1 ? false : true;

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
              }).map(data => data.follow_up),
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
              }).map(data => data.follow_up),
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
    } else if (this.state.cardType === 'appointment') {
      if (!this.state.toggle) {
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
              }).map(data => data.is_call_appointment),
              fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                  [0, Highcharts.getOptions().colors[0]],
                  [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
              }
            },
          ]
        }
      } else {
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

        let enabled = categories.length > 1 ? false : true;

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
              }).map(data => data.is_call_appointment),
              fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                  [0, Highcharts.getOptions().colors[0]],
                  [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
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
              }).map(data => data.is_call_appointment),
              fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                  [0, Highcharts.getOptions().colors[0]],
                  [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
              }
            }
          ]
        }
      }
    }
  }

  changeCard = (e) => {
    let cardType = e.target.value;
    this.setState({ cardType })
  }

  changeView = (e) => {
    const graph = e.target.value;
    this.setState(({ graph }))
  }

  togglePrevious = (e) => {
    if(this.props.customer_followups_appointment){
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
    const { customer_followups_appointment, plugin, date_filter } = this.props
    return (
      <Fragment>
        <div className="conversation-graph all-calc-graph mt25">
          <div className="left-graph negmt20">
            <div className="topLeftCorner sub2">
              <button className={`${this.state.cardType === 'followup' ? 'topLeftBtn graph-tabBtn' : 'topLeftBtn'}`} value="followup" onClick={this.changeCard}>
                <div className="topLeftItem">
                  <div className="subItemWraper">
                    <p> Total Followups <span><i className="icon-follow-ups"></i></span></p>
                    <h2 className="subItemTitle">{customer_followups_appointment && customer_followups_appointment.top_widget_total_follow_up.current_count}</h2>
                    <div className={`upDownPercent without-bg ${(customer_followups_appointment && customer_followups_appointment.top_widget_total_follow_up.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                      <i className={`${(customer_followups_appointment && customer_followups_appointment.top_widget_total_follow_up.delta_percent > 0) ? 'icon-upward-arrow' : 'icon-downward-arrow'}`}></i> <span className="perc">{customer_followups_appointment && Math.abs(customer_followups_appointment.top_widget_total_follow_up.delta_percent)}%</span>
                    </div>
                  </div>
                </div>
              </button>
              <button className={`${this.state.cardType === 'appointment' ? 'topLeftBtn graph-tabBtn' : 'topLeftBtn'}`} value="appointment" onClick={this.changeCard}>
                <div className="topLeftItem">
                  <div className="subItemWraper">
                    <p> Total Appointments <span><i className="icon-appoinments"></i></span></p>
                    <h2 className="subItemTitle">{customer_followups_appointment && customer_followups_appointment.top_widget_total_is_call_appointment.current_count}</h2>
                    <div className={`upDownPercent without-bg ${(customer_followups_appointment && customer_followups_appointment.top_widget_total_is_call_appointment.delta_percent > 0) ? 'arrUp' : 'arrDown'}`}>
                      <i className={`${(customer_followups_appointment && customer_followups_appointment.top_widget_total_is_call_appointment.delta_percent > 0) ? 'icon-upward-arrow' : 'icon-downward-arrow'}`}></i> <span className="perc">{customer_followups_appointment && Math.abs(customer_followups_appointment.top_widget_total_is_call_appointment.delta_percent)}%</span>
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
                <HighchartsReact ref={this.chart} highcharts={Highcharts} options={this.state.options} />
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
                <div className="vertical-bar"></div> */}
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
        </div>
        <CustomerFollowUpAppointment plugin={plugin} date_filter={date_filter} cardType={this.state.cardType} />
      </Fragment>

    );
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  customer_followups_appointment: state.dashboardInsightReducer.customer_followups_appointment,
  graph_data: state.dashboardInsightReducer.customer_followups_appointment && state.dashboardInsightReducer.customer_followups_appointment.graph_data,
  week: state.dashboardInsightReducer.customer_followups_appointment && state.dashboardInsightReducer.customer_followups_appointment.graph_data_week,
  month: state.dashboardInsightReducer.customer_followups_appointment && state.dashboardInsightReducer.customer_followups_appointment.graph_data_month
})

const mapActionToProps = {
  LoadCustomerFollowUpsGraph: dashboardInsight.LoadCustomerFollowUpsGraph
}

export default connect(mapStateToProps, mapActionToProps)(CustomerFollowUpGraph);
