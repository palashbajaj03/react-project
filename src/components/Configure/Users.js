import React, { useEffect, useState, Fragment } from 'react'
import { connect } from 'react-redux'
import { configureAction } from '../../actions'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';


const Users = (props) => {
  let [data, setData] = useState({})
  let [placeholder, setName] = useState({})
  let [edit, setEdit] = useState(false);
  let [searchKey, setInput] = useState('');
  let [filterData, setFilter] = useState([])
  let [keyword, updateKeyword] = useState('')
  let [newUsers, updateNewUsers] = useState([])

  useEffect(() => {
    const { emailid, client_id } = props.user
    props.readAllUsers({ emailid, client_id })
    props.LoadRolesReadAll(client_id, emailid)
  }, [])

  const getInitials = (string) => {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }

  const handleClickTopic = () => {
    document.getElementsByClassName('add-user-popup')[0].style.display = "block"
  }

  const handleClickTopicCancel = () => {
    setData({})
    setName({})
    setEdit(false)
    window.jQuery('.form-control').val("")
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

  const changeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value.replace(/[&<>"]/g, "");
    let repManagerName = e.target.innerText;
    setData({
      ...data,
      [name]: value
    })
    if ((name === 'manager_id') || (name === 'role_id')) {
      setName({
        ...placeholder,
        [name]: repManagerName
      })
    }
  }

  const saveUser = (e) => {
    e.preventDefault();
    let { firstname, lastname, emailid, mobile, role_id, manager_id } = data
    if (firstname !== ' ' && lastname !== ' ' && ((/^[0-9]*$/).test(mobile)) && emailid !== ' ' && (role_id && role_id !== ' ') && (manager_id && manager_id !== ' ')) {
      const { emailid, client_id } = props.user
      if (edit) {
        props.editUser(data, emailid, client_id)
      } else {
        props.createUser(data, emailid, client_id)
      }
      handleClickTopicCancel()
    } else {
      toast.info('Please fill all the fields correctly', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
      })
    }
  }

  const readParticularUser = (e) => {
    e.preventDefault()
    document.getElementsByClassName('add-user-popup')[0].style.display = "block"
    let current_id = e.target.id
    props.users_list && props.users_list.filter((user) => {
      if (user.rep_id === current_id) {
        let { firstname, lastname, emailid, mobile, role, manager_name, manager_id, role_id } = user
        setData({
          firstname,
          lastname,
          emailid,
          mobile,
          manager_id,
          role_id
        })
        setName({
          role_id: role,
          manager_id: manager_name
        })
      }
    })
    setEdit(true)
    window.scroll(0, 0)
  }

  const deleteUser = (e) => {
    let { id, value } = e.currentTarget
    props.deleteUser(id, value, 'USERS')
  }

  const searchInput = (e) => {
    const { value, name } = e.target
    setInput(value)
    let data = []
    if (name === "user") {
      data = props.users_list && props.users_list.filter(user => {
        if (((user.firstname + user.lastname).toLowerCase()).includes((value).toLowerCase())) {
          return user
        }
      })
    }

    if (name === "role") {
      data = props.roles_list && props.roles_list.filter(role => {
        if (role.role_name.toLowerCase().includes(value.toLowerCase())) {
          return role
        }
      })
    }

    setFilter(data)
  }

  useEffect(() => {
    window.jQuery('.dropdown').on('hidden.bs.dropdown', function () {
      setInput('');
      setFilter([])
    })
  }, [])

  const handleUserSearch = e => {
    let searchInput = e.target.value
    let users = []
    updateKeyword(searchInput)
    props.users_list && props.users_list.map(data => {
      let name = data.firstname + ' ' + data.lastname
      name.toLowerCase().includes(searchInput.toLowerCase()) && users.push(data)
    })
    updateNewUsers([...users])
  }

  return (
    <Fragment>
      <div className="userTab" id="userTab">
        <div className="page-title-row">
          <div className="page-title-box remove-flex-basis">
            <h2 className="page-title"> Users </h2>
            <div className="page-breadcum">
              <p><a href="#">Configuration </a> > Users </p>
            </div>
          </div>
          <div className="set-flex align-center">
            <div className="search-bar">
              <div class="right-search"><input type="search" class="search-input " placeholder="Search Users" onChange={handleUserSearch} /><i class="icon-search"></i></div>
            </div>
            {/* <input type='search' className="form-control search-input-user" onChange={handleUserSearch} placeholder='Search User' /> */}
            <button className="btn btn-secondary ml10" onClick={handleClickTopic}> <i className="icon-plus"></i> ADD USER </button>
          </div>
        </div>

        <div className="page-body mt40">
          <div className="userList">
            {
              keyword.length === 0 ?
                props.users_list && props.users_list.map((user, index) => (
                  <div key={index} className="start-conversation-row">
                    <div className="row">
                      <div className="conver-profile col-lg-4 col-md-4">
                        <div className="active-user-img as-img mr25">
                          <span className="initials-logo">
                            {
                              getInitials(user.firstname)
                            }
                          </span>
                        </div>
                        <div className="media-name-box">
                          <h4 className="media-text"> {`${user.firstname} ${user.lastname}`} </h4>
                          <div className="">
                            <span className="side-text">{moment(user.dt_created).fromNow(true)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="conver-detail col-lg-3 ">
                        <h4 className="media-text"> {user.role} </h4>
                        <small className="small-text"> {`Manager: ${user.manager_name}`} </small>
                      </div>

                      <div className="conver-call-detail col-lg-3 ">
                      </div>

                      <div className="col-lg-2 edit-center">
                        <ul className="icons-group">
                          <li>
                            <i id={user.rep_id} className="icon-edit" onClick={readParticularUser} > </i>
                          </li>
                          <li>
                            <button
                              style={{
                                "background": "transparent",
                                "border": "none",
                                "cursor": "pointer"
                              }}
                              value={`${user.firstname} ${user.lastname}`}
                              id={user.emailid}
                              onClick={deleteUser}
                            > <i className="icon-delete" data-toggle="modal" data-target="#DeleteTopic" ></i></button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )) : newUsers.map((user, index) => (
                  <div key={index} className="start-conversation-row">
                    <div className="row">
                      <div className="conver-profile col-lg-4 col-md-4">
                        <div className="active-user-img as-img mr25">
                          <span className="initials-logo">
                            {
                              getInitials(user.firstname)
                            }
                          </span>
                        </div>
                        <div className="media-name-box">
                          <h4 className="media-text"> {`${user.firstname} ${user.lastname}`} </h4>
                          <div className="">
                            <span className="side-text">{moment(user.dt_created).fromNow(true)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="conver-detail col-lg-3 ">
                        <h4 className="media-text"> {user.role} </h4>
                        <small className="small-text"> {`Manager: ${user.manager_name}`} </small>
                      </div>

                      <div className="conver-call-detail col-lg-3 ">
                      </div>

                      <div className="col-lg-2 edit-center">
                        <ul className="icons-group">
                          <li>
                            <i id={user.rep_id} className="icon-edit" onClick={readParticularUser} > </i>
                          </li>
                          <li>
                            <button
                              style={{
                                "background": "transparent",
                                "border": "none",
                                "cursor": "pointer"
                              }}
                              value={`${user.firstname} ${user.lastname}`}
                              id={user.emailid}
                              onClick={deleteUser}
                            > <i className="icon-delete" data-toggle="modal" data-target="#DeleteTopic" ></i></button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
          <div className="add-user-popup animated slideInRight">
            <div className="popup-wrapper">
              <div className="popup-head">
                <h2>{edit ? 'Edit User' : 'Add New User'}</h2>
                <p>Manage your team, integrations and profile!</p>
              </div>
              <div className="popup-body">
                <div className="add-user-form mt40">
                  <form autoComplete="off" onSubmit={saveUser} >
                    <div className="form-group">
                      <div className="input-wraper">
                        <input type="text" name="firstname" className="form-control" placeholder="First Name" onChange={changeInput} value={data.firstname} maxLength="225" required />
                        <i className="icon-person"></i>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-wraper">
                        <input type="text" name="lastname" className="form-control" placeholder="Last Name" onChange={changeInput} value={data.lastname} maxLength="225" required />
                        <i className="icon-person"></i>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-wraper">
                        <input type="email" name="emailid" className="form-control" placeholder="Email ID" disabled={edit} onChange={changeInput} value={data.emailid} required />
                        <i className="icon-email"></i>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-wraper">
                        <input name="mobile" className="form-control" placeholder="Phone Number" onChange={changeInput} value={data.mobile} maxLength="10" required />
                        <i className="icon-phone"></i>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="select-box">
                        <div className="dropdown">
                          <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="true">{placeholder.role_id ? placeholder.role_id : 'Role'}</button>
                          <div className="dropdown-menu" x-placement="bottom-start" style={{ "position": "absolute", "transform": "translate3d(0px, 54px, 0px)", "top": "0px", "left": "0px", "willChange": "transform" }}>
                            <span className="searchList"><i className="icon-search"></i><input name="role" type="text" placeholder="Search" onChange={searchInput} value={searchKey} /></span>
                            {
                              (searchKey == '') ? props.roles_list && props.roles_list.map((role, index) => (
                                <button key={index} name="role_id" type="button" className="dropdown-item" value={role.role_id} onClick={changeInput} >{role.role_name}</button>
                              )) : filterData.map((role, index) => (
                                <button key={index} name="role_id" type="button" className="dropdown-item" value={role.role_id} onClick={changeInput} >{role.role_name}</button>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="select-box">
                        <div className="dropdown">
                          <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="true">{placeholder.manager_id ? placeholder.manager_id : 'Select Manager'}</button>
                          <div className="dropdown-menu" x-placement="bottom-start" style={{ "position": "absolute", "transform": "translate3d(0px, 54px, 0px)", top: "0px", left: "0px", willChange: "transform" }}>
                            <span className="searchList"><i className="icon-search"></i><input type="text" name="user" placeholder="Search" onChange={searchInput} value={searchKey} /></span>
                            {
                              (searchKey === '') ? props.users_list && props.users_list.map((user, index) => (
                                <button key={index} name="manager_id" type="button" className="dropdown-item" value={user.rep_id} onClick={changeInput} >{`${user.firstname} ${user.lastname}`}</button>
                              )) : filterData.map((user, index) => (
                                <button key={index} name="manager_id" type="button" className="dropdown-item" value={user.rep_id} onClick={changeInput} >{`${user.firstname} ${user.lastname}`}</button>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="actionBtns mt20">
                      <button type="submit" className="colorBtn btn btn-secondary">{edit ? 'EDIT MEMBER' : 'SAVE MEMBER'}</button>
                      <button type="button" className="btn emptyColorBtn" onClick={handleClickTopicCancel}>CANCEL</button>
                    </div>
                  </form>
                </div>
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

const mapStateToProps = state => ({
  user: state.authentication.user,
  users_list: state.configureReducer.users_list,
  roles_list: state.configureReducer.configure_Roles_Read_All
})

const mapActionToProps = {
  readAllUsers: configureAction.readAllUsers,
  LoadRolesReadAll: configureAction.LoadRolesReadAll,
  createUser: configureAction.createUser,
  editUser: configureAction.editUser,
}

export default connect(mapStateToProps, mapActionToProps)(Users)
