import React, { Component } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions';
import Highcharts from 'highcharts';
import Pagination from 'rc-pagination';
import HighchartsReact from 'highcharts-react-official';

class RepsDashboardGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sort: 'Descending',
      val: 'widget2',
      count: 10,
      firstindex: 0,
      activePage: 1,
      options: {
        title: {
          text: null
        },
        chart: {
          type: 'bar',
          styledMode: true,
          height: 600,
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true
            }
          },
        },
      }
    }

  }

  componentDidMount() {
    const { client_id, emailid } = this.props.user;
    const { date_filter, plugin } = this.props
    if (plugin && plugin.length > 0) {
      this.props.LoadRepsDashboardGraph(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { plugin, date_filter } = prevProps;
    if ((plugin !== this.props.plugin) || (date_filter.from !== this.props.date_filter.from) || (date_filter.to !== this.props.date_filter.to)) {
      const { client_id, emailid } = this.props.user;
      const { date_filter, plugin } = this.props
      this.props.LoadRepsDashboardGraph(client_id, emailid, date_filter.from, date_filter.to, plugin)
    }
    if ((this.props.reps_dashboard_graph !== prevProps.reps_dashboard_graph) || (this.state.val !== prevState.val) || (this.state.sort !== prevState.sort) || (this.state.count !== prevState.count)) {
      const { xAxis, series, yAxis, chart, plotOptions, tooltip } = this.updateGraph();
      this.setState(() => {
        return {
          options: {
            ...this.state.options,
            plotOptions,
            chart,
            xAxis,
            series,
            yAxis,
            tooltip
          }
        }
      })
    }
  }

  updateGraph = () => {
    let current_data = this.sortCurrentData()
    //let counter = Math.round(current_data.length / this.state.count)
    current_data = current_data.slice(this.state.firstindex, this.state.count)
    let cta = [];
    let record = [];
    current_data.forEach(data => {
      if (data.cta) {
        cta.push(data.cta)
      } else if (data.record_id) {
        record.push(data.record_id)
      }
    })
    if (cta.length > 0) {
      localStorage.setItem('cta', JSON.stringify(cta));
    }
    if (record.length > 0) {
      localStorage.setItem('record', JSON.stringify(record));
    }
    let pointWidth
    let current_height
    if (current_data.length > 25) {
      current_height = 2000
    } else {
      current_height = 600
    }

    if (current_data.length > 5) {
      pointWidth = undefined
    } else {
      pointWidth = 30
    }

    return {
      plotOptions: {
        ...this.state.options.plotOptions,
        series: {
          pointWidth
        }
      },
      chart: {
        ...this.state.options.chart,
        height: current_height
      },
      xAxis: {
        categories: current_data.map(data => data.reps_name),
        labels: {
          formatter: function () {
            if (cta.length > 0) {
              return `<a href="/search?val=${this.pos}">${this.value}<a>`
            } else if (record.length > 0) {
              let record = JSON.parse(localStorage.getItem('record'))
              return `<a href="/conversation-detail/${record[this.pos]}">${this.value}<a>`
            }
            return this.value
          }
        },
      },
      yAxis: {
        min: 0,
        max: 100,
        plotBands: [{
          from: current_data.length > 0 && current_data[0].min_recommended_range,
          to: current_data.length > 0 && current_data[0].max_recommended_range,
          color: 'rgba(6, 17, 213, .2)'
        }]
      },
      series: [
        {
          name: 'Recommended Range',
          data: current_data.map(data => data.value),
          fillColor: {
            linearGradient: [0, 0, 0, 300],
            stops: [
              [0, Highcharts.getOptions().colors[4]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[4]).setOpacity(0).get('rgba')]
            ]
          }
        }
      ],
      tooltip: {
        formatter: function () {
          return this.x + ': <b>' + this.y + '</b>'
        }
      }
    }
  }

  currentClickedCard = (e) => {
    let val = e.target.id
    this.setState(({
      val, count: 10,
      firstindex: 0,
      activePage: 1
    }))
  }
  onDropDownSort = (e) => {
    let sort = e.target.id
    this.setState(({ sort }))
  }

  sortCurrentData = () => {
    let current_data = []
    if (this.state.sort === 'Descending') {
      current_data = this.props.reps_dashboard_graph[this.state.val].data.sort((a, b) => Number(b.value) - Number(a.value));
    }
    if (this.state.sort === 'Ascending') {
      current_data = this.props.reps_dashboard_graph[this.state.val].data.sort((a, b) => Number(a.value) - Number(b.value));

    }
    return current_data
  }
  updateCount = (e) => {
    if (this.props.reps_dashboard_graph[this.state.val].data.length > 10) {
      if (e.target.value === 'more' && (this.state.count < this.props.reps_dashboard_graph[this.state.val].data.length)) {
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

  onChange = (activePage, pageSize) => {
    if (activePage === 1) {
      this.setState(({
        activePage,
        count: activePage * 10,
        firstindex: 0
      }))
    }
    this.setState(({
      activePage,
      count: activePage * 10,
      firstindex: (activePage - 1) * 10
    }))

  }

  itemRender = (current, type, element) => {
    //This function renders the number inside the pagination, We can style them here
    if (type === 'page') {
      current = current < 10 ? '0' + current : current;
      return <a>{current}</a>;
    }
    return element;
  };

  render() {

    return (
      <div className="reps conversation-graph calc-graph">
        <div className="topLeftCorner sub-full negmt20">
          {
            this.props.reps_dashboard_graph && Object.entries(this.props.reps_dashboard_graph).map((data, index) => {
              return <div key={index} className={this.state.val === 'widget' + (index + 2) ? "topLeftItem graph-tabBtn" : 'topLeftItem'} id={data[0]} onClick={this.currentClickedCard} >
                <div className="subItemWraper" style={{ pointerEvents: 'none' }}>
                  {
                    data[1].title.toLowerCase().includes(data[1].title.toLowerCase()) ? <p> { data[1].title} <span><i className="icon-avg-interactivity-switches"></i></span></p> :  data[1].title.toLowerCase().includes(data[1].title.toLowerCase()) ? <p>{ data[1].title} <span><i className="icon-help"></i></span></p> : data[1].title.toLowerCase().includes(data[1].title.toLowerCase()) ? <p> { data[1].title} <span><i className="icon-monologue"></i></span></p> : data[1].title.toLowerCase().includes(data[1].title.toLowerCase())? <p> { data[1].title } <span><i className="icon-dead-air"></i></span></p> : data[1].title.toLowerCase().includes(data[1].title.toLowerCase()) ?<p> { data[1].title } <span><i className="icon-sentiment"></i></span></p>: ""
                  }
                </div>
              </div>
            })
          }
        
        </div>
        <div className="graph-img mt30">
          <HighchartsReact highcharts={Highcharts} options={this.state.options} />
        </div>
        <div className="Rep-wise-footer">
          <div className="btn-group">
            <button type="button" className="btn selectdropdwon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {this.state.sort}
            </button>
            <div className="dropdown-menu graph-dropdown" onClick={this.onDropDownSort} style={{ width: "100%" }}>
              <button className="dropdown-item" id="Ascending">Ascending</button>
              <button className="dropdown-item" id="Descending">Descending</button>
            </div>
          </div>
          {(this.props.reps_dashboard_graph && this.props.reps_dashboard_graph[this.state.val].data.length > 10) && <div className="view-more-btn">
            <div className="pagination">
              <Pagination
                defaultPageSize={10}
                pageSize={10}
                defaultCurrent={1}
                current={this.state.activePage}
                showTitle={false}
                onChange={this.onChange}
                total={this.props.reps_dashboard_graph && this.props.reps_dashboard_graph[this.state.val].data.length}
                itemRender={this.itemRender}
              />
            </div>
            {/* <button onClick={this.updateCount} value="less">View Less</button>
        <button onClick={this.updateCount} value="more">View More</button>*/}
          </div>}
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    reps_dashboard_graph: state.dashboardInsightReducer.reps_dashboard_graph
  }
}

const mapActionToProps = {
  LoadRepsDashboardGraph: dashboardInsight.LoadRepsDashboardGraph
}

export default connect(mapStateToProps, mapActionToProps)(RepsDashboardGraph);
