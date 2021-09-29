import React, { useState, useEffect } from 'react';
import Scrollbar from 'react-scrollbars-custom'
import { connect } from 'react-redux';
import moment from 'moment';
import { collectionAction, conversationAction } from '../../actions';
import { MentionsInput, Mention } from 'react-mentions'

const Comments = (props) => {
  let [invisibleText, setInvisibleText] = useState('')
  let [tagged, setTagged] = useState([])
  let [type, setType] = useState('basic')
  let [visibleText, setVisibleText] = useState('')
  let [reply, setReply] = useState(false);
  let [showReplies, toggleShowReplies] = useState(false);
  let [messageText, setMessageText] = useState('');
  let [comment_id, setCommentId] = useState('');
  let [replies, setReplies] = useState([])

  const closeCommentBar = () => {
    props.close()
  }

  useEffect(() => {
    const { client_id, emailid } = props.user
    props.loadHierarchy({ client_id, emailid })
  }, [])

  const chnageInput = (e, newValue, newPlainTextValue, mentions) => {
    let visibleText = e.target.value;
    let invisibleText = '';
    let removeAtRate = '';
    let addParentheses = '';
    let tagged = []
    if (mentions.length === 0) {
      setType('basic')
      setTagged([])
    }
    if (mentions.length > 0) {
      tagged = mentions.map((data) => (
        {
          name: data.display.replace(/@/, '').trim(),
          user_id: data.id
        }
      ))
      removeAtRate = visibleText.replace(/@\[[\w]*\s[\w]*\]/g, '')
      addParentheses = removeAtRate.replace(/[(]/g, '{id:');
      addParentheses = addParentheses.replace(/[)]/g, '}');
      invisibleText += addParentheses + " "
      setType('tagged')
      setTagged([...tagged])
    }
    if (reply || showReplies) {
      setType('thread')
    }
    setInvisibleText(invisibleText)
    setVisibleText(visibleText)
  }

  const postComment = () => {
    const { client_id, emailid, firstname, lastname, rep_id } = props.user;
    let id = props.id;
    let comments;
    // let commentType = (reply || showReplies) ? 'thread' : tagged.length > 0 ? 'tagged' : 'basic'
    // setType(commentType);
    switch (type) {
      case 'basic':
        comments = {
          type: type,
          message: visibleText.trim(),
          datetime: moment().utc().format("YYYY-MM-DDTHH:mm:ss") + "Z"
        }
        break;
      case 'tagged':
        comments = {
          type: type,
          message: invisibleText.trim(),
          datetime: moment().utc().format("YYYY-MM-DDTHH:mm:ss") + "Z",
          tagged: tagged
        }
        break;
      case 'thread':
        comments = {
          type: type,
          comment_id: comment_id,
          message: tagged.length > 0 ? invisibleText.trim() : visibleText.trim(),
          datetime: moment().utc().format("YYYY-MM-DDTHH:mm:ss") + "Z",
          tagged: tagged.length > 0 ? tagged : []
        }
    }
    if ((/^\S/).test(comments.message)) {
      props.postComment({ client_id, emailid, id, comments, firstname, lastname, rep_id });
      setInvisibleText('');
      setVisibleText('');
      setTagged([]);
      setReply(false);
      toggleShowReplies(false)
    }
  }

  const renderData = (value) => {
    let data = props.userHierarchy && props.userHierarchy.map(user => ({ display: user.name, id: user.user_id }))
    let suggestions = data && data.filter(val => val.display.toLowerCase().includes(value));
    return suggestions
  }

  const replyComment = (e) => {
    e.preventDefault();
    let messageText = e.currentTarget.value;
    let comment_id = e.currentTarget.id
    setReply(true);
    setType('thread');
    setMessageText(messageText);
    setCommentId(comment_id);
  }

  const closeReply = (e) => {
    e.preventDefault();
    setReply(false);
    setType('basic');
    setMessageText('');
    setCommentId('');
  }

  let rx = /{id:(([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)}/i;
  props.comments && props.comments.map(comment => {
    if (comment.tagged.length > 0) {
      comment.tagged.map(tag => {
        comment.message = comment.message.replace(rx, '@' + tag.name);
      })
    }
    if (comment.thread.length > 0) {
      comment.thread.map(threadData => {
        if (threadData.tagged.length > 0) {
          threadData.tagged.map(tag => {
            threadData.message = threadData.message.replace(rx, '@' + tag.name)
          })
        }
      })
    }
  })

  return (
    <div className="comment-bar animated slideInRight">
      <div className="commentsContainer">
        <div className="commentWrap">
          <div className="commentWrapHead text-center mb40">
            <h4>Comments</h4>
            <div className="day"><span>Today</span></div>
            <div className="close-comment-bar">
              <span><i className="icon-close" onClick={closeCommentBar}></i></span>
            </div>
          </div>
          <div className="commentWrapBody">
            <Scrollbar>
              <ul className="transcriptChat">
                {
                  props.comments && props.comments.map((comment, index) => (
                    <li key={index} className={props.user.emailid === comment.user ? "user" : "client"}>
                      <div className="msgWrap">
                        <div className="userIcon">
                          <span>{comment.user.substring(0, 1).toUpperCase()}</span>
                        </div>
                        <div className="msgNode">
                          <p className="msg"><span><pre>{comment.message}</pre></span></p>
                          <div className="msgTime"><div className="timenReplyBtn"><span className="time">{moment(comment.datetime).format("hh:mm A")}</span>
                            <button id={comment.id} className="replyBtn" value={comment.message} onClick={replyComment}>
                              <img src="/static/images/reply.svg" />
                            </button> </div>

                            {comment.thread.length > 0 && <div className="viewReply">
                              <button className="viewReplyBtn" onClick={() => { toggleShowReplies(true); setReplies(comment.thread); }}>View {comment.thread.length} replies</button>
                            </div>} </div>
                        </div>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </Scrollbar>
            <div className="commentBox">
              {reply && <div className="msgNode replyComment ">
                <p className="msg msgReplyOf">
                  <span className="replyOf">{messageText}</span>
                  <i className="icon-close" onClick={closeReply}></i>
                </p>
              </div>}
              <div className="form-group">
                <div className="customTextBox">
                  {/* <input type="text" className="form-control" placeholder="Add Comments" onChange={chnageInput} value={comment} /> */}
                  <MentionsInput
                    value={visibleText}
                    onChange={chnageInput}
                    allowSpaceInQuery
                    placeholder={"Add Comments"}
                    className="commentInput"
                  >
                    <Mention
                      data={renderData}
                      appendSpaceOnAdd
                      renderSuggestion={(suggestion, search, highlightedDisplay) => (
                        <div className="user">{highlightedDisplay}</div>
                      )}
                      displayTransform={(id, display) => `@${display}`}
                    />
                  </MentionsInput>
                  <button onClick={postComment}>Send</button>
                </div>

              </div>
            </div>
            {showReplies && <div className="replyBox">
              <div className="replyBoxHead">
                <div className="back-btn" onClick={() => { toggleShowReplies(false); setReplies([]) }}><i className="icon-arrow-lhs"></i> Back</div>
                <h2>{props.user.firstname}’s {replies.length} Replies</h2>
              </div>
              <div className="replyBoxBody mt25">
                <div className="repliesNode">
                  <ul>
                    {
                      replies && replies.map((reply, index) => (
                        <li key={index}>
                          <div className="msgWrap">
                            <div className="userIcon">
                              <span>{reply.user.substring(0, 1).toUpperCase()}</span>
                            </div>
                            <div className="msgNode">
                              <p className="msg msgReplyOf">
                                <span className="replyOf"><pre>{reply.message}</pre></span>
                              </p>
                              <div className="msgTime"><span className="time">{moment(reply.datetime).format("hh:mm A")}</span> <img src="/static/images/reply.svg" /></div>
                            </div>
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateTopProps = state => ({
  user: state.authentication.user,
  userHierarchy: state.conversationReducer.hierarchy,
})

const mapActioToProps = {
  postComment: collectionAction.postCollectionComment,
  loadHierarchy: conversationAction.loadHierarchy,
}

export default connect(mapStateTopProps, mapActioToProps)(Comments);