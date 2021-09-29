import React, { Component } from 'react'
import axios from 'axios'
import { ApiConst, actionConstants } from '../../constants'
import { toast, ToastContainer } from 'react-toastify';
export default class VerifyUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
        type:'',
        conf:'',
        spinner: true,
        message: false,
        status: false
    }
  }
  componentDidMount() {
    if(window.location.pathname === "/onboard" && document.getElementsByClassName('navbar-custom')[0]){
   document.getElementsByClassName('navbar-custom')[0].style.display = 'none'
    }
    let pl = this.getQueryStringValue("pl")
    let token = this.getQueryStringValue("token")
    localStorage.setItem('payload', pl)
    localStorage.setItem('new_token', token)
    //this.props.history.push('/onboard')

    let pay = localStorage.getItem('payload')
    let new_token = localStorage.getItem('new_token')
    const Payload = {
      "rep_id": pay,
      "token": new_token
    }

    if (pay !== '' && new_token !== '') {
      axios.post(ApiConst.BASE_URL + 'api/v2/user_verification', { "payload": Payload }).then((res) => {
  
          this.setState(() => ({
            newUser: res.data.data,
            spinner: false
          }))
      
       
      }).catch(error => {
        if(error.response){ 
          this.setState(({message: true, spinner: false}))
        }     
      })

    }

  }
  getQueryStringValue = (key) => {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  }
  makeQueryParam = (e) => {
    e.preventDefault()
      if(this.state.type !== '' && this.state.conf !== '' && this.state.conf.length >= 6 && this.state.type.length >= 6 && this.state.status) {
       
        axios.post(ApiConst.BASE_URL + 'api/v2/onboard_user', 
        {
            "password":this.state.conf,
            "emailid":this.state.newUser.emailid,
            "token": localStorage.getItem('new_token') 
            }).then((res) => {
         
          if (res.data.message) {
          toast.info(res.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
        })
        window.location = window.location.origin
      }
        }).catch(error => {
      
          if(error.response){
            toast.info(error.response.data.message, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: false,
          })
          }   
        })

      }

  }
  check = () => {
    if (this.state.type === this.state.conf) {
      document.getElementById('invalid-text').style.color = 'green';
      document.getElementById('invalid-text').innerHTML = 'correct';
      this.setState(({status: true}))
    } else {
      document.getElementById('invalid-text').style.color = 'red';
      document.getElementById('invalid-text').innerHTML = 'not correct';
      this.setState(({status: false}))
    }
    if (this.state.type === '' && this.state.conf === '') {
      document.getElementById('invalid-text').innerHTML = '';
    }
  }
  checkLength =()=>{
    if (this.state.type.length < 6) {
      document.getElementById('invalid-length').style.color = 'red';
      document.getElementById('invalid-length').innerHTML = 'Atleast enter 6 character ';
    } else{
      document.getElementById('invalid-length').innerHTML = '';
    } 
    if (this.state.type === '' && this.state.conf === '') {
      document.getElementById('invalid-length').innerHTML = '';
    }
  }
  handlePassword = (e) => {
    let name = e.target.name
    let val = e.target.value
    if (name === 'type-passowrd') {
      this.setState(({ type: val }))
    }
    if (name === 'confirm-password') {
      this.setState(({ conf: val }))
    }
  }
  render() {

    return (
      <React.Fragment>
        <div className="login-signup-wrapper verify">
          <div className="login-signup-left">
            <div className="login-title">
              <div className="titleImg">
                <img src="/static/images/Asset5.svg" alt="titleImg" width="180px" />
              </div>
              <p> Scale your Sales </p>
              <ul className="login-title-ul mt30">
                <li> Chat </li>
                <li> Call </li>
                <li> Video </li>
              </ul>
            </div>
          </div>
          <div className="login-signup-right">
        {
           this.state.spinner && <div className="spinner-token">
              <img src="/static/images/Eclipse-1s-100px.gif"/>
               </div>
        }
         { !this.state.spinner && !this.state.message && <div className="login-form">
              <h2 className="login-heading mb10"> Hi {this.state.newUser && this.state.newUser.name}! Welcome to Scoop </h2>
                <p className="login-sub-heading mb30">Please set Your password to activate your account</p>
              <form name="form" onSubmit={this.makeQueryParam} autoComplete="off">

                <div className={'form-group input-wraper'}>
                  <div className="input-handler">
                    <input type="password" className="form-control" id="password" onKeyUp={this.checkLength} onChange={this.handlePassword} placeholder="Type Password" name="type-passowrd" />
                    <i className="icon-password"></i>
                    <div id="invalid-length" className="invalid-text"></div>
                  </div>

                </div>

                <div className={'form-group input-wraper'}>
                  <div className="input-handler">
                    <input type="password" placeholder="Confirm Password" id="confirm_password" onKeyUp={this.check} onChange={this.handlePassword} className="form-control" name="confirm-password" />
                    <i className="icon-password"></i>
                  </div>
                  <div id="invalid-text" className="invalid-text"></div>
                  
                </div>

                <div className="forgot-row">

                </div>
                <button className="btn sign-in-btn mt40" type="submit" >Activate </button>

              </form>

            </div> }
            {this.state.message &&
            <div className="login-form"><p>Please Contact to <a href="mailto:info@scoop.ai">info@scoop.ai</a></p> </div>
        }

            <img src="/static/images/login-pattern.svg" alt="login-pattern-img" className="login-pattern" />
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
      </React.Fragment>
    )
  }
}
