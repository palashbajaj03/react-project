import React, { Component } from 'react'
import AppRouter from "./routes";
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import { userActions } from './actions/user-action'

class TokenValid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalToggle: false
    }
  }

  componentDidMount() {
    let minutes = true; // change to false if you'd rather use seconds
    let interval = minutes ? 60000 : 1000;
    let IDLE_TIMEOUT = 120;
    let idleCounter = 0;

    document.onmousemove = document.onkeypress = function () {
      idleCounter = 0;
      let token = cookie.load('user_token', {
        path: "/"
      })
      if (token) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (IDLE_TIMEOUT * 60 * 1000));
        cookie.save('user_token', token,
          {
            path: '/',
            expires
            // secure: true,
            // httpOnly: true
          })
      }
    };

    window.setInterval(() => {
      if (++idleCounter >= IDLE_TIMEOUT) {
        if (this.props.loggedIn && cookie.load('user_token')) {
          const { emailid, client_id } = this.props.user
          this.props.logOut(emailid, client_id)
        }
      }
    }, interval);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tokenInvalid !== this.props.tokenInvalid) {
      if (this.props.tokenInvalid) {
        this.setState(() => ({
          modalToggle: true
        }), () => {
          window.jQuery('#errorModal').modal({ backdrop: 'static' })
        })
      }
    }
  }
  render() {

    return (
      <div>
        <AppRouter />
        {this.state.modalToggle && <div class="modal" id="errorModal">
          <div class="modal-dialog">
            <div class="modal-content">

              <div class="modal-header">
                {/* <button type="button" class="close" data-dismiss="modal"><i class="icon-close"></i></button> */}
              </div>

              <div class="modal-body">
                <div class="modal-box">
                  <div class="modal-img mb20">
                    <div class="errorImg">
                      <img src="/static/images/alert@2x.png" />
                    </div>
                  </div>
                  <div class="modal-title text-center mb20">
                    <h2>Your Session is Expired</h2>
                    <p>Return To Login Page</p>
                  </div>
                  <div class="collectionButtons text-center">
                    <button type="button" onClick={() => { cookie.remove('user_token', { path: '/' }); localStorage.removeItem('user'); localStorage.removeItem('access'); localStorage.removeItem('cta'); localStorage.removeItem('record'); window.location.reload(); localStorage.removeItem('fadeuponce')}} class="colorBtn btn btn-secondary">Ok</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        }
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    loggedIn: state.authentication.loggedIn,
    tokenInvalid: state.conversationReducer.tokenInvalid
  }
}

const mapActionToProps = {
  logOut: userActions.logout,
}

export default connect(mapStateToProps, mapActionToProps)(TokenValid)