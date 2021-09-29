import React, { Fragment } from 'react'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import moment from 'moment'
import uuid from 'uuid'
import { configureAction } from '../../actions'
import { connect } from 'react-redux';
import { ApiConst } from '../../constants'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

class IntegrationDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      calendarToggle: false,
      date_from_range: '',
      date_to_range: '',
      date_from: '',
      date_to: '',
      name: '',
      password: '',
      subDomain: '',
      rep_emails: [],
      rep_names: [],
      searchInput: '',
      message: false,
      reAuthButton: false
    }
  }

  componentDidMount() {
    const { client_id, emailid } = this.props.user
    this.props.listPluginsList(client_id, emailid)
    this.onTimeVerification()
  }
  componentDidUpdate(prevProps) {
    if ((prevProps.pluginsList !== this.props.pluginsList) || (prevProps.match.params.integration_channel !== this.props.match.params.integration_channel)) {
      let pluginName = this.props.match.params.integration_channel
      let plugin = this.props.pluginsList && this.props.pluginsList.filter(plugin => {
        if (plugin.name === pluginName) {
          return plugin
        }
      })
      this.setState(() => ({
        selectedPlugin: plugin[0]
      }), () => {
        const { client_id: scoop_client_id, emailid } = this.props.user
        this.state.selectedPlugin.show_reps && this.props.loadReps({ scoop_client_id, emailid, channel: pluginName.toLowerCase() })
      })
    }
  }

  onTimeVerification = () => {
    let token = localStorage.getItem('reauthToken')
    let url = localStorage.getItem('reauth_destination').split('/')

    if (token && localStorage.getItem('reauth_destination')) {
      const { client_id, emailid } = this.props.user;
      axios.post(ApiConst.BASE_URL + 'api/v2/plugins/reauth/link_verification', {
        "token": token,
        "emailid": emailid,
        "scoop_client_id": client_id,
        "channel": url[3],
      }).then((res) => {
       // console.log(res)
        if(res.data.status === 'success'){
          localStorage.removeItem('reauthToken')
          localStorage.removeItem('reauth_destination')
          this.setState(({ reAuthButton: true}))
        }  
      }).catch(error => {
        if (error.response.data && error.response.data.status === 'failure') {
           this.setState(({ message: true}))
           localStorage.removeItem('reauthToken')
           localStorage.removeItem('reauth_destination')
        }
      })
    }

  }

  componentWillUnmount() {
    this.props.resetReps()
  }

  calendarToggle = (e) => {
    e.preventDefault()
    this.setState(() => ({
      calendarToggle: true,
    }))
    return true
  }

  calenderCustomRangeApply = () => {
    this.setState(() => ({
      calendarToggle: false
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

  onChange = (date) => {
    let date_to = moment(date[1]).format("YYYY-MM-DD") + "T23:59:59Z"
    let date_from = moment(date[0]).format("YYYY-MM-DD") + "T00:00:00Z";
    this.setState(() => ({
      date_to: date_to,
      date_from: date_from,
      date_to_range: moment(date[1]).format("MMM D, YYYY"),
      date_from_range: moment(date[0]).format("MMM D, YYYY")
    }))
  }
  syncPlugin = (e) => {
    e.preventDefault();
    let { rep_emails, date_to, date_from, subDomain, channel } = this.state;
    const { client_id: scoop_client_id, emailid } = this.props.user;

    this.props.syncPlugin({ scoop_client_id, emailid, channel: this.state.selectedPlugin && this.state.selectedPlugin.name.toLowerCase(), sync_start_date: date_from, sync_end_date: date_to, rep_emails: rep_emails.toString(), subdomain: subDomain })
    this.setState(({
      name: '',
      password: '',
      rep_emails: [],
      rep_names: [],
      date_to: '',
      date_from: '',
      subDomain: '',
      date_from_range: '',
      date_to_range: ''
    }))

  }
  selectReps = (e) => {
    e.preventDefault();
    let email = e.target.value;
    let name = e.target.getAttribute('data-name')
    if (e.target.checked) {
      this.setState(prevState => ({
        rep_emails: [...prevState.rep_emails, email],
        rep_names: [...prevState.rep_names, name]
      }))
    } else if (!e.target.checked) {
      let emails = [...this.state.rep_emails];
      let names = [...this.state.rep_names];
      let index = emails.indexOf(email);
      let nameIndex = names.indexOf(name)
      emails.splice(index, 1);
      names.splice(nameIndex, 1)
      this.setState(() => ({ rep_emails: emails, rep_names: names }))
    }
  }
  changeValue = (e) => {
    let { name, value } = e.target;
    this.setState(() => ({
      [name]: value
    }))
  }

  goBack = () => {
    this.props.back();
    this.props.history.goBack()
  }

  integratePlugin = (e) => {
    e.preventDefault()
    let channel = e.target.value;
    const { client_id: scoop_client_id, emailid } = this.props.user
    this.props.integratePlugin({ scoop_client_id, emailid, channel })
  }
  handleDeleteChannel=(e)=>{
    let channel = e.currentTarget.id
    this.props.deletePlugin(channel)
  }
  render() {

    return (
      <Fragment>

        <div className="integration-detail">
 
          <div className="integration-detail-head">
            <div className="integration-detail-head-wrap">
              <div className="integration-detail-head-wrap-left">
              <i onClick={this.goBack} className="icon-arrow-lhs"></i>
                <span className="integration-detail-head-img"><img src={this.state.selectedPlugin && this.state.selectedPlugin.logo} alt="" /></span>
                <span className="integration-detail-head-title">{this.state.selectedPlugin && this.state.selectedPlugin.name}</span>
              </div>
              <div className="integration-detail-head-wrap-right">
                  <div className="integration-delete-btn">
                  <button
                          style={{
                            "background": "transparent",
                            "border": "none",
                            "cursor": "pointer"
                          }}
                          id={this.state.selectedPlugin && this.state.selectedPlugin.name} 
                          onClick={this.handleDeleteChannel}
                        > <i className="icon-delete" data-toggle="modal" data-target="#DeleteTopic" ></i> </button>
                  </div>
                </div> 
            </div>
          </div>

          <div className="integration-detail-body">
            <div className="media-name-box">
              <p className="media-box-content mt10">{this.state.selectedPlugin && this.state.selectedPlugin.description}</p>

              <div className="last-update mt25">
                {this.state.selectedPlugin && this.state.selectedPlugin.last_sync_date && <p className="media-box-content mt10">Last synchronised at {moment(this.state.selectedPlugin.last_sync_date).format('Do MMM YYYY')} | {moment(this.state.selectedPlugin.last_sync_date).format('HH:mm')}</p>}
              </div>

            </div>

            <div className="integration-detail-form mt60">
              <form onSubmit={this.syncPlugin}>
                <div className="row">
                  <div className="col-md-7">
                    {this.state.selectedPlugin && this.state.selectedPlugin.show_reps && <div className="viewBtn form-group select-box">
                      <div className="dropdown" >
                        <button type="button" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">{this.state.rep_names.length > 0 ? this.state.rep_names.toString() : 'Select Reps'}</button>
                        <div className="dropdown-menu" x-placement="bottom-start">
                          <ul>
                            {
                              this.props.reps && this.props.reps.map((rep, index) => (
                                <li key={uuid()}>
                                  <div className="form-group dropDownText checkboxContainer">
                                    {<input name="options" type="checkbox" value={rep.email} className="Option1"
                                      checked={this.state.rep_emails.includes(rep.email)}
                                      onChange={this.selectReps}
                                      data-name={`${rep.first_name} ${rep.last_name}`}
                                    />
                                    }
                                    <span className="checkBoxText">{`${rep.first_name} ${rep.last_name}`}</span>
                                    <span className="virtualBox"></span>
                                  </div>
                                </li>
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>}

                    {this.state.selectedPlugin && this.state.selectedPlugin.show_date_range && <div className="form-group">
                      <div className="input-wraper">
                        <input type="text" name="endDate" className="form-control" defaultValue={this.state.date_from_range ? this.state.date_from_range + " - " + this.state.date_to_range : ''} placeholder="Select Date Range" autoComplete="off" onClick={this.calendarToggle} contentEditable="false" tabIndex="-1" />
                        {
                          this.state.calendarToggle && <React.Fragment> <div className="date-custom-range">
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
                    </div>}

                    {this.state.selectedPlugin && this.state.selectedPlugin.show_subdomain && <div className="form-group">
                      <div className="input-wraper">
                        <input type="text" name="subDomain" className="form-control" placeholder="Subdomain" value={this.state.subDomain} onChange={this.changeValue} />
                      </div>
                    </div>}

                    <div className="actionBtns">
                      {this.state.selectedPlugin && <button type="submit" className="mr-3 colorBtn btn btn-secondary" value={this.state.selectedPlugin && this.state.selectedPlugin.name.toLowerCase()}>SYNC</button>}
                      {this.state.selectedPlugin && ((this.state.selectedPlugin.show_reauth && this.state.selectedPlugin.status === "Integrated") || this.state.reAuthButton) && <button type="submit" className="colorBtn btn btn-secondary" onClick={this.integratePlugin} value={this.state.selectedPlugin && this.state.selectedPlugin.name.toLowerCase()}>RE-AUTH</button>}
                      {this.state.message && <span>Time is expired for re-authentication</span>}
                    </div>

                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

      </Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  pluginsList: state.configureReducer.pluginsList,
  reps: state.configureReducer.reps,
  deauth: state.configureReducer.deauth
})

const mapActionToProps = {
  listPluginsList: configureAction.listPlugins,
  integratePlugin: configureAction.integratePlugin,
  loadReps: configureAction.loadReps,
  syncPlugin: configureAction.syncPlugin,
  resetReps: configureAction.resetReps,

}

export default withRouter(connect(mapStateToProps, mapActionToProps)(IntegrationDetail));