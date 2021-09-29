/* Info: This file is for Login Screen */
/* Created on {3-07-19} By {Siddhant Chopra}*/
/* Modified on {8-07-19} By {Pravesh Sharma}*/

import React, { Component } from 'react';

import { LoginPage } from '../components/login/Login';

export default class LoginScreen extends Component {
  render() {
    return (
      <div>
        <LoginPage data={this.props} />
      </div>
    )
  }
}
