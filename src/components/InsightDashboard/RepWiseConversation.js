import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { dashboardInsight } from '../../actions'
import moment from 'moment'
import Scrollbar from 'react-scrollbars-custom';
const RepWiseConversation = (props) => {
  let [repsChecked, updateRepsChecked] = useState([])
  let [toggle, updateToggle] = useState(false)
  let [repData, updateRepData] = useState({
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
    props.repInitial !== undefined && props.repInitial.length > 0 && updateRepsChecked(props.repInitial);
  }, [props.repInitial])

  useEffect(() => {
    const { client_id, emailid } = props.user
    const { date_filter, plugin } = props
    let id = props.repData !== undefined && props.repData.length > 0 && repsChecked
    plugin !== undefined && plugin.length > 0 && props.repInitial !== undefined && props.repInitial.length > 0 && props.LoadRepWiseConversation(client_id, emailid, id, date_filter.from, date_filter.to, plugin)
  }, [props.plugin, props.date_filter.from, props.date_filter.to, repsChecked])

  useEffect(() => {
    let { xAxis, series } = updateGraph();
    let options = {
      ...repData.options,
      xAxis,
      series,
      // tooltip
    };
    updateRepData({
      ...repData,
      ...options
    })
  }, [props.repWiseConversation])

  const updateGraph = _ => {
    let filteredData = props.repWiseConversation !== undefined && props.repWiseConversation.length > 0 && props.repWiseConversation.filter(data => data.period === "current")
    let categories = props.repWiseConversation && props.repWiseConversation.length > 0 && filteredData.map((data) => { return moment(data.date).format('MMM DD') })
    let series = []
    let color = ['#555ff6', '#38a7ed']
    repsChecked && repsChecked.map((data) => {
      props.repWiseConversation !== undefined && props.repWiseConversation.length > 0 && filteredData.map((dat) => {
        if (data === dat.rep_id) {
          series.length === 0 && series.push({
            name: dat.rep_name,
            data: [],
            color: color[0],
            fillColor: {
              linearGradient: [0, 0, 0, 300],
              stops: [
                [0, color[0]],
                [1, color[0]]
              ]
            }
          })
          series.map((da, ind) => {
            if (dat.rep_name === da.name) {
              series[ind].data.push(dat.count)
            } else {
              series.length === 1 && series.push({
                name: dat.rep_name,
                data: [dat.count],
                color: color[1],
                fillColor: {
                  linearGradient: [0, 0, 0, 300],
                  stops: [
                    [0, color[1]],
                    [1, color[1]]
                  ]
                }
              })
            }
          })
        }
      })
    })
    return {
      xAxis: {
        categories
      },
      series
    }
  }
  const onDropDownRep = (e) => {
    let id = e.target.id
    if(repsChecked.length < 2){
      updateRepsChecked(repsChecked.concat(id))
      if (!e.target.checked) {
          let string = e.target.id
          let searchinput = repsChecked
          var index = searchinput && searchinput.indexOf(string);
          if (index !== '' && index > -1) {
            searchinput.splice(index, 1)
            updateRepsChecked([...searchinput])
          }
      }
    }else{
      updateToggle(true)
      setTimeout(()=>{
        updateToggle(false)
      },2000)
      if (!e.target.checked) {
        let string = e.target.id
        let searchinput = repsChecked
        var index = searchinput && searchinput.indexOf(string);
        if (index !== '' && index > -1) {
          searchinput.splice(index, 1)
          updateRepsChecked([...searchinput])
        }
    }
    }
  }
  return (
    <React.Fragment>
      <div className="row mt25">
        <div className="col-lg-12 col-md-12 col-md-12">
          <div className="conversation-graph bordered pad0 padtp0">
            <div className="Rep-wise-header">
              <div className="headings">
                <h4 className="component-title">Conversations</h4>
              </div>
              <div className="btn-group">
                {<button type="button" className="btn selectdropdwon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Select Reps
                </button>}
                <div className="dropdown-menu graph-dropdown set-custom-size-dropdown" style={{ width: "100%" }}>
                  {toggle && <span className="invalid-text lineHeight">Atmost two reps will be selected</span>}
             

                  <ul>
                  <Scrollbar style={{height:"260px"}}>
                    { props.repWiseConversation !== undefined && props.repData && props.repData.map((data, index) => {
                      return data.name !=='Anirudhan ' && <li key={index}>
                        <div class="form-group dropDownText checkboxContainer">
                          <input name="isGoing" type="checkbox" onChange={onDropDownRep} id={data.rep_id} checked={props.repWiseConversation !== undefined && repsChecked.includes(data.rep_id)}/>
                          <span class="checkBoxText">{data.name}</span><span class="virtualBox"></span></div>
                        </li>
                       {/* <li key={index}>
                         <div className="custom-control custom-checkbox">
                          <input type="checkbox" name="connect" onChange={onDropDownRep} className="custom-control-input default-checkbox" id={data.rep_id}
                            checked={props.repWiseConversation !== undefined && repsChecked.includes(data.rep_id)}
                          />
                          <label className="custom-control-label default-font" for={data.rep_id}>{data.name}</label>
                        </div>
                      </li> */}
                    })}
                    </Scrollbar>
                  </ul>

                </div>
              </div>
            </div>
            <div className="graph-img mb15 pad15">
              <HighchartsReact highcharts={Highcharts} options={repData} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  repWiseConversation: state.dashboardInsightReducer.repWiseConversation
})

const mapActionToProps = {
  LoadRepWiseConversation: dashboardInsight.LoadRepWiseConversation
}

export default connect(mapStateToProps, mapActionToProps)(RepWiseConversation)