/* Info: This is a wrapper of search component */
/* Created on {3-07-19} By {Siddhant Chopra}*/
/* Modified on {27-08-19} By {Pravesh Sharma}*/

import React, { Component } from 'react'

import AllSearch from '../components/Search/AllSearch'

export default class SearchContainer extends Component {
  render() {
    return (
      <div>
        <AllSearch />
      </div>
    )
  }
}
