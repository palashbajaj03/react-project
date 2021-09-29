import React, { useState,useEffect } from 'react'
import { connect } from 'react-redux';
import { dashboardAction } from '../../actions'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ReactGA from 'react-ga';
import moment from 'moment';
import { Link } from 'react-router-dom'
import { routingConstants } from '../../constants'


const BantMention =(props)=>{
    let [getTotalBant, setTotalBant] = useState({   options: {
        title: {
          text: null
        },
        xAxis: {
          title: null,
    
        },
        yAxis: {
          visible: false,
    
        },
        chart: {
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
        }
      }})
      
      
      useEffect(() => {   
        const { client_id, emailid } = props.user;
        let yesterday = moment().subtract(1, 'days').format("YYYY-MM-DD");
        yesterday = yesterday + "T23:59:59Z"
        props.loadNegativeConversation(client_id, emailid, yesterday); 
      }, [])
    
      useEffect(() => {   
        const { xAxis, series,tooltip, plotOptions } = updateGraph(); 
        let options = {
            ...getTotalBant.options,
            xAxis,
            series,
            tooltip,
            plotOptions
        };
        setTotalBant({
                   ...getTotalBant,
                   ...options
        }) 
      }, [props.negative])
    
      const updateGraph=()=>{
        return{
            plotOptions: {
        ...getTotalBant,
        series: {
          pointWidth:48,
          showInLegend: false,
        }
      },
        xAxis: {
            categories: props.negative && props.negative.bant_mentions.map(data => data.label),
            labels: {
              enabled: false
            },
          },
          tooltip: {
            formatter: function () {
              return this.x +": "+ this.y;
            }
          },
          series:[
            {
                name: 'Current',
                data:  props.negative && props.negative.bant_mentions.map(data => data.count),
                color: '#56b4f0'
              }
          ]
        }
      }

return (
    <div className="col-lg-3 col-md-6 col-sm-6 ">
    <Link to={{
      pathname: routingConstants.SEARCH,
      cta: props.negative && props.negative.cta
    }}>
      <div className="card-box nagative-box" onClick={_ => ReactGA.event({ category: "Negative: Conversation widget", action: "User clicked the Negative: Conversation widget", label: "Negative: Conversation" })}>
        <span className="oval-span"></span>
        {/* <h2> {props.negative ? props.negative.total : 0}   <span> <i>/</i> {props.conversion ?props.conversion.total : 0} </span> </h2> */}
        <div className="space"></div>
        <p> BANT Mention </p>
        {/* <h5 className="percent-coversation">{props.negative ? props.negative.percent : 0}%  <span> of total conversations </span></h5> */}
        <div className="nagative-icon">
        
          <img src="/static/images/negative-conversations-icon.svg" alt="icon" />
        </div>
        <div className="graph-img chart-inside-box">
          <HighchartsReact highcharts={Highcharts} options={getTotalBant} />
        </div> 
      </div>
    </Link>
  </div>
)
}
const mapStateToProps = state => {
    return {
      user: state.authentication.user,
      negative: state.dashboardReducer.negativeConversation,
    }
  }
  
  const mapActionToProps = {
    loadNegativeConversation: dashboardAction.negativeConversation,
  }
  
  export default connect(mapStateToProps, mapActionToProps)(BantMention);