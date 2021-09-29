/* Info: This file is for User Profile Component */
/* Created on {3-07-19} By {Siddhant Chopra}*/
/* Modified on {11-07-19} By {Pravesh Sharma}*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom';
import './Profile.css'
import { userActions } from '../../actions';
import { ToastContainer, toast } from 'react-toastify';
//import { profileReducer } from '../../reducers/profileReducer';

class Profile extends Component {
  toastId = null;
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      emailid: '',
      mobile: '',
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
      defaultmenuId: "",
      disabled: true
    }
  }

  onValidation = _ => {
    let validator = false
    if (this.state.firstName == '' || this.state.lastName == '' || this.state.mobile == '' || this.state.emailid == '' || this.state.firstName.length > 255 || this.state.lastName.length > 255 || this.state.mobile.length !== 10) {
      let validator = true
      return validator
    }
    return validator
  }
  onValidation2 = _ => {
    let validator2 = false
    const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm;
    if (this.state.oldPassword == '' || this.state.newPassword == '' || this.state.newPassword2 == '' || !regex.test(this.state.newPassword)) {
      let validator2 = true
      if (!regex.test(this.state.newPassword)) {
        this.setState(({ test: false }))
      } else { this.setState(({ test: true })) }
      return validator2
    }
    if (this.state.newPassword !== this.state.newPassword2) {
      let validator2 = true;
      toast.info('password does not match', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        // draggable: true,
      })
      return validator2
    }
    return validator2
  }

  onChangeUpdate = e => {
    const value = e.target.value;
    const nameReg = /^[A-Za-z]*$/g;
    // const numberReg = /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/g;
    const numberReg = /^[0-9]*$/
    if (e.target.name === 'firstName') {
      if (nameReg.test(value) && value.length < 255) {
        this.setState(_ => ({
          firstName: value,
          disabled: false
        }))
      }
    }
    else if (e.target.name === 'lastName') {
      if (nameReg.test(value) && value.length < 255) {
        this.setState(_ => ({
          lastName: value,
          disabled: false
        }))
      }
    }
    else if (e.target.name === 'emailId') {
      this.setState(_ => ({
        emaild: value,
        disabled: false
      }))
    }
    else {
      if (numberReg.test(value)) {
        this.setState(_ => ({
          mobile: value,
          disabled: false
        }))
      }
    }
  }

  logout = () => {
    const { emailid, client_id } = this.props.user
    localStorage.removeItem('fadeuponce')
    this.props.onLogOut(emailid, client_id);
  }
  componentDidMount() {
    const { page_profile } = this.props.access
    if (page_profile) {
      this.setState(() => ({
        defaultmenuId: "myProfile",
      }))
      const { client_id, emailid } = this.props.user
      this.props.userDataRead(client_id, emailid)
    } else {
      this.setState(() => ({
        defaultmenuId: "changePassword",
      }))
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.loadUserDataRead !== prevProps.loadUserDataRead) {
      this.setState(_ => ({
        firstName: this.props.loadUserDataRead && this.props.loadUserDataRead.firstname,
        lastName: this.props.loadUserDataRead && this.props.loadUserDataRead.lastname,
        emailid: this.props.loadUserDataRead && this.props.loadUserDataRead.emailid,
        mobile: this.props.loadUserDataRead.mobile.replace(/[&<>"a-zA-Z]/g,"")
      }))
    }
  }

  onFormSubmit = e => {
    const { client_id, emailid } = this.props.user
    e.preventDefault();
    if (this.onValidation()) {
      if (this.state.firstName.length > 255) {
        toast.info('First Name should not be longer than 255 charaters', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          // draggable: true,
        })
      }
      else if (this.state.lastName.length > 255) {
        toast.info('Last Name should not be longer than 255 charaters', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          // draggable: true,
        })
      }
      else if (this.state.mobile.length !== 10) {
        toast.info('Contact number should be of 10 digits', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          // draggable: true,
        })
      }

      else {
        toast.info('Please fill the required details ', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          // draggable: true,
        })
        // alert('form field empty')
      }
    }
    else {
      this.props.submitUserData(client_id, emailid, this.state.firstName, this.state.lastName, this.state.mobile)
    }
  }

  onPasswordChange = e => {
    const value = e.target.value
    if (e.target.name == "oldPassword") {
      this.setState(_ => ({
        oldPassword: value
      }))
    }
    else if (e.target.name == "newPassword") {
      this.setState(_ => ({
        newPassword: value
      }))
    }
    else {
      this.setState(_ => ({
        newPassword2: value
      }))
    }
  }

  onPasswordChangeSubmit = e => {
    const { emailid, client_id } = this.props.user
    e.preventDefault();
    if (this.onValidation2()) {
      if (this.state.test === false) {
        if (!toast.isActive(this.toastId)) {
          this.toastId = toast.info('Password does not match the required criteria. It should contain atleast 1 digit, 1 special character, 1 uppercase letter,1 lowercase letter and length should be between 8-16', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            // draggable: true,
          })
        }
      } else if (this.state.oldPassword == '' || this.state.newPassword == '' || this.state.newPassword2 == '') {
        toast.info('Please fill the required details', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          // draggable: true,
        })
      }
    }
    else {
      const { oldPassword, newPassword } = this.state
      this.setState(({
        oldPassword: '',
        newPassword: '',
        newPassword2: '',
        disabled: true
      }), () => {
        this.props.userPasswordChange(emailid, oldPassword, newPassword, client_id)
      })
    }
  }

  onMenuSelect = e => {
    let id = e.target.id
    if (id == this.state.defaultmenuId) {
    }
    else {
      this.setState(_ => ({
        defaultmenuId: id
      }))
    }
  }
 
  render() {
    const { firstName, lastName, emailid, mobile, defaultmenuId } = this.state
   
    return (
      cookie.load('user_token') ?
        <div className="">
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
          <div className="conversation-wrapp minHeight">
            <div className="custom-row-profile">
              <div className="left-panel minHeight">
                <div className="pannelHead">
                  <h4 className="pannelTitle">Settings</h4>
                </div>
                <div className="pannelBody">
                  <ul>
                    {(this.props.access&&this.props.access.page_profile)&&<li className={this.state.defaultmenuId == 'myProfile' ? 'active showMenu' : ''} onClick={this.onMenuSelect}>
                      <div id="myProfile"> My Profile</div>
                    </li>}
                    <li className={this.state.defaultmenuId == 'changePassword' ? 'active showMenu' : ''} onClick={this.onMenuSelect}>
                      <div id="changePassword">  Change Password</div>
                    </li>
                    <li className=''>
                      <div id='' onClick={this.logout}> Logout</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="start-all-conversation">
                <div className="page-title-row">
                  <div className="page-title-box">
                    <h2 className="page-title"> My Profile </h2>
                    <div className="page-sub-title">
                      <p>Manage your profile</p>
                    </div>
                  </div>
                </div>
                <div className="page-body mt40" style={{ display: defaultmenuId === 'myProfile' ? 'block' : 'none' }}>
                  <div className="profile-form">
                    <form onSubmit={this.onFormSubmit} autoComplete="off" >
                      <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <div className="input-wraper">
                          <input name="firstName" className="form-control" onChange={this.onChangeUpdate} value={firstName} ></input>
                          <i className="icon-person"></i>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <div className="input-wraper">
                          <input name="lastName" className="form-control" onChange={this.onChangeUpdate} value={lastName}></input>
                          <i className="icon-person"></i>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="emailId">Email ID</label>
                        <div className="input-wraper">
                          <input name="emailId" className="form-control" disabled onChange={this.onChangeUpdate} value={emailid}></input>
                          <i className="icon-email"></i>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="contact">Contact Number</label>
                        <div className="input-wraper">
                          <input maxLength="10" name="contact" className="form-control" onChange={this.onChangeUpdate} value={mobile}></input>
                          <i className="icon-phone"></i>
                        </div>
                      </div>
                      <button className="btn save-btn mt30" type="submit" disabled={this.state.disabled}>SAVE</button>
                    </form>
                  </div>
                </div>
                <div className="page-body mt40" style={{ display: defaultmenuId === 'changePassword' ? 'block' : 'none' }}>
                  <div className="profile-form">
                    <form onSubmit={this.onPasswordChangeSubmit} autoComplete="off">
                      <div className="form-group">
                        <div className="input-wraper">
                          <input type="password" name="oldPassword" value={this.state.oldPassword} onChange={this.onPasswordChange} className="form-control" placeholder="Old Password"></input>
                          <i className="icon-password"></i>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="input-wraper">
                          <input type="password" name="newPassword" value={this.state.newPassword} onChange={this.onPasswordChange} className="form-control" placeholder="New Password"></input>
                          <i className="icon-password"></i>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="input-wraper">
                          <input type="password" name="confirmPassword" value={this.state.newPassword2} onChange={this.onPasswordChange} className="form-control" placeholder="Confirm Password"></input>
                          <i className="icon-password"></i>
                        </div>
                      </div>
                      <button className="btn save-btn mt30" type="submit" >SAVE</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> : <Redirect to="/" />
    )
  }
}

const mapStateToProps = state => ({
  loadUserDataRead: state.profileReducer.userDataRead,
  user: state.authentication.user,
  userDataSave: state.profileReducer.userDataSave,
  userChangePassword: state.profileReducer.userChangePassword,
  access: state.authentication.access
});

const mapActionToProps = {
  onLogOut: userActions.logout,
  userDataRead: userActions.readUserProfileData,
  submitUserData: userActions.submitUserData,
  userPasswordChange: userActions.userPasswordChange
}

export default connect(mapStateToProps, mapActionToProps)(Profile);
