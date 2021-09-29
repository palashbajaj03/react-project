import React, { Component } from 'react'
import Topics from '../components/Configure/Topics'
import Users from '../components/Configure/Users'
import Roles from '../components/Configure/Roles'
import TeamHierarchy from '../components/Configure/TeamHierarchy'
import Scripts from '../components/Configure/Scripts'
import Integration from '../components/Configure/Integration';
import './configure.css'
import '../components/Conversation-List/ConversationList.css';
import { connect } from 'react-redux'
import { configureAction } from '../actions/configureAction'
import {Link,Redirect} from 'react-router-dom'
import { routingConstants } from "../constants";

class ConfigureContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listActive: ''
    }
  }

  componentDidUpdate(prevProps,prevState) {
    if(prevState.listActive!==this.state.listActive) {
      window.scrollTo(0,0)
    }
  }

  deleteTopic = (id, name, page) => {
    this.setState(({ name, id, page }))
  }
  particularTopicDelete = () => {
    const { client_id, emailid } = this.props.user
    const { id, page } = this.state
    switch (page) {
      case 'USERS': this.props.deleteUser({ emailid: id }, emailid, client_id)
        break;
      case 'TOPICS': this.props.deleteTopics(client_id, emailid, id)
        break;
      case 'ROLES': this.props.LoadRolesDelete(client_id, emailid, id)
        break;
        case 'INTEGRATION': 
            this.props.deleteIntegrationChannel({scoop_client_id:client_id , emailid, channel: id })
        break;
      default: return;
    }
  }
  
  render() {
    const { page_users, page_user_hierarchy, page_topics, page_scripts, page_roles, page_integration } = this.props.access
    return (
      <React.Fragment>
        <div className="conversation-wrapp minHeight configurations">
          <div className="left-panel minHeight">
            <div className="pannelHead">
              <h4 className="pannelTitle">Configuration</h4>
            </div>

            <div className="pannelBody">
              <ul 
              // onClick={this.handleConfigureToggle}
              >
                {page_topics && <Link to={`${routingConstants.CONFIGURE}/topics`}><li className={this.props.match.params.page=== 'topics' ? 'active showMenu' : ''}>
                  <div id="Topics"> Topics </div>
                </li> </Link>}
                {page_users && <Link to={`${routingConstants.CONFIGURE}/users`}><li className={this.props.match.params.page === 'users' ? 'active showMenu' : ''}>
                  <div id="users" > Users </div>
                </li> </Link>}
                {page_roles && <Link to={`${routingConstants.CONFIGURE}/roles`}><li className={this.props.match.params.page=== 'roles' ? 'active showMenu' : ''}>
                  <div id="Roles" > Roles </div>
                </li></Link>}
                {page_user_hierarchy && <Link to={`${routingConstants.CONFIGURE}/team`}><li className={this.props.match.params.page === 'team' ? 'active showMenu' : ''}>
                  <div id="Team-Hierarchy"> Team Hierarchy</div>
                </li></Link>}
                {  /*page_scripts && <li className={this.state.listActive === 'Scripts' ? 'active showMenu' : ''}>
                                    <div id="Scripts">Scripts </div>
                                </li>*/}
                {page_integration && <Link to={`${routingConstants.CONFIGURE}/integration`}><li className={this.props.match.params.page === 'integration' ? 'active showMenu' : ''}>
                  <div id="Integration"> Integration</div>
                </li> </Link>}

              </ul>
            </div>
          </div>

          <div className="start-all-conversation">
            {this.props.match.params.page === 'users' &&  page_users ? <Users deleteUser={this.deleteTopic} /> :
            this.props.match.params.page === 'topics' && page_topics ? <Topics deleteTopic={this.deleteTopic} /> :
            this.props.match.params.page === 'roles' && page_roles ? <Roles deleteRole={this.deleteTopic} /> :
            this.props.match.params.page === 'team' && page_user_hierarchy ? <TeamHierarchy /> :
            /* {this.props.match.params.page === 'scripts' && <Scripts />} */
            this.props.match.params.page === 'integration' && page_integration ? <Integration edit={false} deleteRole={this.deleteTopic} /> : <Redirect to={routingConstants.DASHBOARD} />}
          </div>
        </div>
        <div className="modal" id="DeleteTopic">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body">
                <div className="modal-box">
                  <div className="modal-icon">
                    <img src="/static/images/delete-collection.png" />
                  </div>
                  <div className="modal-title">
                    <h2> Do you want to delete {this.state.name} ? </h2>
                    {/* <p>This conversation will be removed only from this collection but will be available elsewhere.</p> */}
                  </div>
                  <div className="collectionButtons">
                    <button type="button" className="colorBtn btn btn-secondary" onClick={this.particularTopicDelete} data-dismiss="modal">DELETE</button>
                    <button type="button" className="btn emptyColorBtn" data-dismiss="modal">CANCEL</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment >
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    access: state.authentication.access
  }
}

const mapActionToProps = {
  deleteTopics: configureAction.deleteTopics,
  deleteUser: configureAction.deleteUser,
  LoadRolesDelete: configureAction.LoadRolesDelete,
  deleteIntegrationChannel: configureAction.deleteIntegrationChannel
}

export default connect(mapStateToProps, mapActionToProps)(ConfigureContainer);