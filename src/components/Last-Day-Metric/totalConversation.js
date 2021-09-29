import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { dashboardAction } from '../../actions'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ReactGA from 'react-ga';
import moment from 'moment';
import { Link } from 'react-router-dom'
import { routingConstants } from '../../constants'

const TotalConversation = (props) => {
  let [getTotalConversation, setTotalConversation] = useState({
    options: {
      title: {
        text: null
      },
      xAxis: {
        title: null,
        labels:
        {
          enabled: false
        }
      },
      yAxis: {
        visible: false,

      },
      chart: {
        // width:250,
        height: 164,
        type: 'column',
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          },
        }
      },
    }
  })

  useEffect(() => {
    const { client_id, emailid } = props.user;
    let yesterday = moment().subtract(1, 'days').format("YYYY-MM-DD");
    yesterday = yesterday + "T23:59:59Z"
    props.loadConversion(client_id, emailid, yesterday);
  }, [])

  useEffect(() => {
    const { xAxis, series, tooltip, plotOptions } = updateGraph();
    let options = {
      ...getTotalConversation.options,
      xAxis,
      series,
      tooltip,
      plotOptions
    };
    setTotalConversation({
      ...getTotalConversation,
      ...options
    })
  }, [props.conversation])

  useEffect(() => {
    document.querySelectorAll('.apportunity-box g.highcharts-series rect').forEach(function (ele, index) {
      index !== 0 && ele.setAttribute('x', parseInt(ele.getAttribute('x')) - 96)
    })
  })

  const updateGraph = () => {
    return {
      plotOptions: {
        ...getTotalConversation,
        series: {
          pointWidth: 48,
          showInLegend: false,

        }
      },
      xAxis: {
        categories: props.conversation && props.conversation.plugin_wise.map(data => data.label),
        labels: {
          enabled: false
        },
      },
      tooltip: {
        formatter: function () {
          return this.x + ": " + this.y;
        }
      },
      series: [
        {
          name: 'Current',
          data: props.conversation && props.conversation.plugin_wise.map(data => data.count),
          color: '#6e77f7'
        }
      ]
    }
  }
  return (
    <div className="col-lg-3 col-md-6 col-sm-6 ">
      <Link to={{
        pathname: routingConstants.SEARCH,
        cta: props.conversation && props.conversation.cta
      }}>
        <div className="card-box apportunity-box" onClick={_ => {
          ReactGA.event({ category: "Opportunity: Conversion widget", action: "User clicked the Opportunity: Conversion widget", label: "Opportunity: Conversion" });
        }}>
          <span className="oval-span"></span>
          <h2> {props.conversation ? props.conversation.total : 0}   {/*<span> <i>/</i> {props.conversion ?props.conversion.total : 0} </span>*/} </h2>
          <p> Total Conversation </p>
          {/* <h5 className="percent-coversation"> {props.conversion ? props.conversion.value : 0} <span> of total conversations </span></h5> */}
          <div className="apport-icon">
            <img src="/static/images/opportunity-conversion-icon.svg" alt="icon" />
          </div>
          <div className="graph-img chart-inside-box">
            <HighchartsReact highcharts={Highcharts} options={getTotalConversation} />
          </div>
        </div>
      </Link>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    conversation: state.dashboardReducer.opportunityConversion
  }
}

const mapActionToProps = {
  loadConversion: dashboardAction.opportunityConversion
}

export default connect(mapStateToProps, mapActionToProps)(TotalConversation);