import React, { Component, Fragment } from 'react'
import { configureAction } from '../../actions'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import Scrollbar from 'react-scrollbars-custom';

class Roles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      access_data: [],
      access_object: [],
      access_setting: [],
      access_source: [],
      access_object_temp: [],
      radioDataAccess: '',
      peer_state: false,
      linked_peer: [],
      user_rep_name: [],
      access_setting_temp: [],
      role_name: '',
      description: '',
      keyword: '',
      newRole: [],
    }
  }

  componentDidMount() {
    const { client_id, emailid } = this.props.user
    this.props.LoadRolesAccessObject(client_id, emailid)
    this.props.LoadRolesReadAll(client_id, emailid)
  }

  handleClickTopic = () => {
    document.getElementsByClassName('add-user-popup')[0].style.display = "block"
  }
  handleClickTopicAdd = (e) => {
    const { client_id, emailid } = this.props.user
    if (this.state.access_object.length > 0 && this.state.role_name !== '') {
      let role = {
        access_object: [
          ...this.state.access_object,
          ...this.state.access_setting
        ],
        linked_peer: this.state.linked_peer,
        name: this.state.role_name,
        description: this.state.description,
        access_data: this.state.access_data,
        access_source: this.state.access_source

      }

      if (e.target.value === 'add-role' && role) {
        this.props.LoadRolesCreate(client_id, emailid, role)
      }
      if (e.target.value === 'update-role' && role) {
        let roles = {
          ...role,
          role_id: this.state.role_id
        }
        this.props.LoadRolesUpdate(client_id, emailid, roles)
      }

    }
    this.handleClickTopicCancel()
  }

  handleClickTopicCancel = () => {
    this.setState(() => ({
      access_data: [],
      access_object: [],
      access_setting: [],
      access_source: [],
      access_object_temp: [],
      access_setting_temp: [],
      radioDataAccess: '',
      peer_state: false,
      linked_peer: [],
      user_rep_name: [],
      role_name: '',
      description: '',
      type: ''
    }), () => {
      window.jQuery('.roleName').val("")
      window.jQuery('.roleDescription').val("")
    })
    document.getElementsByClassName('add-user-popup')[0].classList.remove('slideInRight')
    document.getElementsByClassName('add-user-popup')[0].classList.add('slideOutRight')

    setTimeout(() => {
      if (document.getElementsByClassName('add-user-popup')[0]) {
        document.getElementsByClassName('add-user-popup')[0].style.display = "none"
        document.getElementsByClassName('add-user-popup')[0].classList.add('slideInRight')
        document.getElementsByClassName('add-user-popup')[0].classList.remove('slideOutRight')
      }
    }, 1000)

  }

  titleCase = (str) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  onChangeKey = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let string = e.target.value.replace(/[&<>"]/g, "");
    if (name === 'roleName') {
      this.setState(() => ({
        role_name: string
      }))
    }
    if (name === 'roleDescription') {
      this.setState(() => ({
        description: string
      }))

    }
  }

  selectRoleAccess = (e) => {
    e.preventDefault()
    let val = e.target.id
    if (e.target.checked) {
      // if(e.target.value === 'data_access'){
      //     this.setState((prevState)=>({
      //         access_data: prevState.access_data.concat(val)
      //     }))
      // }
      if (e.target.value === 'object_access') {
        this.setState((prevState) => ({
          access_object_temp: prevState.access_object_temp.concat(val),
          access_object: prevState.access_object.concat({ [val]: "view" })
        }))
      }
      if (e.target.value === 'setting_access') {
        this.setState((prevState) => ({
          access_setting_temp: prevState.access_setting_temp.concat(val),
          access_setting: prevState.access_setting.concat({ [val]: "view" })
        }))
      }
      if (e.target.value === 'source_access') {
        this.setState((prevState) => ({
          access_source: prevState.access_source.concat(val)
        }))
      }

    }

    if (!e.target.checked) {
      // if(e.target.value === 'data_access'){
      //     let string = e.target.id
      //     let searchinput = this.state.access_data
      //     var index = searchinput && searchinput.indexOf(string);
      //     if (index !== '' && index > -1) {
      //       searchinput.splice(index, 1)
      //       this.setState(()=>({
      //         access_data: searchinput
      //     }))
      //     }
      // }
      if (e.target.value === 'object_access') {
        let rep = e.target.id
        let repinput = this.state.access_object_temp
        const index1 = repinput && repinput.indexOf(rep)
        let repinputs = this.state.access_object
        if (index1 !== '' && index1 > -1) {
          repinputs.splice(index1, 1)
          repinput.splice(index1, 1)
          this.setState(() => ({
            access_object: repinputs,
            access_object_temp: repinput
          }))
        }
      }

      if (e.target.value === 'setting_access') {
        let rep = e.target.id
        let repinput = this.state.access_setting_temp
        const index1 = repinput && repinput.indexOf(rep)
        let repinputs = this.state.access_setting
        if (index1 !== '' && index1 > -1) {
          repinputs.splice(index1, 1)
          repinput.splice(index1, 1)
          this.setState(() => ({
            access_setting: repinputs,
            access_setting_temp: repinput
          }))
        }
      }

      if (e.target.value === 'source_access') {
        let string = e.target.id
        let searchinput = this.state.access_source
        var index = searchinput && searchinput.indexOf(string);
        if (index !== '' && index > -1) {
          searchinput.splice(index, 1)
          this.setState(() => ({
            access_source: searchinput
          }))
        }

      }

    }
  }
  handleDataAccess = (e) => {
    const { client_id, emailid } = this.props.user
    if (e.target.name === 'dataaccess') {
      let val = e.target.value
      if (val === 'peer') {
        this.props.readAllUsers({ client_id, emailid })
        this.setState(() => ({
          peer_state: true,
          radioDataAccess: 'peer',
          access_data: ['peer'],
        }))
      } else {
        this.setState(() => ({
          radioDataAccess: val,
          access_data: [val],
          peer_state: false,
          user_rep_name: [],
          linked_peer: []
        }))
      }
    }
  }
  selectUsers = (e) => {
    let rep_id = e.target.id;
    const name = e.target.value;
    if (e.target.checked) {
      this.setState((prevState) => ({
        user_rep_name: prevState.user_rep_name.concat(name),
        linked_peer: prevState.linked_peer.concat(rep_id)
      }))
    }
    if (!e.target.checked) {
      let string = e.target.id
      let searchinput = this.state.linked_peer
      var index = searchinput && searchinput.indexOf(string);

      let strin = e.target.value
      let searchinpu = this.state.user_rep_name
      var inde = searchinpu && searchinpu.indexOf(strin);

      if (index !== '' && index > -1 && inde !== '' && inde > -1) {
        searchinput.splice(index, 1)
        searchinpu.splice(inde, 1)
        this.setState(() => ({
          user_rep_name: searchinpu,
          linked_peer: searchinput
        }))
      }
    }
  }

  particularRoleRead = (e) => {
    e.preventDefault()
    document.getElementsByClassName('add-user-popup')[0].style.display = "block"
    let current_id = e.target.id
    let data = this.props.configure_Roles_Read_All.filter((role) => {
      if (role.role_id === current_id) {
        return role
      }
    })

    let data_object = data[0].access_object.map(dat => Object.keys(dat))
    let data_object_final = data_object.join().split(',')
    let setting_access = this.props.configure_Roles_object_setting_access.map((data) => { return data.id })
    const intersection = setting_access.filter(element => data_object_final.includes(element));
    let inter_setting = intersection.map((data) => {
      return {
        [data]: 'view'
      }
    })
    Array.prototype.diff = function (a) {
      return this.filter(function (i) { return a.indexOf(i) < 0; });
    };
    var dif1 = data_object_final.diff(intersection);
    let inter_acc_obj = dif1.map((data) => {
      return {
        [data]: 'view'
      }
    })
    console.log(data, this.props.users_list)
    let usernames = data[0].linked_peer && (this.props.users_list!==undefined && this.props.users_list.filter(element => data[0].linked_peer.includes(element.rep_id)))
    let username = []
    this.props.users_list!==undefined && data[0].linked_peer && usernames.map((user) => {
      username.push(user.firstname + " " + user.lastname)
    })

    this.setState(() => ({
      role_name: data[0].role_name,
      description: data[0].description,
      radioDataAccess: data[0].access_data ? data[0].access_data.toString() : '',
      access_data: data[0].access_data ? data[0].access_data : [],
      access_setting: data[0].access_setting ? data[0].access_setting : inter_setting,
      access_setting_temp: data[0].access_setting ? data[0].access_setting : intersection,
      access_source: data[0].access_source ? data[0].access_source : [],
      access_object_temp: data[0].access_object ? dif1 : [],
      access_object: data[0].access_object ? inter_acc_obj : [],
      type: data[0].type ? data[0].type : 'custom',
      role_id: data[0].role_id,
      peer_state: data[0].access_data.toString() === 'peer' ? true : false,
      linked_peer: data[0].linked_peer ? data[0].linked_peer : [],
      user_rep_name: usernames ? username : []
    }), () => {
      window.scroll(0, 0)
    })

  }

  particularTopicDeleteid = (e) => {
    let current_id = e.currentTarget.id
    this.props.deleteRole(current_id, e.currentTarget.value, 'ROLES')
  }

  handleRoleSearch = e => {
    let searchInput = e.target.value
    let ROLE = []
    this.setState(() => ({
      keyword: searchInput,
    }), _ => {
      this.props.configure_Roles_Read_All && this.props.configure_Roles_Read_All.map(data => {
        data.role_name.toLowerCase().includes(searchInput.toLowerCase()) && ROLE.push(data)
      })
      this.setState(() => ({
        newRole: ROLE,
      }))
    })
  }

  render() {
    return (
      <Fragment>
        <div className="roleTab" id="roleTab">
          <div className="page-title-row">
            <div className="page-title-box remove-flex-basis">
              <h2 className="page-title"> Roles </h2>
              <div className="page-breadcum">
                <p><a href="#">Configuration </a> > Roles </p>
              </div>
            </div>
            <div className="set-flex align-center">
              <div className="search-bar">
                <div class="right-search"><input type="search" class="search-input " placeholder="Search Roles" onChange={this.handleRoleSearch} /><i class="icon-search"></i></div>
              </div>
              <button className="btn btn-secondary ml10" onClick={this.handleClickTopic}> <i className="icon-plus"></i> ROLE </button>
            </div>
          </div>
          <div className="page-body mt40">
            <div className="roleList">

              <div className="RolesList">
                {
                  this.state.keyword.length === 0 ?
                    this.props.configure_Roles_Read_All && this.props.configure_Roles_Read_All.map((data, index) => {
                      return <div key={index} className="start-conversation-row circleLeft">
                        <div className="row">
                          <div className="conver-profile col-lg-3 col-md-3">
                            <div className="media-name-box">
                              <h4 className="media-text"> {data.role_name} </h4>
                              <div className="">
                                <span className="side-text">{data.members} Member(s)</span>
                              </div>
                            </div>
                          </div>
                          <div className="conver-detail col-lg-7 ">
                            <h4 className="media-text fwn"> {data.description}</h4>
                            <small className="small-text"> Role Description </small>
                          </div>

                          <div className="col-lg-2 edit-center">
                            <ul className="icons-group">
                              <li>
                                <i className="icon-edit" id={data.role_id} onClick={this.particularRoleRead}></i>
                              </li>
                              <li>
                                {<button
                                  style={{
                                    "background": "transparent",
                                    "border": "none",
                                    "cursor": "pointer"
                                  }}

                                  value={data.role_name}
                                  id={data.role_id}
                                  onClick={this.particularTopicDeleteid}
                                > <i className="icon-delete" data-toggle="modal" data-target="#DeleteTopic" ></i></button>}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    }) :
                    this.state.newRole.map((data, index) => {
                      return <div key={index} className="start-conversation-row circleLeft">
                        <div className="row">
                          <div className="conver-profile col-lg-3 col-md-3">
                            <div className="media-name-box">
                              <h4 className="media-text"> {data.role_name} </h4>
                              <div className="">
                                <span className="side-text">{data.members} Member(s)</span>
                              </div>
                            </div>
                          </div>
                          <div className="conver-detail col-lg-7 ">
                            <h4 className="media-text fwn"> {data.description}</h4>
                            <small className="small-text"> Role Description </small>
                          </div>

                          <div className="col-lg-2 edit-center">
                            <ul className="icons-group">
                              <li>
                                <i className="icon-edit" id={data.role_id} onClick={this.particularRoleRead}></i>
                              </li>
                              <li>
                                {<button
                                  style={{
                                    "background": "transparent",
                                    "border": "none",
                                    "cursor": "pointer"
                                  }}

                                  value={data.role_name}
                                  id={data.role_id}
                                  onClick={this.particularTopicDeleteid}
                                > <i className="icon-delete" data-toggle="modal" data-target="#DeleteTopic" ></i></button>}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    })
                }
              </div>

              <div className="add-user-popup animated slideInRight">
                <div className="popup-wrapper">
                  <div className="popup-head">
                    <h2>{this.state.type ? 'Edit Role' : 'Add New Role'}</h2>
                    <p>Manage your team, integrations and profile!</p>
                  </div>
                  <Scrollbar
                    removeTracksWhenNotUsed={true}
                  >
                    <div className="popup-body">
                      <div className="add-user-form mt40">
                        <form>
                          <div className="form-group">
                            <div className="input-wraper">
                              <input name="roleName" onChange={this.onChangeKey} value={this.state.role_name} className="roleName form-control" placeholder="Role Name" maxLength="255" />
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="input-wraper">
                              <input name="roleDescription" onChange={this.onChangeKey} value={this.state.description} className="roleDescription form-control" placeholder="Role Description" maxLength="255" />
                            </div>
                          </div>
                        </form>
                      </div>

                      <div className="role-options mt40">
                        <div className="data-access mt20">
                          <h2>Data Access </h2>
                          <div className="data-access-options mt15">
                            <ul onChange={this.handleDataAccess}>
                              {
                                this.props.data_access_object && this.props.data_access_object.map((data, index) => {
                                  return <li key={index}> <div className="radioContainer"> <input type="radio" name="dataaccess" value={data.id} className="radio-btn" checked={this.state.radioDataAccess === data.id} />
                                    <span className="virtual-radio"></span>
                                    <span className="radio-text">{data.label}</span> </div> </li>
                                })
                              }
                              {
                                this.state.peer_state && <div className="peer-dropdown-btn mt20">
                                  <div className="dropdown">
                                    <button className="btn custom-dropdown dropdown-toggle" id="selectCollection" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      {this.state.user_rep_name.length > 0 ? this.state.user_rep_name.toString() : 'Select Your Peer'}
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="selectCollection">
                                      <ul>
                                        {this.props.users_list && this.props.users_list.map((user, index) => {

                                          return <li key={Math.random()}>
                                            <div className="form-group dropDownText checkboxContainer">
                                              <input name="isGoing" type="checkbox" id={user.rep_id} value={user.firstname + " " + user.lastname} onChange={this.selectUsers} checked={this.state.linked_peer.includes(user.rep_id)} />
                                              <span className="checkBoxText">{user.firstname + " " + user.lastname}</span>
                                              <span className="virtualBox"></span>
                                            </div>
                                          </li>
                                        })}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              }
                            </ul>
                          </div>
                        </div>
                        {
                          this.props.configure_Roles_object && Object.entries(this.props.configure_Roles_object).map((data, index) => {
                            return data[0] !== 'data_access' && <div key={index} className="data-access mt20">
                              <h2>{this.titleCase(data[0].replace(/_/g, " "))}</h2>
                              <div className="data-access-options mt15">
                                <ul>
                                  {
                                    data[1].map((dat) => {
                                      return <li key={Math.random()}>
                                        <div className="form-group dropDownText checkboxContainer">
                                          <input name="isGoing" type="checkbox" onChange={this.selectRoleAccess} id={dat.id} value={data[0]} className="setHeight"
                                            checked={this.state.access_data.includes(dat.id) || this.state.access_setting_temp.includes(dat.id) || this.state.access_source.includes(dat.id) || this.state.access_object_temp.includes(dat.id)}
                                          />
                                          <span className="checkBoxText">{dat.label}</span>
                                          <span className="virtualBox"></span>
                                        </div>
                                      </li>
                                    })
                                  }


                                </ul>
                              </div>
                            </div>
                          })
                        }
                      </div>
                      <div className="actionBtns mt20">
                        <button type="button" value={this.state.type ? 'update-role' : 'add-role'} className="colorBtn btn btn-secondary" onClick={this.handleClickTopicAdd}>{this.state.type ? 'UPDATE ROLE' : 'SAVE ROLE'}</button>
                        <button type="button" className="btn emptyColorBtn" onClick={this.handleClickTopicCancel}>CANCEL</button>
                      </div>
                    </div>
                  </Scrollbar>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    configure_Roles_object: state.configureReducer.configure_Roles_object,
    configure_Roles_object_setting_access: state.configureReducer.configure_Roles_object && state.configureReducer.configure_Roles_object.setting_access,
    configure_Roles_Read_All: state.configureReducer.configure_Roles_Read_All,
    data_access_object: state.configureReducer.configure_Roles_object && state.configureReducer.configure_Roles_object.data_access,
    users_list: state.configureReducer.users_list
  }
}

const mapActionToProps = {
  LoadRolesAccessObject: configureAction.LoadRolesAccessObject,
  LoadRolesReadAll: configureAction.LoadRolesReadAll,
  readAllUsers: configureAction.readAllUsers,
  LoadRolesCreate: configureAction.LoadRolesCreate,
  LoadRolesUpdate: configureAction.LoadRolesUpdate
}

export default connect(mapStateToProps, mapActionToProps)(Roles)