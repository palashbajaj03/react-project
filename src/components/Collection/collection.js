/* Info: This file renders collection component*/
/* Created on {03-07-19} By {Siddhant Chopra}*/
/* Modified on {22-07-19} By {Pravesh Sharma}*/

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import Pagination from 'rc-pagination';
import Scrollbar from 'react-scrollbars-custom';

import { routingConstants } from '../../constants';
import { collectionAction, conversationAction, searchAction } from '../../actions';
import NewCollection from './NewCollection';
import DeleteCollection from './DeleteCollection';
import BookMarkConversation from '../Conversation-List/BookMarkConversation';
import EditCollection from './EditCollection';
import RemoveConversation from './RemoveConversation';
import Comments from './Comments';
import './collection.css';
import RecommendationModal from './recommendationModal';

import {timezoneDatePrint} from '../../constants'

momentDurationFormatSetup(moment)

class Collection extends Component {

  constructor() {
    super();
    this.state = {
      active: 'starred',
      display: true,
      showStarred: true,
      pageTitle: '',
      total: '',
      itemsCountPerPage: 10,
      activePage: 0,
      collectionId: 0,
      searchData: [],
      data: [],
      value: "",
      edit: false,
      showComment: false,
      filter: {

      },
      pagination: {
        itemsCountPerPage: 10,
        activePage: 0
      }
    }
  }

  componentDidMount() {
    const { client_id, emailid } = this.props.user;
    this.props.loadAllCollection(client_id, emailid);
    if (this.props.match.params.collection === 'starred') {
      this.loadStarred()
    } else {
      this.onClick();
    }
    window.scrollTo(0, 0)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.collection !== prevProps.collection) {
      const total = this.props.collection && this.props.collection.total_conversations
      let collectionStatus = this.props.collection && this.props.collection.status
      this.setState(() => ({ total, collectionStatus }))

      if (this.props.collection !== undefined && this.props.collection.type === 'rule_based') {
        let filter = this.props.collection.filter
        const { client_id, emailid } = this.props.user
        const { pagination } = this.state;
        this.setState(() => ({
          filter
        }))
        this.props.loadSearchList(filter, pagination, client_id, emailid)
      }

    }

    if ((this.props.allCollectionList !== prevProps.allCollectionList)) {
      let count = 0;
      let data = this.props.allCollectionList && this.props.allCollectionList.curated.concat(this.props.allCollectionList.shared, this.props.allCollectionList.pinned)
      this.setState(({ data }))
      data.forEach(value => {
        count = count + value.total_conversations
      });
      window.Appcues && window.Appcues.identify(this.props.user.emailid, {
        totalConversations: count,
        avgConversationPerCollection: Math.round(count / data.length)
      });
    }
    if (this.props.match.params.collection !== prevProps.match.params.collection) {
      if (this.props.match.params.collection === 'starred') {
        this.setState(prevState => ({
          edit: false
        }), () => {
          this.loadStarred()
        })
      } else {
        this.setState(prevState => ({
          edit: false
        }), () => {
          this.onClick();
        })
      }
    }
    if (this.props.collectionName !== prevProps.collectionName) {
      this.setState(() => ({ pageTitle: this.props.collectionName }))
    }
    if (this.state.pageTitle === '') {
      this.setState(() => ({ pageTitle: this.props.collectionName }))
    }
  }

  onClick = (e) => {
    const id = this.props.match.params.collection;
    let name = '';
    if (e) {
      name = e.target.innerText
    }
    const { client_id, emailid } = this.props.user
    this.setState(() => ({
      collectionId: id,
      itemsCountPerPage: 10,
      activePage: 0,
      showStarred: false
    }), () => {
      // const { itemsCountPerPage, activePage } = this.state;
      //  console.log('helloooo')
      this.props.loadCollection(client_id, emailid, id);
      window.scrollTo(0, 0)
    })
    if (this.state.active === id) {
      // this.setState({ active: '' });
    } else {
      this.setState(() => ({ active: id, pageTitle: "" }))
    }
  }

  loadStarred = (e) => {
    if (e) {
      if (this.state.active === e.target.id) {
        // this.setState({ active: '' });
      } else {
        this.setState({ active: e.target.id })
      }
      const pageTitle = e.target.innerText;
      this.setState(() => ({ pageTitle, showStarred: true }), () => {
        const { client_id, emailid } = this.props.user;
        this.props.loadStarred({ client_id, emailid })
      })
    } else {
      const pageTitle = 'All Starred Conversations'
      this.setState(() => ({
        pageTitle,
        showStarred: true,
        active: 'starred'
      }), () => {
        const { client_id, emailid } = this.props.user;
        this.props.loadStarred({ client_id, emailid })
      })
    }
  }
  paginationNumberChange = (activePage, pageSize) => {
    this.setState((prevState) => ({
      pagination: {
        ...prevState.pagination,
        itemsCountPerPage: pageSize,
        activePage: activePage - 1
      }
    }),
      () => {
        const { client_id, emailid } = this.props.user
        const { filter, pagination } = this.state;
        this.props.loadSearchList(filter, pagination, client_id, emailid);
        window.scrollTo(0, 0)
      });
  }
  // onChange(activePage, pageSize) {
  //   const { client_id, emailid } = this.props.user
  //   this.setState(() => ({ itemsCountPerPage: pageSize, activePage: activePage - 1 }), () => {
  //     const { itemsCountPerPage, activePage, collectionId } = this.state;
  //     this.props.loadCollection(client_id, emailid, collectionId, { itemsCountPerPage, activePage });
  //     window.scrollTo(0, 0)
  //   });
  // }

  filter = (e) => {
    const count = parseInt(e.target.value);
    let { activePage } = this.state.pagination;
    let total = this.props.searchList && this.props.searchList.pagination.total_records
    if (total) {
      let totalPage = Math.ceil((total / count))
      activePage = totalPage <= activePage ? totalPage - 1 : activePage;
    }
    this.setState((prevState) => {
      return {
        pagination: {
          ...prevState.pagination,
          activePage,
          itemsCountPerPage: count
        }
      }
    }, () => {
      const { client_id, emailid } = this.props.user
      const { filter, pagination } = this.state;
      this.props.loadSearchList(filter, pagination, client_id, emailid)
      window.scrollTo(0, 0)
    });
  }
  // filter = (e) => {
  //   const count = parseInt(e.target.value);
  //   let { activePage } = this.state;
  //   let total = this.props.pagination && this.props.pagination.total_records
  //   if (total) {
  //     let totalPage = Math.ceil((total / count))
  //     activePage = (totalPage <= activePage && totalPage !== 0) ? totalPage - 1 : activePage;
  //   }
  //   const { client_id, emailid } = this.props.user
  //   this.setState(() => ({ itemsCountPerPage: count, activePage }), () => {
  //     const { itemsCountPerPage, activePage, collectionId } = this.state;
  //     this.props.loadCollection(client_id, emailid, collectionId, { itemsCountPerPage, activePage });
  //     window.scrollTo(0, 0)
  //   });
  // }

  itemRender = (current, type, element) => {
    if (type === 'page') {
      current = current < 10 ? '0' + current : current;
      return <a>{current}</a>;
    }
    return element;
  };

  onDeleteCollection = () => {
    const { client_id, emailid } = this.props.user;
    const id = this.state.collectionId;
    this.props.delete({ client_id, emailid, id });
    this.props.history.push('/collection/starred')
  }

    onRemoveConversation = () => {
    const { client_id, emailid } = this.props.user;
    const id = this.state.collectionId;
    const conversation_id = this.state.conversationId;
    this.props.removeConversation({ client_id, emailid, id, conversation_id })

  }

  setSearchFilter = (e) => {
    e.preventDefault()
    let value = e.target.value
    this.setState(({ value }), () => {
      this.searchCollection()
    })
  }

  searchCollection = () => {
    if (this.state.value !== "") {
      const searchData = this.state.data.filter(data => data.name.toLowerCase().includes(this.state.value.toLowerCase()))
      this.setState(({ searchData }))
    } else {
      this.setState(({ searchData: [] }))
    }
  }

  closeSearch = () => {
    this.setState(({ searchData: [], value: '' }))
  }

  handleActivity = (e) => {
    e.preventDefault()
    const { client_id, emailid, firstname, lastname, rep_id } = this.props.user;
    const [item, id] = e.target.id.split(' ');
    const itemId = e.target.id;
    let user;
    if (item === 'star') {
      user = {
        emailid,
        first_name: firstname,
        last_name: lastname,
        rep_id
      }
      // document.getElementById(itemId).style.pointerEvents = "none";
      if (!e.target.className.includes('starActive')) {
        // e.target.classList.add('starActive')
        this.setState(() => ({
          starred: true
        }), () => {
          const { starred } = this.state
          this.props.star({ client_id, emailid, starred, id, user });
        })
      } else {
        // e.target.classList.remove('starActive')
        this.setState(() => ({
          starred: false
        }), () => {
          const { starred } = this.state
          this.props.star({ client_id, emailid, starred, id, user });
        })
      }
    }
    if (item === "book") {
      this.setState(({ conversationId: id }), () => {
        if (!this.props.collectionList) {
          this.props.readCollection({ client_id, emailid })
        }
      })
    }
    if (item === "remove") {
      this.setState(({ conversationId: id }))
    }
  }

  renameCollection = (name) => {
    const { client_id, emailid } = this.props.user;
    const id = this.state.collectionId;
    const rename = true;
    this.props.updateCollection({ name, client_id, emailid, id }, rename)
  }

  openEdit = () => {
    this.setState((prevState) => ({ edit: !prevState.edit }))
  }

  pinCollection = (e) => {
    e.preventDefault()
    console.log(e.target)
    const id = e.target.id;
    const name = e.target.getAttribute('data-name')
    const { client_id, emailid } = this.props.user
    this.props.updateCollection({
      id,
      collection: {
        name,
        pinned: true
      }, client_id, emailid
    })
  }

  unPinCollection = (e) => {
    e.preventDefault()
    const id = e.target.id;
    console.log(e.target)
    const name = e.target.getAttribute('data-name')
    const { client_id, emailid } = this.props.user;
    this.props.updateCollection({
      id,
      collection: {
        name,
        pinned: false
      }, client_id, emailid
    })
  }
  getInitials = (string) => {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }

  showCommentBar = () => {
    this.setState(({ showComment: true }), () => {
      // document.getElementsByClassName('comment-bar')[0].style.display = "block";
    })
  }

  closeCommentBar = () => {
    document.getElementsByClassName('comment-bar')[0].classList.remove('slideInRight')
    document.getElementsByClassName('comment-bar')[0].classList.add('slideOutRight')
    setTimeout(() => {
      if (document.getElementsByClassName('comment-bar')[0]) {
        document.getElementsByClassName('comment-bar')[0].classList.remove('slideOutRight')
        document.getElementsByClassName('comment-bar')[0].classList.add('slideInRight')
        this.setState(({ showComment: false }))
      }
      // document.getElementsByClassName('comment-bar')[0].style.display = "none";
    }, 1000)
  }
  handleCollectionStatus = (e) => {
    const { client_id, emailid } = this.props.user;
    if (e.target.className === 'icon-pause') {
      this.setState(() => ({
        collectionStatus: 'pause'
      }), () => {
        this.props.UpdateCollectionStatus(client_id, emailid, this.state.collectionId, this.state.collectionStatus)
      })

    }
    if (e.target.className === 'icon-stop') {
      this.setState(() => ({
        collectionStatus: 'stop'
      }), () => {
        this.props.UpdateCollectionStatus(client_id, emailid, this.state.collectionId, this.state.collectionStatus)
      })
    }
    if (e.target.className === 'icon-play') {
      this.setState(() => ({
        collectionStatus: 'play'
      }), () => {
        this.props.UpdateCollectionStatus(client_id, emailid, this.state.collectionId, this.state.collectionStatus)
      })
    }
  }
  render() {
    //  console.log(this.props.starredList && this.state.showStarred)
    return (
      <React.Fragment>
        {!this.state.edit && <div className="conversation-wrapp">
          <div className="custom-row1">
            <div className="left-panel">
              <div className="search-collection">
                <form>
                  <div className="input-group ">
                    <input type="text" className="form-control custom-input" placeholder="Search Collections" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={this.setSearchFilter} value={this.state.value} />
                    <div className="input-group-append">
                      {!this.state.value && <span className="input-group-text" id="basic-addon2"><i className="icon-search"></i></span>}
                      {this.state.value && <span className="input-group-text" onClick={this.closeSearch}>&times;</span>}
                    </div>
                  </div>
                </form>
              </div>
              {this.state.searchData.length >= 1 && <div className="searchDiv">
                <div>
                  <ul className="sidebar-list">
                    {this.state.searchData.map((data, index) => (
                      <Link key={index} to={
                        {
                          pathname: "/collection/" + data.id,
                          // state:{
                          //   name:data.name
                          // }
                        }
                      }
                      >
                        <li className={`${this.state.active === data.id ? 'active' : ''}`} key={index}><div className="sidebar-text">
                          <h4 id={data.id} className="convers-list-text" > {data.name} </h4>
                          <small className="small-text"> {data.count ? data.count : 0} Conversations </small>
                        </div></li></Link>
                    ))}
                  </ul>
                </div>
              </div>
              }
              {!this.state.searchData.length >= 1 &&
                <Scrollbar>
                  <div className="sidebar">
                    <div className="starred-conversation border-top-bottom">
                      <ul className="sidebar-list">
                        <Link to={
                          {
                            pathname: "/collection/starred",
                            //  state:{
                            //    name:'Starred Conversation'
                            //  }
                          }
                        }>
                          <li id="starred" className={`${this.state.active === 'starred' ? 'active' : ''}`}><div className="sidebar-text"><h4 id="starred" className="convers-list-text">Starred Conversations</h4></div></li>
                        </Link>
                      </ul>
                    </div>

                    <div className="shared-conversation border-bottom">
                      <div className="shared-title">
                        <p className="list-title"> SHARED WITH ME </p>
                      </div>
                      <ul className="sidebar-list">
                        {
                          this.props.allCollectionList && this.props.allCollectionList.shared.map((data, index) => (
                            <Link key={index} to={
                              {
                                pathname: "/collection/" + data.id,
                                // state:{
                                //   name:data.name
                                // }
                              }
                            }
                            >
                              <li id={data.id} className={`${this.state.active === data.id ? 'active' : ''}`}>
                                <div className="sidebar-text">
                                  <h4 id={data.id} className="convers-list-text" data-name={data.name} onClick={this.onClick} > {data.name} </h4>
                                  <small className="small-text"> {data.count ? data.count : 0} Conversations </small>
                                </div>
                                <div onClick={this.pinCollection} className="sidePinIcon">
                                  <i id={data.id} data-name={data.name} className="icon-pin"></i>
                                </div>
                              </li>
                            </Link>
                          ))
                        }
                      </ul>
                    </div>

                    <div className="pinned-conversation border-bottom">
                      <div className="shared-title">
                        <p className="list-title"> PINNED <span className="pushRight"><i className="icon-pin"></i></span> </p>
                      </div>
                      <ul className="sidebar-list">
                        {
                          this.props.allCollectionList && this.props.allCollectionList.pinned.map((data, index) => (
                            <Link key={index} to={
                              {
                                pathname: "/collection/" + data.id,
                                // state:{
                                //   name:data.name
                                // }
                              }
                            }
                            >
                              <li id={data.id} key={index} className={`${this.state.active === data.id ? 'active' : ''}`} >
                                <div className="sidebar-text">
                                  <h4 id={data.id} className="convers-list-text" > {data.name} </h4>
                                  <small className="small-text"> {data.count ? data.count : 0} Conversations </small>
                                </div>
                                {<div onClick={this.unPinCollection} className="sidePinIcon">
                                  <i id={data.id} data-name={data.name} className="icon-pin"></i>
                                </div>}
                              </li>
                            </Link>
                          ))
                        }
                      </ul>
                    </div>

                    <div className="curated-conversation border-bottom">
                      <div className="shared-title">
                        <p className="list-title"> CURATED<span className="pushRight"><img data-toggle="modal" data-target="#createCollection" src="/static/images/curated-plus.png" /></span> </p>
                      </div>
                      <ul className="sidebar-list">
                        {
                          this.props.allCollectionList && this.props.allCollectionList.curated.map((data, index) => (
                            <Link key={index} to={
                              {
                                pathname: "/collection/" + data.id,
                                // state:{
                                //   name:data.name
                                // }
                              }
                            }
                            >
                              <li id={data.id} key={index} className={`${this.state.active === data.id ? 'active' : ''}`} >
                                <div className="sidebar-text">
                                  <h4 id={data.id} className="convers-list-text" > {data.name} </h4>
                                  <small className="small-text"> {data.count ? data.count : 0} Conversations </small>
                                </div>
                                <div onClick={this.pinCollection} className="sidePinIcon">
                                  <i id={data.id} data-name={data.name} className="icon-pin"></i>
                                </div>
                              </li>
                            </Link>
                          ))
                        }
                      </ul>
                    </div>

                  </div>
                </Scrollbar>
              }
            </div>
            <div className="start-all-conversation">
              <div className="page-title-row">
                <div className="page-title-box">
                  <h2 className="page-title"> {this.state.pageTitle}
                    {!this.state.showStarred && <span className={`${!this.state.showStarred && this.props.type && this.props.type === 'rule_based' ? "sideTextHighlight ruleBasedSideText" : "sideTextHighlight"}`}>{!this.state.showStarred && this.props.type && this.props.type === 'rule_based' ? 'Rule-based Collection' : (this.props.type && !this.state.showStarred) && 'Manual Collection'}</span>}
                  </h2>
                  <div className="page-breadcum">
                    <p><a href="#">Collections </a> > {this.state.pageTitle} </p>
                  </div>
                </div>
                {this.state.active === 'starred' ?
                  <div className="button-wrapper"> <button className="btn btn-secondary" data-toggle="modal" data-target="#createCollection" > <i className="icon-plus"></i> CREATE COLLECTION </button> </div>
                  :
                  <div className="btnGroup">
                    {this.props.type && this.props.type === 'rule_based' ? <Fragment>
                      {/* <div className="pause coBtn"><i className={this.state.collectionStatus === 'processing'?"icon-pause":this.state.collectionStatus === 'pause'?"icon-edit": this.state.collectionStatus === 'play'?"icon-pause":this.state.collectionStatus === 'stop'&& "icon-pause"} onClick={this.handleCollectionStatus}></i></div> */}
                      {/* <div className="pause coBtn">
                        {
                          <img src={this.state.collectionStatus === 'processing' ? "/static/images/pause.svg" : this.state.collectionStatus === 'pause' ? "/static/images/play.svg" : this.state.collectionStatus === 'play' ? "/static/images/pause.svg" : this.state.collectionStatus === 'stop' ? "/static/images/play.svg" : undefined} className={this.state.collectionStatus === 'processing' ? "icon-pause" : this.state.collectionStatus === 'pause' ? "icon-play" : this.state.collectionStatus === 'play' ? "icon-pause" : this.state.collectionStatus === 'stop' ? "icon-play" : undefined} onClick={this.handleCollectionStatus} />
                        }

                      </div> */}

                      {/* <div className="stop coBtn"><i className="icon-stop" onClick={this.handleCollectionStatus}></i></div> */}
                      <Link to={{
                        pathname: routingConstants.EDITRULEBASED + "/" + this.props.match.params.collection,
                        collectionName: this.props.collection.name,
                        cta: {
                          collectionName: this.props.collection.name,
                          client_id: this.props.user.client_id,
                          emailid: this.props.user.emailid,
                          filter: this.props.collection.filter,
                          pagination: {
                            itemsCountPerPage: 10,
                            activePage: 1
                          }

                        }
                      }}><div className="edit coBtn"><i className="icon-edit"></i></div></Link>
                    </Fragment>
                      :
                      <div className="edit coBtn" data-toggle='modal' data-target='#editCollection'><i className="icon-edit"></i></div>}
                    {/* <div className="coBtn"><i className="icon-chat" onClick={this.showCommentBar} ></i></div> */}
                    {/*<div className="share coBtn"><i className="icon-share"></i></div>*/}
                    {<div className="delete coBtn" data-toggle="modal" data-target="#deleteCollection"><i className="icon-delete"></i></div>}
                  </div>
                }
              </div>
              <div className="show-conversation-row mt30">
              
                {
                  this.props.starredList && this.state.showStarred && this.props.starredList.length > 0? <span className="page-title-text"> Showing {this.props.starredList && this.state.showStarred && this.props.starredList.length} conversation(s) </span>:  this.props.starredList && this.state.showStarred && this.props.starredList.length === 0?<span className="page-title-text"> No Conversation(s)</span>

                    : this.props.collection !== undefined && this.props.collection.type === 'rule_based' && this.props.searchList !== undefined && this.props.searchList.data.length > 0 ? <span className="page-title-text"> Showing {this.props.searchList !== undefined && this.props.searchList.pagination.total_records} conversation(s) </span> :this.props.searchList !== undefined && this.props.searchList.data.length === 0 ? <span className="page-title-text"> No Conversation(s)</span>:
                    
                    this.props.collection !== undefined && this.props.collection.type === 'manual' && this.props.collection.results.length>0? <span className="page-title-text"> Showing {this.props.collection !== undefined && this.props.collection.results.length} conversation(s) </span>:  <span className="page-title-text"> No Conversation(s)</span>
                }
               {
                 this.props.collection !== undefined && this.props.collection.type === 'manual' && !this.state.showStarred && this.props.collection.recommended_list !== undefined &&this.props.collection.recommended_list.length > 0 && <button className="btn btn-secondary" data-toggle="modal" data-target="#searchData">
                     Similar Conversations ({this.props.collection.recommended_list.length}) </button> 
              }
                
              </div>

              <div className="conversation-inner-wrapp mt25">
                {
                  this.props.collection !== undefined && this.props.collection.type === 'manual' ?

                    this.props.collection && !this.state.showStarred && this.props.collection.results.length > 0 ? this.props.collection.results.map((conversation, index) => {
                      let reps = conversation.participants.filter((rep) => rep.speaker_label === 'rep');
                      let prosp = conversation.participants.filter((rep) => rep.speaker_label === 'prospect');
                      let newTime = conversation.date.replace("Z", "");
                      return <Link key={index} to={`${routingConstants.CONVERSATION_DETAIL}/${conversation.record_id}`}>
                        <div className={`start-conversation-row ${conversation.chat_sentiment < -0.5 ? 'color-1' : conversation.chat_sentiment < 0.5 ? 'color-2' : 'color-3'}`}>
                          {conversation.opportunity.value === 1 ? <span className="search-opportunity"> opportunity </span> : ''}
                          <div className="row">
                            <div className="conver-profile col-lg-4 col-md-4">
                              <div className="active-user-img as-img mr25">
                                <span className="initials-logo">
                                {
                                  this.getInitials(reps[0].first_name)
                                }
                                </span>
                              </div>
                              <div className="media-name-box">
                                <h4 className="media-text">{reps.map((rep) => rep.first_name + " " + rep.last_name).join(', ')} </h4>
                                <div className="subText">
                                  <i className={conversation.channel_id === "web_chat" ? 'icon-chat' : conversation.channel_id === 'telephony' ? 'icon-audio' : 'icon-video'}></i> <span className="side-text">{conversation.channel_name}</span>
                                </div>
                              </div>
                            </div>
                            {
                             <div className="conver-detail col-lg-3 ">
                             <h4 className="media-text">{prosp.map((prosp) => prosp.first_name + " " + prosp.last_name).join(', ')} </h4>
                             <small className="small-text">{prosp.map((prosp) => prosp.organization).join(', ')}</small>
                           </div>
                            }
                            <div className="conver-call-detail col-lg-3 ">
                            <h5 className="call-time">{timezoneDatePrint(conversation.duration, this.props.user.timezone, 'h [hrs] m [mins] s [secs]', 'duration')}</h5>
                            <small className="small-text">{timezoneDatePrint(conversation.date, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')} </small>
                              {/* <h5 className="call-time">{moment.duration(conversation.duration, "seconds").format("h [hrs] m [mins] s [secs]")}</h5>
                              <small className="small-text">{moment(newTime).format('Do MMMM YYYY, hh:mm A')} </small> */}
                            </div>
                            <div className="col-lg-2">
                              <ul className="icons-group" onClick={this.handleActivity}>
                                <li className="showTooltip">
                                  <i id={"star " + conversation.record_id} className={`${conversation.starred || (this.props.starredList && this.props.starredList.map(data => data.record_id).includes(conversation.record_id)) ? 'icon-starred starActive' : 'icon-starred'}`} > </i>
                                  <div className="tooltipText">
                                    <span>{(this.props.starredList && this.props.starredList.map(data => data.record_id).includes(conversation.record_id)) ? 'Remove from starred collection' : 'Add to starred collection'}</span>
                                  </div>

                                </li>
                                <li>
                                  <i id={"book " + conversation.record_id} className="icon-bookmark" data-toggle="modal" data-target="#bookMarkConversation"> </i>
                                </li>

                                {/*          <li>
                                <i className="icon-share" onClick={this.onClick}> </i>
                    </li>*/}
                                {this.props.type !== 'rule_based' ? <li>
                                  <i id={"remove " + conversation.record_id} className="icon-delete" data-toggle="modal" data-target="#removeConversation" > </i>
                                </li> : ''}
                              </ul>
                            </div>

                          </div>
                        </div>
                      </Link>
                    }) : !this.state.showStarred ?
                        <div className="emptyBox collectioEmpty">
                          <div className="msgImage">
                            <img src="/static/images/manual-collection-empty.svg" /> </div></div> : ''


                    : this.props.collection !== undefined && this.props.collection.type === 'rule_based' && this.props.searchList !== undefined && this.props.searchList.data.length > 0 ? this.props.searchList.data.map((conversation, index) => {
                      let reps = conversation.participants.filter((rep) => rep.speaker_label === 'rep');
                      let prosp = conversation.participants.filter((rep) => rep.speaker_label === 'prospect');
                      let newTime = conversation.date.replace("Z", "");
                      return <Link key={index} to={`${routingConstants.CONVERSATION_DETAIL}/${conversation.record_id}`}>
                        <div className={`start-conversation-row ${conversation.chat_sentiment < -0.5 ? 'color-1' : conversation.chat_sentiment < 0.5 ? 'color-2' : 'color-3'}`}>
                          {conversation.opportunity.value === 1 ? <span className="search-opportunity"> opportunity </span> : ''}
                          <div className="row">
                            <div className="conver-profile col-lg-4 col-md-4">
                              <div className="active-user-img as-img mr25">
                                <span className="initials-logo">
                                {
                                  this.getInitials(reps[0].first_name)
                                }
                                </span>
                              </div>
                              <div className="media-name-box">
                                <h4 className="media-text">{reps.map((rep) => rep.first_name + " " + rep.last_name).join(', ')} </h4>
                                <div className="subText">
                                  <i className={conversation.channel_id === "web_chat" ? 'icon-chat' : conversation.channel_id === 'telephony' ? 'icon-audio' : 'icon-video'}></i> <span className="side-text">{conversation.channel_name}</span>
                                </div>
                              </div>
                            </div>
                            {
                              <div className="conver-detail col-lg-3 ">
                              <h4 className="media-text">{prosp.map((prosp) => prosp.first_name + " " + prosp.last_name).join(', ')} </h4>
                              <small className="small-text">{prosp.map((prosp) => prosp.organization).join(', ')}</small>
                            </div>
                            }
                            <div className="conver-call-detail col-lg-3 ">
                            <h5 className="call-time">{timezoneDatePrint(conversation.duration, this.props.user.timezone, 'h [hrs] m [mins] s [secs]', 'duration')}</h5>
                            <small className="small-text">{timezoneDatePrint(conversation.date, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')} </small>
                              {/* <h5 className="call-time">{moment.duration(conversation.duration, "seconds").format("h [hrs] m [mins] s [secs]")}</h5>
                              <small className="small-text">{moment(newTime).format('Do MMMM YYYY, hh:mm A')} </small> */}
                            </div>
                            <div className="col-lg-2">
                              <ul className="icons-group" onClick={this.handleActivity}>
                                <li className="showTooltip">
                                  <i id={"star " + conversation.record_id} className={`${conversation.starred || (this.props.starredList && this.props.starredList.map(data => data.record_id).includes(conversation.record_id)) ? 'icon-starred starActive' : 'icon-starred'}`} > </i>
                                  <div className="tooltipText">
                                    <span>{(this.props.starredList && this.props.starredList.map(data => data.record_id).includes(conversation.record_id)) ? 'Remove from starred collection' : 'Add to starred collection'}</span>
                                  </div>

                                </li>
                                <li>
                                  <i id={"book " + conversation.record_id} className="icon-bookmark" data-toggle="modal" data-target="#bookMarkConversation"> </i>
                                </li>

                                {/*          <li>
                              <i className="icon-share" onClick={this.onClick}> </i>
                  </li>*/}
                                {this.props.type !== 'rule_based' ? <li>
                                  <i id={"remove " + conversation.record_id} className="icon-delete" data-toggle="modal" data-target="#removeConversation" > </i>
                                </li> : ''}
                              </ul>
                            </div>

                          </div>
                        </div>
                      </Link>
                    }) : !this.state.showStarred ?
                        <div className="emptyBox collectioEmpty">
                          <div className="msgImage">
                            <img src="/static/images/manual-collection-empty.svg" /> </div></div> : ''


                }

                {
                  (this.props.starredList && this.state.showStarred && this.props.starredList.length > 0) ? this.props.starredList.map((conversation, index) => {
                    let reps = conversation.participants.filter((rep) => rep.speaker_label === 'rep');
                    let prosp = conversation.participants.filter((rep) => rep.speaker_label === 'prospect');
                    let newTime = conversation.date.replace("Z", "");
                    return <Link key={index} to={`${routingConstants.CONVERSATION_DETAIL}/${conversation.record_id}`}>
                      <div className={`start-conversation-row ${conversation.chat_sentiment < -0.5 ? 'color-1' : conversation.chat_sentiment < 0.5 ? 'color-2' : 'color-3'}`}>
                        {conversation.opportunity.value === 1 ? <span className="search-opportunity"> opportunity </span> : ''}
                        <div className="row">
                          <div className="conver-profile col-lg-4 col-md-4">
                            <div className="active-user-img as-img mr25">
                              <span className="initials-logo">
                              {
                                  this.getInitials(reps[0].first_name)
                                }
                              </span>
                            </div>
                            <div className="media-name-box">
                              <h4 className="media-text">{reps.map((rep) => rep.first_name + " " + rep.last_name).join(', ')} </h4>
                              <div className="subText">
                                <i className={conversation.channel_id === "web_chat" ? 'icon-chat' : conversation.channel_id === 'telephony' ? 'icon-audio' : 'icon-video'}></i> <span className="side-text">{conversation.channel_name}</span>
                              </div>
                            </div>
                          </div>
                          {
                             <div className="conver-detail col-lg-3 ">
                             <h4 className="media-text">{prosp.map((prosp) => prosp.first_name + " " + prosp.last_name).join(', ')} </h4>
                             <small className="small-text">{prosp.map((prosp) => prosp.organization).join(', ')}</small>
                           </div>
                          }
                          <div className="conver-call-detail col-lg-3 ">
                          <h5 className="call-time">{timezoneDatePrint(conversation.duration, this.props.user.timezone, 'h [hrs] m [mins] s [secs]', 'duration')}</h5>
                            <small className="small-text">{timezoneDatePrint(conversation.date, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')} </small>
                            {/* <h5 className="call-time">{moment.duration(conversation.duration, "seconds").format("h [hrs] m [mins] s [secs]")}</h5>
                            <small className="small-text">{moment(newTime).format('Do MMMM YYYY, hh:mm A')} </small> */}
                          </div>
                          <div className="col-lg-2">
                            <ul className="icons-group" onClick={this.handleActivity}>
                              <li className="showTooltip">
                                <i id={"star " + conversation.record_id} className={`${conversation.starred || (this.props.starredList && this.props.starredList.map(data => data.record_id).includes(conversation.record_id)) ? 'icon-starred starActive' : 'icon-starred'}`} > </i>
                                <div className="tooltipText">
                                  <span>{(this.props.starredList && this.props.starredList.map(data => data.record_id).includes(conversation.record_id)) ? 'Remove from starred collection' : 'Add to starred collection'}</span>
                                </div>

                              </li>
                              <li>
                                <i id={"book " + conversation.record_id} className="icon-bookmark" data-toggle="modal" data-target="#bookMarkConversation"> </i>
                              </li>
                              {/* <li>
                            <i className="icon-share" onClick={this.onClick}> </i>
                                </li>*/}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Link>
                  }) : (this.props.starredList && this.state.showStarred && this.props.starredList.length === 0) ?
                      <div className="emptyBox collectioEmpty">
                        <div className="msgImage">
                          <img src="/static/images/collection-starred-empty.svg" /> </div></div> : ''
                }
              </div>
              {(this.props.collection !== undefined && this.props.collection.type === 'rule_based' && this.props.searchList !== undefined && this.props.searchList.pagination.total_records > 10) ? <div className="show-conversation-row mt30">
                <div className="dropdown show">
                  <button className="btn custom-dropdown dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.itemsCountPerPage} Conversations</button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink" onClick={this.filter}>
                    <button className="dropdown-item" value={10}>10 Conversations</button>
                    <button className="dropdown-item" value={20}>20 Conversations</button>
                    <button className="dropdown-item" value={30}>30 Conversations</button>
                    <button className="dropdown-item" value={50}>50 Conversations</button>
                  </div>
                </div>
                <div className="pagination">
                  <Pagination
                    defaultPageSize={10}
                    pageSize={this.state.pagination.itemsCountPerPage}
                    defaultCurrent={this.state.pagination.activePage + 1}
                    current={this.props.searchList && this.props.searchList.pagination.activePage + 1}
                    showTitle={false}
                    onChange={this.paginationNumberChange}
                    total={this.props.searchList && this.props.searchList.pagination.total_records}
                    itemRender={this.itemRender}
                  />
                </div>
              </div> : ''}
            </div>
          </div>
        </div>}
      
        {this.state.showComment && <Comments id={this.state.collectionId} close={this.closeCommentBar} comments={this.props.collection && this.props.collection.comments} pagination={this.props.pagination && this.props.pagination} />}
        <NewCollection closeModal={this.closeModal} />
        {this.props.collection !== undefined && this.props.collection.type === 'manual' && <RecommendationModal id={this.props.collection !== undefined && this.props.collection.type === 'manual' && this.props.collection.id} data={this.props.collection !== undefined && this.props.collection.type === 'manual' && !this.state.showStarred && this.props.collection.recommended_list !==undefined && this.props.collection.results.length > 0 && this.props.collection.recommended_list} star={this.props.starredList && this.props.starredList}/>}
        <DeleteCollection name={this.state.pageTitle} delete={this.onDeleteCollection} />
        <BookMarkConversation convId={this.state.conversationId && this.state.conversationId} collectionList={this.props.collectionList && this.props.collectionList} source={true} collectionName={this.state.pageTitle} />
        <RemoveConversation name={this.state.pageTitle} remove={this.onRemoveConversation} />
        <EditCollection name={this.state.pageTitle} rename={this.renameCollection} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    allCollectionList: state.collectionReducer.allCollections && state.collectionReducer.allCollections,
    collection: state.collectionReducer.selectedCollection && state.collectionReducer.selectedCollection,
    collectionName: state.collectionReducer.selectedCollection && state.collectionReducer.selectedCollection.name,
    type: state.collectionReducer.selectedCollection && state.collectionReducer.selectedCollection.type,
    pagination: state.collectionReducer.selectedCollection && state.collectionReducer.selectedCollection.pagination,
    starredList: state.collectionReducer.starredConversation,
    collectionType: state.collectionReducer.selectedCollection && state.collectionReducer.selectedCollection.type,
    collectionList: state.conversationReducer.manualCollection,
    searchList: state.searchReducer.searchList
  }
};

const mapActionToProps = {
  loadAllCollection: collectionAction.loadAllCollection,
  loadCollection: collectionAction.loadSelectedCollection,
  delete: collectionAction.deleteCollection,
  star: conversationAction.starConversation,
  removeConversation: collectionAction.removeConversation,
  updateCollection: collectionAction.editCollection,
  loadStarred: collectionAction.loadStarred,
  readCollection: conversationAction.manualCollectionList,
  UpdateCollectionStatus: collectionAction.UpdateCollectionStatus,
  loadSearchList: searchAction.loadSearchList,
}

export default withRouter(connect(mapStateToProps, mapActionToProps)(Collection));
