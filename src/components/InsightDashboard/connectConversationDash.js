import React, { useMemo, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment'
import uuid from 'uuid';

Highcharts.setOptions({
  time: {
    useUTC: false
  }
})

const ConnectConversationDash = (props) => {
  let [toggle, updateToggle] = useState(false)
  let [connectStates, updateConnectStates] = useState(['ivr', 'gatekeeper', 'contact'])
  let [states] = useState([{ key: 'IVR', id: 'ivr' }, { key: 'Gatekeeper', id: 'gatekeeper' }, { key: 'Contact', id: 'contact' }])
  let [connectCondition, updateConnectCondition] = useState("or")
  let [connect, updateConnect] = useState({
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
        tickInterval: 70,
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
  })

  useEffect(() => {
    const { client_id, emailid } = props.user;
    props.plugin.length > 0 && connectStates.length >= 0 && props.LoadConnectConvDash(client_id, emailid, props.date_filter.from, props.date_filter.to, connectStates, connectCondition, props.plugin);
    // updateGraph();
  }, [props.plugin, props.date_filter.from, props.date_filter.to, connectStates, connectCondition])

  useEffect(() => {
    let { xAxis, series, tooltip } = updateGraph();
    let options = {
      ...connect.options,
      xAxis,
      series,
      tooltip
    };
    updateConnect({
      ...connect,
      ...options
    })
  }, [props.connectConvDash, toggle])

  const updateGraph = () => {
    if (!toggle) {
      let current_graph_enabled = props.connectConvDash && props.connectConvDash.filter((data) => {
        return data.period === 'current'
      })
      let cta = []
      current_graph_enabled && current_graph_enabled.forEach(data => {
        if (data.cta) {
          cta.push(data.cta)
        }
      })
      if (cta.length > 0) {
        localStorage.setItem('ctaCONNECT', JSON.stringify(cta));
      }
      let categories = connectStates.length !== 0?current_graph_enabled && current_graph_enabled.map(data => moment(data.date).format('MMM DD')):[0]
      return {
        xAxis: {
          categories,
          labels: {
            formatter: function () {
              if (cta.length > 0) {
                return `<a href="/search?valConnect=${this.pos}">${this.value}<a>`
              }
              return this.value
            }
          },
        },
        tooltip: {
          formatter: function () {
            return '<b>Connect: ' + this.point.y;
          }
        },
        series: [
          {
            name: "Current",
            marker: {
              // enabled
            },
            data: connectStates.length !== 0?current_graph_enabled && current_graph_enabled.map(data => data.count):[0],
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
    } else {
      let current_graph_enabled1 = props.connectConvDash && props.connectConvDash.filter((data) => {
        return data.period === 'current'
      })
      let current_graph_enabled2 = props.connectConvDash && props.connectConvDash.filter((data) => {
        return data.period === 'previous'
      })
      let cta = []
      current_graph_enabled1 && current_graph_enabled1.forEach(data => {
        if (data.cta) {
          cta.push(data.cta)
        }
      })
      if (cta.length > 0) {
        localStorage.setItem('ctaCONNECT', JSON.stringify(cta));
      }
      let categories = connectStates.length !== 0?current_graph_enabled1 && current_graph_enabled1.map(data => moment(data.date).format('MMM DD')):[0]
      return {
        xAxis: {
          categories,
          labels: {
            formatter: function () {
              if (cta.length > 0) {
                return `<a href="/search?valConnect=${this.pos}">${this.value}<a>`
              }
              return this.value
            }
          },
        },
        tooltip: {
          formatter: function () {
            return '<b>Connect: ' + this.point.y;
          }
        },
        series: [
          {
            name: "Current",
            marker: {
              // enabled
            },
            data: connectStates.length !== 0?current_graph_enabled1 && current_graph_enabled1.map(data => data.count):[0],
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
              // enabled
            },
            data: connectStates.length !== 0?current_graph_enabled2 && current_graph_enabled2.map(data => data.count):[0],
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
  const handleCheckBox = (e) => {
    let id = e.target.id
    if (!e.target.checked) {
      let i
      i = connectStates.indexOf(id)
      let arr = connectStates
      arr.splice(i, 1)
      updateConnectStates([...arr])
    }
    if (e.target.checked) {
      let arr = []
      arr = connectStates.concat(id)
      updateConnectStates(arr)
    }
  }

  const toggleCondition = e => {
    if (!e.target.checked) {
      updateConnectCondition('or')
    }
    if (e.target.checked) {
      updateConnectCondition('and')
    }
  }
  const controlToggle = e => {
    let tog = !toggle
    updateToggle(tog)
  }
  return (

    <div className="row">
      <div className="col-lg-12 col-md-12 col-sm-12">
        <div className="custom-component pad0 connect-convo">
          <div className="Rep-wise-header">
            <div>
              <h4 className="component-title"> Connect </h4>
              {/* <p className="component-title-text"> Number of conversations at a specific day and time </p> */}
            </div>
            <div className="custom-switch-check reverse-toggle">
              <label className="switch-check" for="CONNECT">
                <div className="yes">AND</div>
                <div className="no">OR</div>
                <input type="checkbox" id="CONNECT" name="CONNECT" onChange={toggleCondition} />
                <div className="slider-check round"></div>
              </label>
            </div>
          </div>
          <div className="Rep-wise-body">
            <div className="top-traits-chart mt5">
              <HighchartsReact highcharts={Highcharts} options={connect} />
            </div>

          </div>
          <div className="Rep-wise-footer">
            {<div className="customize-bar-row pad0">
              <div className="customizable-btn">
                <div className="comp-btn">
                  <button className={toggle ? 'toggleActive' : ''} onClick={controlToggle}>Compare
                         <div className="in-out-btn">
                      <span className="in-out-ball"></span>
                    </div>
                  </button>
                </div>
              </div>
            </div>}
            <div className="customize-bar-row pad0">
              <div className="btn-sets">
                {
                  states && states.map((data, index) => {
                    return <React.Fragment key={index}>
                      <div className="set-btn">
                        <div className="custom-control custom-checkbox">
                          <input id={data.id} onChange={handleCheckBox} type="checkbox" name='speakers' checked={connectStates.includes(data.id)} className="custom-control-input default-checkbox" />
                          <label className="custom-control-label default-font" for={data.id}>{data.key}</label>
                        </div>
                      </div>
                      <div className="vertical-bar"></div>
                    </React.Fragment>
                  })
                }

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  connectConvDash: state.dashboardInsightReducer.connectConvDash
})

const mapActionToProps = {
  LoadConnectConvDash: dashboardInsight.LoadConnectConvDash
}

export default connect(mapStateToProps, mapActionToProps)(ConnectConversationDash)