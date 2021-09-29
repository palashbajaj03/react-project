import React, { Component } from 'react';
import { connect } from 'react-redux';
import { configureAction } from '../../actions'
// import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import moment from 'moment'
// import uuid from 'uuid'
import { toast, ToastContainer } from 'react-toastify'
import { routingConstants } from "../../constants";
import {Link, withRouter} from 'react-router-dom'
import IntegrationDetail from './integrationDetail';
import FileManualUpload from './FileManualUpload'
class Integration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      edit: false
    }
  }

  componentDidMount() {
    const { client_id, emailid } = this.props.user
    this.props.listPluginsList(client_id, emailid)
  }

  componentDidUpdate(prevProps) {
    if(prevProps.pluginsList !== this.props.pluginsList) {
      let count = 0;
      this.props.pluginsList.forEach(plugin=>{
        if(plugin.is_available && plugin.status==="Integrated") {
          count++;
        }
      })
      window.Appcues && window.Appcues.identify(this.props.user.emailid, {
        pluginsIntegrated: count
      });
    }
  }

  integratePlugin = (e) => {
    e.preventDefault()
    let channel = e.target.value;
    const { client_id: scoop_client_id, emailid } = this.props.user
    this.props.integratePlugin({ scoop_client_id, emailid, channel })
  }

  searchInputChange = (e) => {
    e.preventDefault();
    let searchInput = e.target.value;
    this.setState({ searchInput }, () => {
      this.searchData()
    })
  }

  searchData = () => {
    let result = [];
    if (this.state.searchInput !== '') {
      result = this.props.pluginsList && this.props.pluginsList.filter(plugin => {
        if (plugin.name.toLowerCase().includes(this.state.searchInput.toLowerCase())) {
          return plugin
        }
      })
      this.setState(({ result }))
    } else {
      this.setState(({ result: [] }))
    }
  }

  toggleEdit = () => {
    this.setState((prevState)=>({edit:!prevState.edit}))
  }

  deauth = (channel) =>{
    this.props.deleteRole(channel,channel,'INTEGRATION')
  }

  render() {
    return (
      <div className="integrationTab" id="integrationTab">
        {!this.state.edit && !this.props.match.params.integration_channel && <div className="page-title-row">
          <div className="page-title-box">
            <h2 className="page-title"> Integration </h2>
            <div className="page-breadcum">
              <p><a href="#">Configuration </a> > Integration </p>
            </div>
          </div>
          <div className="search-bar">
            <div className="right-search">
              <input type="text" className="search-input" placeholder="Search" onClick={() => { this.setState(({ search: true })) }} onChange={this.searchInputChange} value={this.state.searchInput} />
              <i className="icon-search"></i>
            </div>
          </div>
        </div>}
        {(!this.state.searchInput && !this.state.edit && !this.props.match.params.integration_channel) && <div className="page-body mt40">
          <div className="integrationtList">
            <div className="your-plugin plugins">
              <div className="sec-title">
                <h2>Active Plugins</h2>
                <p className="verticle-line"></p>
              </div>
            </div>
            {this.props.pluginsList && this.props.pluginsList.map((plugin, index) => (
              (plugin.is_available && plugin.status === 'Integrated') ?
                <div key={index} className="mt20">
                  <div className="start-conversation-row">
                    <div className="row">
                      <div className="conver-profile align-top col-lg-10 col-md-10">
                        <div className="media-img mr25 col-md-1">
                          <img src={plugin.logo} alt="img" />
                        </div>
                        <div className="media-name-box col-md-11">
                          <h4 className="media-text"> {plugin.name} </h4>
                          <p className="media-box-content mt10">{plugin.description}</p>
                          <div className="last-update mt25">
                            {plugin.last_sync_date && <p className="media-box-content mt10"> Last synchronised at {moment(plugin.last_sync_date).format('Do MMM YYYY')} | {moment(plugin.last_sync_date).format('HH:mm')}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-2 edit-center">
                        <ul className="icons-group">
                          <Link onClick={this.toggleEdit} to={`${routingConstants.INTEGRATION_DETAIL}/`+plugin.name}> <li>
                          <i className="icon-edit" > </i>
                            {/* <button value={plugin.name} onClick={this.toggleEdit} style={{ background: "transparent", border: "none", cursor: "pointer" }}> </button> */}
                          </li> </Link>
                        </ul>
                      </div>

                    </div>
                  </div>
                </div>
                : ''
            ))}

    {/* <Link to={`${routingConstants.INTEGRATION_DETAIL}/fileManualUpload`}> <div className="more-plugin plugins mt40">
              <div className="sec-title">
                <h2>File Manual Upload</h2>
                <p className="verticle-line"></p>
              </div>
            </div> </Link> */}

            <div className="more-plugin plugins mt40">
              <div className="sec-title">
                <h2>Add more Plugins</h2>
                <p className="verticle-line"></p>
              </div>
            </div>

            <div className="pugin-list mt20">
              {
                this.props.pluginsList && this.props.pluginsList.map((plugin, index) => (
                  (plugin.status === 'Pending' || !plugin.is_available) ? <div key={index} className="start-conversation-row">
                    <div className="row">
                      <div className="conver-profile align-top col-lg-10 col-md-10">
                        <div className="media-img mr25 col-md-1">
                          <img src={plugin.logo} alt="img" />
                        </div>
                        <div className="media-name-box col-md-11">
                          <h4 className="media-text"> {plugin.name} </h4>
                          <p className="media-box-content mt10">{plugin.description}</p>
                        </div>
                      </div>

                      <div className="col-lg-2 edit-center">
                        <ul className="icons-group">
                          <li>
                            <button className="integrate-btn"
                              disabled={!plugin.is_available}
                              onClick={this.integratePlugin}
                              value={plugin.name.toLowerCase()}
                            >
                              {plugin.is_available ? 'Integrate' : 'Coming Soon'}
                            </button>
                          </li>
                        </ul>
                      </div>

                    </div>
                  </div> : ''
                ))
              }
            </div>
          </div>
        </div>}
       
        {(!this.state.edit && this.state.searchInput && !this.props.match.params.integration_channel) && <div className="page-body mt40">
          <div className="integrationtList">
            <div className="your-plugin plugins">
              <div className="sec-title">
                <h2>Active Plugins</h2>
                <p className="verticle-line"></p>
              </div>
            </div>
            {this.state.result && this.state.result.map((plugin, index) => (
              (plugin.is_available && plugin.status === 'Integrated') ?
                <div key={index} className="mt20">
                  <div className="start-conversation-row">
                    <div className="row">
                      <div className="conver-profile align-top col-lg-10 col-md-10">
                        <div className="media-img mr25 col-md-1">
                          <img src={plugin.logo} alt="img" />
                        </div>
                        <div className="media-name-box col-md-11">
                          <h4 className="media-text"> {plugin.name} </h4>
                          <p className="media-box-content mt10">{plugin.description}</p>
                          <div class="last-update mt25">
                            {plugin.last_sync_date && <p className="media-box-content mt10">Last Fetched data {moment(plugin.last_sync_date).format('Do MMM YYYY')}| {moment(plugin.last_sync_date).format('HH:mm')}</p>}
                          </div>

                        </div>
                      </div>

                      <div className="col-lg-2 edit-center">
                        <ul className="icons-group">
                          <li>
                            <button value={plugin.name} onClick={this.toggleEdit} style={{ background: "transparent", border: "none", cursor: "pointer" }}> <i className="icon-edit" style={{ pointerEvents: "none" }}> </i></button>
                          </li>
                        </ul>
                      </div>

                    </div>
                  </div>
                </div>
                : ''
            ))}

            <div className="more-plugin plugins mt40">
              <div className="sec-title">
                <h2>Add more Plugins</h2>
                <p className="verticle-line"></p>
              </div>
            </div>

            <div className="pugin-list mt20">
              {
                this.props.pluginsList && this.props.pluginsList.map((plugin, index) => (
                  (plugin.status === 'Pending' || !plugin.is_available) ? <div key={index} className="start-conversation-row">
                    <div className="row">
                      <div className="conver-profile align-top col-lg-10 col-md-10">
                        <div className="media-img mr25 col-md-1">
                          <img src={plugin.logo} alt="img" />
                        </div>
                        <div className="media-name-box col-md-11">
                          <h4 className="media-text"> {plugin.name} </h4>
                          <p className="media-box-content mt10">{plugin.description}</p>
                        </div>
                      </div>

                      <div className="col-lg-2 edit-center">
                        <ul className="icons-group">
                          <li>
                            <button className="integrate-btn"
                              disabled={!plugin.is_available}
                              onClick={this.integratePlugin}
                              value={plugin.name.toLowerCase()}
                            >
                              {plugin.is_available ? 'Integrate' : 'Coming Soon'}
                            </button>
                          </li>
                        </ul>
                      </div>

                    </div>
                  </div> : ''
                ))
              }
            </div>
          </div>
        </div>}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover={false}
        />
 
        {this.props.match.params.integration_channel !== 'fileManualUpload' && this.props.match.params.integration_channel !== undefined && <IntegrationDetail deletePlugin={this.deauth} back={this.toggleEdit} /> }
        {/* {this.props.match.params.integration_channel === 'fileManualUpload' && <FileManualUpload/>} */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  pluginsList: state.configureReducer.pluginsList,
  reps: state.configureReducer.reps
})

const mapActionToProps = {
  listPluginsList: configureAction.listPlugins,
  integratePlugin: configureAction.integratePlugin,
  loadReps: configureAction.loadReps,
  syncPlugin: configureAction.syncPlugin,
  resetReps: configureAction.resetReps
}

export default withRouter(connect(mapStateToProps, mapActionToProps)(Integration));