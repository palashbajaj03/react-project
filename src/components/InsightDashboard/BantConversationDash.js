import React, { useMemo, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { dashboardInsight } from '../../actions'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment'

Highcharts.setOptions({
  time: {
    useUTC: false
  },

})
const BantConversationDash = (props) => {
  let [toggle, updateToggle] = useState(false)
  let [bantId, updateBantId] = useState([])
  let [bantCondition, updateBantCondition] = useState("or")
  let [bant, updateBant] = useState({
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
    let id = props.topics && props.topics.filter((data) => {
      return data.type === 'signals' && data.name !=='Next Steps' && data
    }).map((dat) => {
      return dat.id
    })
    id !== undefined && id.length > 0 && id.map((data) => {
      return bantId.push(data)
    })
    let unique = [...new Set(bantId)];
    updateBantId(unique);
  }, [props.topics])

  useEffect(() => {
    const { client_id, emailid } = props.user;
    props.plugin.length > 0 && bantId.length > 0 && props.LoadBantConvDash(client_id, emailid, props.date_filter.from, props.date_filter.to, bantId, bantCondition, props.plugin);
  }, [props.plugin, props.date_filter.from, props.date_filter.to, bantId, bantCondition])

  useEffect(() => {
    let { xAxis, series, tooltip } = updateGraph();
    let options = {
      ...bant.options,
      xAxis,
      series,
      tooltip
    };
    updateBant({
      ...bant,
      ...options
    })
  }, [props.bantConvDash, toggle])

  const updateGraph = () => {
    if (!toggle) {
      let current_graph_enabled = props.bantConvDash && props.bantConvDash.filter((data) => {
        return data.period === 'current'
      })
      let cta = []
      current_graph_enabled && current_graph_enabled.forEach(data => {
        if (data.cta) {
          cta.push(data.cta)
        }
      })
      if (cta.length > 0) {
        localStorage.setItem('ctaBANT', JSON.stringify(cta));
      }
      let categories = bantId.length!== 0?current_graph_enabled && current_graph_enabled.map(data => moment(data.date).format('MMM DD')):[0]
      return {
        xAxis: {
          categories,
          labels: {
            formatter: function () {
              if (cta.length > 0) {
                return `<a href="/search?valBant=${this.pos}">${this.value}<a>`
              }
              return this.value
            }
          },
        },
        tooltip: {
          formatter: function () {
            return '<b>BANT: ' + this.point.y;
          }
        },
        series: [
          {
            name: "Current",
            marker: {
              // enabled
            },
            data: bantId.length!== 0?current_graph_enabled && current_graph_enabled.map(data => data.count):[0],
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
      let current_graph_enabled1 = props.bantConvDash && props.bantConvDash.filter((data) => {
        return data.period === 'current'
      })
      let current_graph_enabled2 = props.bantConvDash && props.bantConvDash.filter((data) => {
        return data.period === 'previous'
      })
      let cta = []
      current_graph_enabled1 && current_graph_enabled1.forEach(data => {
        if (data.cta) {
          cta.push(data.cta)
        }
      })
      if (cta.length > 0) {
        localStorage.setItem('ctaBANT', JSON.stringify(cta));
      }
      let categories = bantId.length!== 0?current_graph_enabled1 && current_graph_enabled1.map(data => moment(data.date).format('MMM DD')):[0]
      return {
        xAxis: {
          categories,
          labels: {
            formatter: function () {
              if (cta.length > 0) {
                return `<a href="/search?valBant=${this.pos}">${this.value}<a>`
              }
              return this.value
            }
          },
        },
        tooltip: {
          formatter: function () {
            return '<b>BANT: ' + this.point.y;
          }
        },
        series: [
          {
            name: "Current",
            marker: {
              // enabled
            },
            data: bantId.length!== 0?current_graph_enabled1 && current_graph_enabled1.map(data => data.count):[0],
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
            data: bantId.length!== 0?current_graph_enabled2 && current_graph_enabled2.map(data => data.count):[0],
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
      i = bantId.indexOf(id)
      let arr = bantId
      arr.splice(i, 1)
      updateBantId([...arr])
    }
    if (e.target.checked) {
      let arr = []
      arr = bantId.concat(id)
      updateBantId(arr)
    }
  }

  const toggleCondition = e => {
    if (!e.target.checked) {
      updateBantCondition('or')
    }
    if (e.target.checked) {
      updateBantCondition('and')
    }
  }
  const controlToggle = e => {
    let tog = !toggle
    updateToggle(tog)
  }
  return (

    <div className="row">
      <div className="col-lg-12 col-md-12 col-sm-12">
        <div className="custom-component bant-convo pad0">
          <div className="Rep-wise-header">
            <div>
              <h4 className="component-title"> BANT </h4>
              {/* <p className="component-title-text"> Number of conversations at a specific day and time </p> */}
            </div>
            <div className="custom-switch-check reverse-toggle">
              <label className="switch-check" for="BANT">
                <div className="yes">AND</div>
                <div className="no">OR</div>
                <input type="checkbox" id="BANT" name="BANT" onChange={toggleCondition} />
                <div className="slider-check round"></div>
              </label>
            </div>
          </div>
          <div className="Rep-wise-body">
            <div className="top-traits-chart mt5">
              <HighchartsReact highcharts={Highcharts} options={bant} />
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
                  props.topics && props.topics.map((data, index) => {
                   
                    return data.type === 'signals' && data.name !=='Next Steps' && data.value.length > 0 && <React.Fragment key={index}>
                      <div className="set-btn">
                        <div className="custom-control custom-checkbox">
                          <input id={data.id} onChange={handleCheckBox} type="checkbox" name='speakers' checked={bantId.includes(data.id)} className="custom-control-input default-checkbox" />
                          <label className="custom-control-label default-font" for={data.id}>{data.name}</label>
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
  bantConvDash: state.dashboardInsightReducer.bantConvDash
})

const mapActionToProps = {
  LoadBantConvDash: dashboardInsight.LoadBantConvDash
}

export default connect(mapStateToProps, mapActionToProps)(BantConversationDash)