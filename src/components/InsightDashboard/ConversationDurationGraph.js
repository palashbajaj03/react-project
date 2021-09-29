import React, { Component } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class ConversationDurationGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {

      toggle: false,
      toggleCurrent: 'current',
      togglePrevious: 'previous',
      options: {

        title: {
          text: null
        },
        xAxis: {
          title: null,

        },
        yAxis: {
          title: null,

        },
        chart: {
          type: 'column',
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          }
        },
      }
    }
  }

  componentDidMount() {
    const { client_id, emailid } = this.props.user;
    const { date_filter, plugin } = this.props
    if (plugin && plugin.length > 0) {
      this.props.LoadConversationDuration(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { plugin, date_filter } = prevProps;
    if ((plugin !== this.props.plugin) || (date_filter.from !== this.props.date_filter.from) || (date_filter.to !== this.props.date_filter.to)) {
      const { client_id, emailid } = this.props.user;
      const { date_filter, plugin } = this.props
      this.props.LoadConversationDuration(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }

    if ((this.props.graph_data !== prevProps.graph_data) || (this.state.graph !== prevState.graph) || (this.state.toggle !== prevState.toggle)) {
      const { xAxis, series, tooltip } = this.updateGraph();
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

  updateGraph = () => {
    if (!this.state.toggle) {
      let cta = []
      this.props.graph_data && this.props.graph_data.current.forEach(data => {
        if (data.cta) {
          cta.push(data.cta)
        }
      })
      if (cta.length > 0) {
        localStorage.setItem('ctaDURATION', JSON.stringify(cta));
      }
      return {
        xAxis: {
          categories: this.props.graph_data[this.state.toggleCurrent].map(data => data.label),
          labels: {
            formatter: function () {
              if (cta.length > 0) {
                return `<a href="/search?valDuration=${this.pos}">${this.value}<a>`
              }
              return this.value
            }
          },
        },
        tooltip: {
          formatter: function () {
            return '<b>Duration: ' + this.point.y;
          }
        },
        series: [
          {
            name: 'Current',
            data: this.props.graph_data[this.state.toggleCurrent].map(data => data.value),
            color: '#169eca'
          }
        ]
      };
    }
    else {
      let cta = []
      this.props.graph_data && this.props.graph_data.current.forEach(data => {
        if (data.cta) {
          cta.push(data.cta)
        }
      })
      if (cta.length > 0) {
        localStorage.setItem('ctaDURATION', JSON.stringify(cta));
      }
      return {
        xAxis: {
          categories: this.props.graph_data[this.state.toggleCurrent].map(data => data.label),
          labels: {
            formatter: function () {
              if (cta.length > 0) {
                return `<a href="/search?valDuration=${this.pos}">${this.value}<a>`
              }
              return this.value
            }
          },
        },
        tooltip: {
          formatter: function () {
            return '<b>Duration: ' + this.point.y;
          }
        },
        series: [
          {
            name: 'Current',
            data: this.props.graph_data[this.state.toggleCurrent].map(data => data.value),
            color: '#169eca'
          },
          {
            name: 'Previous',
            data: this.props.graph_data[this.state.togglePrevious].map(data => data.value),
            color: '#555ff6',

          },
        ]
      };
    }
  }
  togglePrevious = () => {

    if (this.props.graph_data) {
      this.setState((prevState) => ({
        toggle: !prevState.toggle
      }))
    }

  }
  render() {

    return (
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="custom-component top-traits remove-padding pad0">
            <div className="Rep-wise-header">
              <div>
                <h4 className="component-title"> Duration </h4>
                {/* <p className="component-title-text"> Collective duration of all the conversations </p> */}
              </div>
            </div>
            <div className="Duration Rep-wise-body ">
              <div className="graph-img mt-4 mb-4">
                <HighchartsReact highcharts={Highcharts} options={this.state.options} />
              </div>
            </div>
            <div className="customize-bar-row">
              <div className="customizable-btn">
                {/* <div className="avg-btn">
                      <button>Average
                                     <div className="in-out-btn">
                          <span className="in-out-ball"></span>
                        </div>
                      </button>
                    </div> */}
                {/* <div className="vertical-bar"></div> */}
                <div className="comp-btn">
                  <button className={this.state.toggle ? 'toggleActive' : ''} onClick={this.togglePrevious}>Compare
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
    )
  }
}
const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    graph_data: state.dashboardInsightReducer.conversation_duration && state.dashboardInsightReducer.conversation_duration,
  }
}

const mapActionToProps = {
  LoadConversationDuration: dashboardInsight.LoadConversationDuration
}

export default connect(mapStateToProps, mapActionToProps)(ConversationDurationGraph);