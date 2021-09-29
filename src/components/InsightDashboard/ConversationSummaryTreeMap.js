// import React, { Component } from 'react'
import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// import moment from 'moment'

const ConversationSummaryTreeMap = (props) => {
    let [treeMap, updateTreeMap] = useState({
         options:{
            chart: {
                type: 'bar',
                height: 600
            },
            title: {
                text: null
            },
            credits: {
                enabled: false
              },     yAxis: {
                title: {
                    text: null
                },
            },
        
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            
         } 
    })

    const titleCase = (str) => {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
      }

    useEffect(() => {
        const { client_id, emailid } = props.user;
        props.plugin && props.plugin.length > 0 && props.LoadConversationSummary(client_id, emailid, props.date_filter.from, props.date_filter.to, props.plugin)   
        }, [props.plugin, props.date_filter.from, props.date_filter.to])

    useEffect(() => {
         let { xAxis, series, yAxis, tooltip } = updateGraph();
        let options = {
          ...treeMap.options,
          xAxis,
          series,
          yAxis,
          tooltip
        };
        updateTreeMap({
          ...treeMap,
          ...options
        })

    }, [props.summaryTags])

    const updateGraph = () => {
        
        let current_cat = []
        props.summaryTags !== undefined && props.summaryTags.length > 0 &&  props.summaryTags.map((data)=>{
            current_cat.push(titleCase(data.tag))
        })
        let current_data = []
        props.summaryTags !== undefined  &&  props.summaryTags.length > 0 && props.summaryTags.map((data)=>{
            current_data.push(data.current_count)
        })

        let previous_data = []
        props.summaryTags !== undefined && props.summaryTags.length > 0 && props.summaryTags.map((data)=>{
            previous_data.push(-data.previous_count)
        })
  
        return {
            xAxis: [{
                categories: current_cat,
                reversed: false,
                labels: {
                    step: 1
                },
                allowDecimals: false
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: current_cat,
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }],
            yAxis: {
                allowDecimals: false,
                labels: {
                    formatter: function () {
                        return Math.abs(this.value);
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.point.category + ': </b>'+ Math.abs(this.point.y);
                }
            },
            series: [{
                name: 'Previous',
                data: previous_data
            }, {
                name: 'Current',
                data: current_data
            }]
        }
       
    }
    
 

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="summary custom-component total-expert-mentions topics pad0 ttm">
                        <div className="total-expert-mentions-head set-flex justify-space-btwn">
                            <div className="left-heading">
                                <h4 className="component-title"> Summary Tags</h4>
                                {/* <p className="component-title-text fix-40"> Number of conversations with competition mentioned </p> */}
                            </div>
                       
                        </div>
                        <div className="total-expert-body common-body-top mt20 pad0">
                            <div className="top-traits-chart mt5 treemap">
                                {
                                 props.summaryTags !== undefined &&  props.summaryTags.length > 0 ? <HighchartsReact highcharts={Highcharts} options={treeMap}/>: props.summaryTags !== undefined && <div className="noFeedback">No Data Available</div>
                                      
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    return {
        user: state.authentication.user,
        summaryTags: state.dashboardInsightReducer.summaryTags
    }
}

const mapActionToProps = {
    LoadConversationSummary: dashboardInsight.LoadConversationSummary,
 
}

export default connect(mapStateToProps, mapActionToProps)(ConversationSummaryTreeMap);