import React, { Component } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions'

Highcharts.setOptions({
  time: {
    useUTC: false
  },
  colors: [
    '#555ff6',
    '#38a7ed'
  ]
})

class ConversationRepWiseGraph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sort: 'Descending',
      count: 10,
      firstindex: 0,
      options: {
        title: {
          text: 'Rep Wise Performance',
          align: 'left',
          margin: 40
        },
        // legend: {
        //   enabled: false
        // },
        subtitle: {
          text: 'Opportunities from Total Conversations',
          align: 'left',
        },
        chart: {
          type: 'bar',
          styledMode: true
        },
        credits: {
          enabled: false
        },
        yAxis: {
          type: 'linear',
          tickInterval: 5,
          title: {
            enabled: false
          }
        },
        plotOptions: {
          bar: {
            stacking: 'normal',
            dataLabels: {
              enabled: true
            }
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
      this.props.LoadConversationRepWisePerformance(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }
  }


  componentDidUpdate(prevProps, prevState) {
    const { plugin, date_filter } = prevProps;
    const { client_id, emailid } = this.props.user;
    if ((plugin !== this.props.plugin) || (date_filter.from !== this.props.date_filter.from) || (date_filter.to !== this.props.date_filter.to)) {
      const { date_filter, plugin } = this.props
      this.props.LoadConversationRepWisePerformance(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }
    if ((prevProps.rep_wise_performance !== this.props.rep_wise_performance) || (this.state.sort !== prevState.sort) || (this.state.count !== prevState.count)) {
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
    let enabled = this.props.rep_wise_performance.length > 1 ? false : true;
    let categories = this.props.rep_wise_performance.map(rep => rep.reps_name)
    let current_data = this.sortCurrentData()
    // current_data = current_data.slice(this.state.firstindex, this.state.count)
    let cta = []
    current_data.forEach(data => {
      if (data.cta) {
        cta.push(data.cta)
      } else {

      }
    })
    if (cta.length > 0) {
      localStorage.setItem('cta', JSON.stringify(cta));
    }
    return {
      xAxis: {
        categories,
        labels: {
          formatter: function () {
            if (cta.length > 0) {
              return `<a href="/search?val=${this.pos}">${this.value}<a>`
            } else {
              return this.value
            }
          }
        },
      },
      series: [
        {
          name: 'Total Conversations',
          marker: {
            enabled
          },
          data: current_data.map(data => data.count),
          fillColor: {

            linearGradient: [0, 0, 0, 300],
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          }
        },
        {
          name: 'Opportunities',
          marker: {
            enabled
          },
          data: current_data.map(data => data.opportunity),
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
  }

  onDropDownSort = (e) => {
    let sort = e.target.id
    this.setState(({ sort }))
  }

  sortCurrentData = () => {
    let current_data = []
    if (this.state.sort === 'Descending') {
      current_data = this.props.rep_wise_performance.sort((a, b) => Number(b.count) - Number(a.count));
    }
    if (this.state.sort === 'Ascending') {
      current_data = this.props.rep_wise_performance.sort((a, b) => Number(a.count) - Number(b.count));

    }
    return current_data
  }

  updateCount = (e) => {
    if (this.props.rep_wise_performance.length > 10) {
      if (e.target.value === 'more' && (this.state.count < this.props.rep_wise_performance.length)) {
        this.setState((prevState) => ({
          count: prevState.count + 10,
          firstindex: prevState.firstindex + 10
        }))
      } else if (e.target.value === 'less' && (this.state.count > 10)) {
        this.setState((prevState) => ({
          count: prevState.count - 10,
          firstindex: prevState.firstindex - 10
        }))
      }
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="custom-component mt25 top-traits remove-padding pad0">
            {/*<div className="Rep-wise-header">*/}
            {/*  <div>
                <h4 className="component-title"> Rep wise Performance  </h4>
                <p className="component-title-text"> Opportunities from Total Conversations </p>
              </div>*/}

            <div className="conversation top-traits-chart mt5">
              {/*<div class="conversation graph-img">*/}
              <HighchartsReact highcharts={Highcharts} options={this.state.options} />
              {/* </div>*/}
            </div>
            {/* </div>*/}
            {<div className="Rep-wise-footer">
              <div className="btn-group">
                <button type="button" className="btn selectdropdwon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.state.sort}
                </button>
                <div className="dropdown-menu graph-dropdown" onClick={this.onDropDownSort} style={{ width: "100%" }}>
                  <button className="dropdown-item" id="Ascending">Ascending</button>
                  <button className="dropdown-item" id="Descending">Descending</button>
                </div>
              </div>
             {/* <div className="view-more-btn">
                <button onClick={this.updateCount} value="less">View Less</button>
                <button onClick={this.updateCount} value="more">View More</button>
            </div>*/}
            </div>}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  rep_wise_performance: state.dashboardInsightReducer.conversation_rep_wise_performance,
})

const mapActionToProps = {
  LoadConversationRepWisePerformance: dashboardInsight.LoadConversationRepWisePerformance
}

export default connect(mapStateToProps, mapActionToProps)(ConversationRepWiseGraph)