/* Info: This file is for Login Component */
/* Created on {3-07-19} By {Pravesh Sharma}*/
/* Modified on {19-07-19} By {Siddhant Chopra}*/

import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { userActions } from '../../actions';
import { routingConstants } from '../../constants';
import './login.css'
import ReactGA from 'react-ga';
import { PageView, initGA } from '../Tracking/index';
class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: false,
      username: '',
      password: '',
      submitted: false,
      valid: false,
      userToken: cookie.load('user_token'),
      filter: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    initGA('UA-144819158-1', { standardImplementation: true });
    PageView();
  }

  componentDidUpdate() {
    if (!this.props.loggedIn)
      window.history.pushState(null, document.title, window.location.href)
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    // this.setState({ submitted: true });
    const { username, password } = this.state;

    if (!this.state.filter.test(username)) {
      this.setState(() => ({
        valid: true
      }))
    }
    if (username && password) {
      this.setState(({ submitted: true }), () => {
        this.props.onLogin(username, password, this.props.data);
      })
      ReactGA.ga('set', 'dimension1', username);
      ReactGA.ga('set', 'userId', username);
      window.Appcues && window.Appcues.identify(username);
    }
  }

  onBlurValid = () => {
    const { username } = this.state;

    if (!this.state.filter.test(username)) {
      this.setState(() => ({
        valid: true
      }))
    }
  }

  onFocusValid = () => {
    const { username } = this.state;

    if (!this.state.filter.test(username)) {
      this.setState(() => ({
        valid: false
      }))
    }
  }

  clickedSignUp = _ => {
    ReactGA.event({
      category: "Sign Up",
      action: "User clicked the sign up button",
      label: "Sign Up"
    });
  }

  clickedForgetPassword = _ => {
    ReactGA.event({
      category: "Forget Password",
      action: "User clicked the Forget Password button",
      label: "Forget Password"
    });
    this.setState(({ toggle: true }))
  }
  handleForget = () => {

  }
  render() {
    const { loggingIn, error } = this.props;
    const { username, password, submitted } = this.state;
 
    return (
      !cookie.load('user_token') ? <div className="login-signup-wrapper">
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

          {!this.state.toggle ? <div className="login-form" >
            <h2 className="login-heading mb30"> Welcome to Scoop </h2>
            <form name="form" onSubmit={this.handleSubmit} autoComplete="off">

              {<div className={'form-group input-wraper' + (this.state.valid ? ' invalid-email-class' : '')}>
                <div className="input-handler">
                  <input type="text" className="form-control" placeholder="Email" name="username" value={username} onChange={this.handleChange} onFocus={this.onFocusValid} onBlur={this.onBlurValid} />
                  <i className="icon-email"></i>
                </div>
                {(this.state.valid && <span className="invalid-text">Enter correct email id</span>)}
              </div>}

              <div className={'form-group input-wraper' + (submitted && !password ? ' has-error' : '')}>
                <div className="input-handler">
                  <input type="password" placeholder="Password" className="form-control" name="password" onChange={this.handleChange} />
                  <i className="icon-password"></i>
                </div>
                {error && <div className="invalid-text">{error}</div>
                }
              </div>

              <div className="forgot-row">
                <a className="forgote-pass" onClick={this.clickedForgetPassword}> Forgot Password? </a>
                {/*<h5 className="sign-up-heading"> New to scoop? <a href="#" className="sign-up" onClick={this.clickedSignUp}> Sign Up </a> </h5>*/}
              </div>
              <button className="btn sign-in-btn mt40" type="submit" disabled={this.state.submitted && !error ? true : false}>Sign in </button> 
        <a target="_blank" className="btn sign-in-btn mt40 signUp" href="https://www.scoop.ai/sign-up">Sign up</a>
            </form>

          </div>

            :

            <div className="login-form" >
              <h2 className="login-heading mb30"> Welcome to Scoop </h2>
              <form name="form" onSubmit={this.handleSubmit} autoComplete="off">

                <div className={'form-group input-wraper' + (this.state.valid ? ' invalid-email-class' : '')}>
                  <div className="input-handler">
                    <input type="text" className="form-control" placeholder="Please Enter your email" name="username" value={username} onChange={this.handleChange} onFocus={this.onFocusValid} onBlur={this.onBlurValid} />
                    <i className="icon-email"></i>
                  </div>
                  {(this.state.valid && <span className="invalid-text">Enter correct email id</span>)}
                </div>

                <a onClick={this.handleForget} className="btn sign-in-btn mt40 mr-2" >Reset Password</a>
                <button onClick={() => { this.setState(({ toggle: false })) }} className="btn emptyColorBtn bck-btn mt40" >Back</button>
              </form>

            </div>
          }

          <img src="/static/images/login-pattern.svg" alt="login-pattern-img" className="login-pattern" />
        </div>
      </div> : localStorage.getItem("reauth_destination") && localStorage.getItem('reauthToken') ? <Redirect to={localStorage.getItem("reauth_destination")} /> : localStorage.getItem('conversationPage')? <Redirect to={localStorage.getItem("conversationPage")} /> : <Redirect to={routingConstants.DASHBOARD} />
    );
  }
}

const mapStateToProps = state => ({
  loggingIn: state.authentication.loggingIn,
  loggedIn: state.authentication.loggedIn,
  error: state.authentication.error,
  state
})

const mapActionToProps = {
  onLogin: userActions.login
}

const connectedLoginPage = connect(mapStateToProps, mapActionToProps)(LoginPage);
export { connectedLoginPage as LoginPage };