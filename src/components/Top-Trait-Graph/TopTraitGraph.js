import React, { Component } from 'react'
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from "highcharts-react-official";

import './TopTraitGraph.css'

const options = {
  chart: {
    type: 'areaspline',
   polar:true
  },
  credits: {
   enabled:false
  },
  title: {
    text: 'Highcharts Polar Chart'
},
subtitle: {
  text: 'Also known as Radar Chart'
},
  pane: {
    startAngle: 0,
    endAngle: 360
  },
  xAxis: {
    tickInterval: 90,
    min: 0,
    max: 360,
    labels: {
      format: '{value}°'
    }
  },
  yAxis: {
    min: 0,
  },
  plotOptions: {
    series: {
      pointStart: 0,
      pointInterval: 45
    },
    column: {
      pointPadding: 0,
      groupPadding: 0
    }
  },
  series: [
    {
      type: 'area',
      name: 'Line',
      data: [1, 2, 3, 4, 5, 6, 7, 8,9],
      marker: {
        enabled:false
      }
  }
  ]
};

export default class TopTraitGraph extends Component {
  render() {
    HighchartsMore(Highcharts);
    return (
      <div className="col-lg-6 col-md-12 col-sm-12">
        <div className="custom-component mt25 top-traits">
          <div className="top-traits-header">
            <div>
              <h4 className="component-title"> Top Traits  </h4>
              <p className="component-title-text"> Distinguishing quality or characteristic belonging to a person/team </p>
            </div>

            <div className="btn-group float-right">
              <button type="button" className="btn selectdropdwon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                All Reps
                        </button>
              <div className="dropdown-menu">
                <button className="dropdown-item" href="#">All Reps</button>
                <button className="dropdown-item" href="#">All Reps</button>
                <button className="dropdown-item" href="#">All Reps</button>
                <button className="dropdown-item" href="#">All Reps</button>
              </div>
            </div>
          </div>
          <div className="top-traits-chart mt5">
            {<img src="/static/images/top-trails-chart.jpg" alt="img"/>}
            {/*<HighchartsReact highcharts={Highcharts} options={options} />*/}
          </div>

        </div>

      </div>
    )
  }
}
