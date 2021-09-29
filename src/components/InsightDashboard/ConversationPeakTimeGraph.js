import React, { Component } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions';
import Highcharts from 'highcharts' //core
import HighchartsReact from 'highcharts-react-official';
import HC_more from 'highcharts/highcharts-more' //module
HC_more(Highcharts) //init module


class ConversationPeakTimeGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      graph: 'Total',
      options: {
        chart: {
          type: 'bubble',
          // zoomType: 'xy'
          height: 560
        },
        title: {
          text: null
        },
        // xAxis: {
        //   title: null,
        //   gridLineWidth: 1,
        //   labels: {
        //     formatter: function () {
        //       return Math.round(this.value)
        //     }
        //   }
        // },
        yAxis: {
          max: 6,
          min: 0,
          gridLineWidth: 0,
          startOnTick: false,
          endOnTick: false,
          title: null,
          categories: ["Sun", "Sat", "Fri", "Thu", "Wed", "Tue", "Mon"],
          labels: {
            formatter: function () {
              return this.value
            }
          },
        },
        // legend: {
        //   enabled: false
        // },
        credits: {
          enabled: false
        },
        plotOptions: {
          bubble: {
            minSize: 2,
            maxSize: 50
          },
          series: {
            // animation: false,
            showInLegend: false,
          }
        },
      }
    }
  }

  componentDidMount() {
    const { client_id, emailid } = this.props.user;
    const { date_filter, plugin } = this.props
    if (plugin && plugin.length > 0) {
      this.props.LoadConversationPeakDayTime(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { plugin, date_filter } = prevProps;
    if ((plugin !== this.props.plugin) || (date_filter.from !== this.props.date_filter.from) || (date_filter.to !== this.props.date_filter.to)) {
      const { client_id, emailid } = this.props.user;
      const { date_filter, plugin } = this.props
      this.props.LoadConversationPeakDayTime(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }

    if ((this.props.conversation_peakdaytime !== prevProps.conversation_peakdaytime) || (this.state.graph !== prevState.graph)) {
      const { xAxis, series, tooltip } = this.updateGraph();

      this.setState(() => {
        return {
          options: {
            ...this.state.options,
            tooltip,
            xAxis,
            series
          }
        }
      })
    }
  }

  updateGraph = () => {
    if (this.state.graph === 'Total') {
      let finalData = [];
      let numToDay = ["Sunday", "Saturday", "Friday", "Thursday", "Wednesday", "Tuesday", "Monday"];
      this.props.conversation_peakdaytime !==undefined && this.props.conversation_peakdaytime !==null && this.props.conversation_peakdaytime.map(element => {
        let count = null;
        if (element.count !== 0) {
          count = element.count;
          finalData.push({
            x: element.hour,
            y: numToDay.indexOf(element.day_week),
            z: element.count
          });
        }
      });
 
      // var sum = [];
      // for (var i = 0; i < numToDay.length; i++) {
      //   let count = 0;
      //   for (var j = 0; j < this.props.conversation_peakdaytime.length; j++) {
      //     if (numToDay[i] === this.props.conversation_peakdaytime[j].day_week) {
      //       count = count + this.props.conversation_peakdaytime[j].count;
      //     }
      //   }
      //   sum.push({ "day_week": numToDay[i], "count": count })

      // }

      return {
        xAxis: {
          title: null,
          gridLineWidth: 1,
          tickInterval:2,
          categories:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
        },
        tooltip: {
          formatter: function () {
            return '<b>Total: ' + this.point.z;
          }
        },
        series: [
          {
            data: finalData

          }
        ]
      }
    }

    if (this.state.graph === 'Opportunities') {
      let finalData = [];
      let numToDay = ["Sunday", "Saturday", "Friday", "Thursday", "Wednesday", "Tuesday", "Monday"];
      this.props.conversation_peakdaytime !==undefined && this.props.conversation_peakdaytime.map(element => {
        let opportunity = null;
        if (element.opportunity !== 0) {
          opportunity = element.opportunity;
          finalData.push({
            x: element.hour,
            y: numToDay.indexOf(element.day_week),
            z: element.opportunity
          });
        }
      });
  
      // var sum = [];
      // for (var i = 0; i < numToDay.length; i++) {
      //   let opportunity = 0;
      //   for (var j = 0; j < this.props.conversation_peakdaytime.length; j++) {
      //     if (numToDay[i] === this.props.conversation_peakdaytime[j].day_week) {
      //       opportunity = opportunity + this.props.conversation_peakdaytime[j].opportunity;
      //     }
      //   }
      //   sum.push({ "day_week": numToDay[i], "opportunity": opportunity })

      // }
      return {
        xAxis: {
          title: null,
          gridLineWidth: 1,
          tickInterval:2,
          categories:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
        },
        tooltip: {
          formatter: function () {
            return '<b>Opportunities: ' + this.point.z;
          }
        },
        series: [
          {
            data: finalData
          }
        ]
      }
    }

  }
  changeView = (e) => {
    const graph = e.target.value;
    this.setState(({ graph }), () => {
    })
  }
  render() {
    return (
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="peakTime custom-component top-traits remove-padding pad0">
            <div className="Rep-wise-header">
              <div>
                <h4 className="component-title"> Peak Day/Time </h4>
                <p className="component-title-text"> Number of conversations at a specific day and time </p>
              </div>
            </div>
            <div className="graph-img">
              <div className="graph-btn-row">
                <button type="button" onClick={this.changeView} className={`${this.state.graph === 'Total' ? 'graph-btn active' : 'graph-btn'}`} value="Total"> Total </button>
                <button type="button" onClick={this.changeView} className={`${this.state.graph === 'Opportunities' ? 'graph-btn active' : 'graph-btn'}`} value="Opportunities"> Opportunities </button>
              </div>

            </div>
            <div className="Rep-wise-body pad-tb-28">
              <HighchartsReact highcharts={Highcharts} options={this.state.options} />
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
    conversation_peakdaytime: state.dashboardInsightReducer.conversation_peakdaytime
  }
}

const mapActionToProps = {
  LoadConversationPeakDayTime: dashboardInsight.LoadConversationPeakDayTime
}

export default connect(mapStateToProps, mapActionToProps)(ConversationPeakTimeGraph);
