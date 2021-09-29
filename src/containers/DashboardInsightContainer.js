import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import moment from 'moment'
import { routingConstants } from '../constants';
import InsightConversationContainer from './InsightConversationContainer';
import InsightRepsContainer from './InsightRepsContainer'
import InsightCustomerContainer from './InsightCustomerContainer'

import './dashboardContainer.css'

class DashboardContainer extends Component {

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.value !== prevProps.match.params.value) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="content-wrapper">
         { 
         this.props.user && this.props.user.last_data_sync.display_alert && <div class="alert alert-info alert-dismissible fade show" style={{ margin: '5px 0px 25px' }}>
             <strong>Note: </strong> No Recent Conversations Found (From {moment(this.props.user && this.props.user.last_data_sync.datetime.replace("Z", "")).format('Do MMMM YYYY')} till now)
        <button type="button" class="close" data-dismiss="alert">&times;</button>
          </div>
         }

          {
            (this.props.match.params.value === 'conversation' && (this.props.access && this.props.access.page_conversation_dashboard)) ?
              <InsightConversationContainer dashboard={this.props.match.params.value} />
              : (this.props.match.params.value === 'representative' && (this.props.access && this.props.access.page_rep_dashboard))
                ? <InsightRepsContainer dashboard={this.props.match.params.value} /> : (this.props.match.params.value === 'customer' && (this.props.access && this.props.access.page_customer_dashboard)) ? <InsightCustomerContainer dashboard={this.props.match.params.value} /> : <Redirect to={routingConstants.DASHBOARD} />
          }
        </div>
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    access: state.authentication.access,
  }
}

export default connect(mapStateToProps)(DashboardContainer);