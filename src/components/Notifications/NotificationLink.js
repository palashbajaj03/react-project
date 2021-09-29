import React, { Component, Fragment } from 'react'
import moment from 'moment';
import {Link} from 'react-router-dom'
export default class NotificationLink extends Component {
    constructor(props){
        super(props)
        this.state={
           
        }
    }
    componentDidUpdate(prevProps){
        if(this.props.notification!==prevProps.notification){
           let temp=[]
        this.props.notification.forEach((data)=>{
            temp.push(Object.keys(data.intent_data))
        })
        temp.map((data)=>{
        
            switch(data[0]){
                case 'conversation_id':
                       this.setState(()=>({
                         link:'conversation-detail'
                     }))
                    break;
                    case 'collection_id':
                       this.setState(()=>({
                         link:'collection'
                     }))
                    break;
            }
        })
        }
        
    }

    render() {

        return (
            <Fragment>
                   <div class="notification-body-wrapper">
            {
              this.props.notification && this.props.notification.map((notification) => {
              
             return <Link to={this.state.link}><div class="notification-item mb20">
                  <div class="n-msg-wrapper">
                    {/* <div class="n-msg">
                      <span class="n-by bold">Jason Roy </span> commented <span class="n-comment bold">“Good Work”</span> on the conversation
                            </div> */}
                    <div class="n-msg">
                      {notification.message}
                    </div>
                    <div class="n-time-ago">
                      <i class="icon-time"></i> <span class="n-ago">{moment(notification.created_at).fromNow()}</span>
                    </div>
                  </div>

                  <div class="notification-unread-mark">
                    {!notification.is_read&&<span class="n-mark"></span>}
                  </div>
                </div> </Link>
            })
            }
          </div>
            </Fragment>
        )
    }
}
