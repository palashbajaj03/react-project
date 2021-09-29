import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dashboardInsight, conversationAction, configureAction } from '../actions';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import moment from 'moment'
import InsightCards from '../components/InsightDashboard/InsightCards';
import RepWiseOpportunityCard from '../components/InsightDashboard/RepWiseOpportunityCard'
import RepsFollowAppointmentGraph from '../components/InsightDashboard/RepsFollowAppointmentGraph'
import RepsDashboardGraph from '../components/InsightDashboard/RepsDashboardGraph';
import SentimentLevelCard from '../components/InsightDashboard/SentimentLevelCard'
import RepWiseConversation from '../components/InsightDashboard/RepWiseConversation'
import RepsWiseTopics from '../components/InsightDashboard/RepsWiseTopics';
import { timezoneDateCalculator } from '../constants'

class InsightRepsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastdays: 'Last 7 days',
      // value: this.props.match.params.value,
      date: [],
      list_plugins: [],
      list_plugin: [],
      // date_from: moment().subtract(7, 'days').format("YYYY-MM-DD") + "T00:00:00Z",
      // date_to: moment().subtract(1, 'days').format("YYYY-MM-DD") + "T23:59:59Z",
    }
  }

  onChange = (date) => {
    let time = timezoneDateCalculator('Custom Range', this.props.user.timezone, date[0], date[1])
    this.setState(() => ({
      date_to_range: moment(date[1]).format("MMM D YYYY"),
      date_from_range: moment(date[0]).format("MMM D YYYY"),
      date_to_temp: time.to,
      date_from_temp: time.from,
    }))
  }


  onDropDownFilter = (e) => {
    const days = e.target.id
    if (days === 'Custom Range') {
      this.setState(() => ({
        calendarToggle: !this.state.calendarToggle,
        lastdays: 'Custom Range'
      }))

    } else {
      
      let time = timezoneDateCalculator(days, this.props.user.timezone)
      this.setState(() => ({
        lastdays: days,
        date_from: time.from,
        date_to: time.to
      }))

    }


    // if (e.target.id === 'Yesterday') {
    //   this.setState(() => ({
    //     lastdays: 'Yesterday',
    //     date_from: moment().subtract(1, 'days').format("YYYY-MM-DD") + "T00:00:00Z",
    //     date_to: moment().subtract(1, 'days').format("YYYY-MM-DD") + "T23:59:59Z"
    //   }))
    //   return true
    // }
    // if (e.target.id === 'Last Month') {

    //   this.setState(() => ({
    //     lastdays: 'Last Month',
    //     date_from: moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD") + "T00:00:00Z",
    //     date_to: moment().subtract(1, 'months').endOf('month').format("YYYY-MM-DD") + "T23:59:59Z"
    //   }))
    //   return true
    // }
    // if (e.target.id === 'custom_range') {
    //   this.setState(() => ({
    //     calendarToggle: !this.state.calendarToggle,
    //     lastdays: 'Custom Range'
    //   }))
    //   return true
    // }
    // let date_to = moment().subtract(1, 'days').format("YYYY-MM-DD") + "T23:59:59Z";
    // let date_from = moment().subtract(e.target.id, 'days').format("YYYY-MM-DD") + "T00:00:00Z";
    // this.setState(() => ({
    //   lastdays: 'Last ' + days + ' days',
    //   date_to,
    //   date_from
    // }))
  }

  calenderCustomRangeApply = () => {
    // let date_to = moment(this.state.date_to_range).format("YYYY-MM-DD") + "T23:59:59Z";
    // let date_from = moment(this.state.date_from_range).format("YYYY-MM-DD") + "T00:00:00Z";
    this.setState(() => ({
      calendarToggle: false,
      date_to: this.state.date_to_temp,
      date_from: this.state.date_from_temp,
    }))
    var datePicker = document.getElementsByClassName('react-daterange-picker__calendar--open')[0];
    datePicker.classList.remove('react-daterange-picker__calendar--open')
    datePicker.classList.add('react-daterange-picker__calendar--closed')
  }

  calenderCustomRangeCancel = () => {
    this.setState(() => ({
      calendarToggle: false
    }))
    var datePicker = document.getElementsByClassName('react-daterange-picker__calendar--open')[0];
    datePicker.classList.remove('react-daterange-picker__calendar--open')
    datePicker.classList.add('react-daterange-picker__calendar--closed')
  }

  selectPlugin = (e) => {
    e.preventDefault();
    let pluginId = e.target.id

    if (e.target.checked) {
      this.setState(prevState => ({
        list_plugins: [...prevState.list_plugins, pluginId],
      }))
    }
    if (!e.target.checked) {
      let plugins = [...this.state.list_plugins];
      let index = plugins.indexOf(pluginId);
      plugins.splice(index, 1);
      this.setState(() => ({ list_plugins: plugins }))
    }
  }

  componentDidMount() {
    const { client_id, emailid } = this.props.user;
    this.props.LoadPluginList(client_id, emailid)
    this.props.loadHierarchy({ client_id, emailid })
    this.props.loadTopicList(client_id, emailid)

    let time = timezoneDateCalculator('Last 7 Days', this.props.user.timezone)
    this.setState(() => ({
      date_to: time.to,
      date_from: time.from,
    }))
  }

  componentDidUpdate(prevProps) {
    if (this.props.pluginListInsight !== prevProps.pluginListInsight) {
      this.setState(() => ({
        list_plugins: this.props.pluginListInsight.map((plugin) => plugin.id)
      }))
    }
    if(this.props.userHierarchy !== prevProps.userHierarchy){
      let tempData = this.props.userHierarchy.sort((a, b) => a.name.localeCompare(b.name)).length > 0 && this.props.userHierarchy.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 1);
      let temp = [];
      tempData.map((data)=>{
          temp.push(data.rep_id)
      })
     this.setState(() => ({
      userDataFull:  this.props.userHierarchy.sort((a, b) => a.name.localeCompare(b.name)),
      initialData: temp
    }))
    }
    if (this.props.readTopics !== prevProps.readTopics) {
      this.setState(({ topics: this.props.readTopics }))
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="page-title-row">
          <div className="page-title-box">
            <h2 className="page-title"> Reps Dashboard </h2>
            {/* <!-- <span className="page-title-text"> Here is your customised home page </span> --> */}
          </div>
          <div className="sortingBtns">
            <div className="sortBtn btn-group">
              <button type="button" className="btn selectdropdwon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {this.state.lastdays}
              </button>
              <div className="dropdown-menu graph-dropdown" onClick={this.onDropDownFilter} style={{ width: "100%" }}>
              <button className="dropdown-item" id="Yesterday">Yesterday</button>
                <button className="dropdown-item" id="Last 7 Days">Last 7 days</button>
                <button className="dropdown-item" id="Last 14 Days">Last 14 days</button>
                <button className="dropdown-item" id="Last 28 Days">Last 28 days</button>
                <button className="dropdown-item" id="Last Month">Last Month</button>
                <button className="dropdown-item custom-range-item" id="Custom Range">Custom Range</button>
                {/* <button className="dropdown-item" id="Yesterday">Yesterday</button>
                <button className="dropdown-item" id="7">Last 7 days</button>
                <button className="dropdown-item" id="14">Last 14 days</button>
                <button className="dropdown-item" id="28">Last 28 days</button>
                <button className="dropdown-item" id="Last Month">Last Month</button>
                <button className="dropdown-item custom-range-item" id="custom_range">Custom Range</button> */}
              </div>
              {
                this.state.calendarToggle && <React.Fragment> <div className="date-custom-range insight-dashboard">
                  {
                    this.state.date_from_range && this.state.date_to_range &&
                    <div className="cal-custom-range"> <span>{this.state.date_from_range}</span>  -  <span>{this.state.date_to_range}</span></div>
                  }
                  <DateRangePicker
                    isOpen={true} //default open state
                    maxDate={new Date()} // cannot select more than today
                    onChange={this.onChange} //API call here
                    onCalendarClose={() => {
                      var datePicker = document.getElementsByClassName('react-daterange-picker__calendar--closed')[0];
                      datePicker.classList.remove('react-daterange-picker__calendar--closed')
                      datePicker.classList.add('react-daterange-picker__calendar--open')
                      this.setState(() => ({
                        calendarToggle: true,
                      }))
                    }}
                    className="displaynoneinput"
                  />
                  <div className="date-buttons"><button onClick={this.calenderCustomRangeApply}> Apply </button> <button onClick={this.calenderCustomRangeCancel}> Cancel</button> </div>
                </div>
                </React.Fragment>
              }
            </div>
            <div className="sortBtn Insight-Plugin">
              <div className="dropdown">
                <button type="button" className="dropdown-toggle" data-toggle="dropdown">Plugin</button>
                <div className="dropdown-menu" aria-labelledby="selectCollection">
                  <ul>
                    {
                      this.props.pluginListInsight && this.props.pluginListInsight.map((plugin) => (
                        <li key={Math.random()}>
                          <div className="form-group dropDownText checkboxContainer">
                            <input name="pluginList" type="checkbox" id={plugin.id} value={plugin.label} onChange={this.selectPlugin} checked={this.state.list_plugins.includes(plugin.id)}
                            />
                            <span className="checkBoxText">{plugin.label}</span>
                            <span className="virtualBox"></span>
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="car-box-row insight-box-row mt50">
          <InsightCards dashboard={this.props.dashboard} date_filter={{ from: this.state.date_from, to: this.state.date_to }} plugin={this.state.list_plugins.length > 0 ? this.state.list_plugins : this.state.list_plugin} />
        </div>
        <div className="key-matrices-graph mt45">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
                  <RepsDashboardGraph date_filter={{ from: this.state.date_from, to: this.state.date_to }} plugin={this.state.list_plugins.length > 0 ? this.state.list_plugins : this.state.list_plugin} />
                  </div>
  
          </div>
          <div className="row">
          <div className="col-lg-8 col-md-8 col-sm-12">
           <RepWiseConversation date_filter={{ from: this.state.date_from, to: this.state.date_to }} plugin={this.state.list_plugins.length > 0 ? this.state.list_plugins : this.state.list_plugin} repData={this.state.userDataFull !== undefined && this.state.userDataFull} repInitial={this.state.initialData !== undefined && this.state.initialData}/>           
          </div>
          <div className="col-lg-4 col-md-8 col-sm-12">
                    <RepWiseOpportunityCard date_filter={{ from: this.state.date_from, to: this.state.date_to }} plugin={this.state.list_plugins.length > 0 ? this.state.list_plugins : this.state.list_plugin} />
              </div>
          </div>  

          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
                  <RepsWiseTopics date_filter={{ from: this.state.date_from, to: this.state.date_to }} plugin={this.state.list_plugins.length > 0 ? this.state.list_plugins : this.state.list_plugin} topics={this.state.topics !== null && this.state.topics !== undefined && this.state.topics}/>
                  </div>
  
          </div>
          {/* <div className="row">
            <div className="col-lg-12 col-md-12 col-md-12">
              <div className="combine">

                <RepsFollowAppointmentGraph date_filter={{ from: this.state.date_from, to: this.state.date_to }} plugin={this.state.list_plugins.length > 0 ? this.state.list_plugins : this.state.list_plugin} />

              </div>
            </div>
          </div> */}

        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    access: state.authentication.access,
    pluginListInsight: state.dashboardInsightReducer.pluginList,
    userHierarchy: state.conversationReducer.hierarchy,
    readTopics: state.configureReducer.readTopics,
  }
}

const mapActionToProps = {
  LoadPluginList: dashboardInsight.LoadPluginList,
  loadHierarchy: conversationAction.loadHierarchy,
  loadTopicList: configureAction.loadTopicList,
}

export default connect(mapStateToProps, mapActionToProps)(InsightRepsContainer);