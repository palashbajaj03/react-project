import React, { Component, useEffect, useState } from 'react'
import { configureAction } from '../../actions'
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify';

class Topics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addTopicToggle: false,
      name: '',
      value: [],
      id: '',
      boxToggle: false,
      tempTopic: [],
      searchText: '',
      keyword: '',
      newTopics: []
    }
  }

  componentDidMount() {
    const { client_id, emailid } = this.props.user
    this.props.loadTopicList(client_id, emailid)
    window.jQuery(".topicName").on("keypress", function (evt) {
      var keycode = evt.charCode || evt.keyCode;
      if (keycode == 46) {
        return false;
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.readTopics !== this.props.readTopics) {
      let readTopics = this.props.readTopics
      this.props.readTopics.map((data) => {
        this.setState(() => ({
          [data.id]: false
        }))
        this.setState(() => ({
          readTopics
        }))
      })
    }
  }

  handleClickTopic = () => {
    document.getElementsByClassName('add-user-popup')[0].style.display = "block"
    document.getElementsByClassName('topicName')[0].disabled = false
  }

  handleClickTopicAdd = (e) => {
    const { client_id, emailid } = this.props.user
    const { name, value, id } = this.state
    if (e.target.value === 'update-topic' && name && value && id) {
      this.props.updateTopics(client_id, emailid, name, value, id)
    }
    if (e.target.value === 'add-topic' && name && value) {
      this.props.createTopics(client_id, emailid, name, value)
    }
    this.handleClickTopicCancel()
  }

  handleClickTopicCancel = () => {
    this.setState(() => ({
      name: '',
      value: [],
      type: '',
      id: ''
    }), () => {
      window.jQuery('.topicInput').val("")
      window.jQuery('.topicName').val("")
    })
    document.getElementsByClassName('add-user-popup')[0].classList.remove('slideInRight')
    document.getElementsByClassName('add-user-popup')[0].classList.add('slideOutRight')
    setTimeout(() => {
      if (document.getElementsByClassName('add-user-popup')[0]) {
        document.getElementsByClassName('add-user-popup')[0].style.display = "none"
        document.getElementsByClassName('add-user-popup')[0].classList.add('slideInRight')
        document.getElementsByClassName('add-user-popup')[0].classList.remove('slideOutRight')
      }
    }, 1000)
  }

  deleteCurrentElementString = (e) => {
    e.preventDefault()
    let val = e.target.parentElement.id
    let { value } = this.state
    let filterdVal = value && value.filter(dat => dat !== val)
    this.setState(({
      value: filterdVal
    }))
  }

  onChangeKey = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let string = e.target.value.replace(/[&<>"]/g, "");
    if (name === 'topicName') {
      this.setState(() => ({
        name: string
      }))
    }
    if (name === 'keyword') {
      if (e.keyCode === 13 && string.length !== 0 && (/^\S/).test(string)) {
        this.setState((prevState) => ({
          value: prevState.value.concat(string)
        }), () => {
          window.jQuery('.topicInput').val("")
        })
      }
    }
  }

  particularTopicRead = (e) => {
    e.preventDefault()
    document.getElementsByClassName('add-user-popup')[0].style.display = "block"
    let current_id = e.target.id
    let data = this.props.readTopics.filter((topic) => {
      if (topic.id === current_id) {
        return topic
      }
    })
    this.setState(() => ({
      value: data[0].value,
      name: data[0].name,
      id: data[0].id,
      type: data[0].type
    }), () => {
      if (this.state.type === 'pre_defined') {
        document.getElementsByClassName('topicName')[0].disabled = true
      } else {
        document.getElementsByClassName('topicName')[0].disabled = false
      }
      window.scroll(0, 0)
    })
  }

  particularTopicDeleteid = (e) => {
    let current_id = e.currentTarget.id
    this.props.deleteTopic(current_id, e.currentTarget.value, 'TOPICS')
  }

  handleBoxToggle = (e) => {
    let signal = e.target.id
    this.setState((prevState) => {
      return { [signal]: !prevState[signal] };
    }, () => {
      this.props.readTopics.map((data) => {
        signal !== data.id && this.setState(() => ({
          [data.id]: false,
          searchText: ''
        }))
      })
    })
  }

  handleSearchBox = (e) => {
    let keyword = e.target.value
    this.setState(({ searchText: keyword }))
    let i
    let top = this.props.readTopics.filter((data, index) => {
      i = this.state[data.id] && index
      this.state[data.id] && this.setState(({ i }))
      return this.state[data.id] && data
    }).map((dat) => {
      return dat.value
    })
    let topic = []
    top[0].map((data) => {
      data.toLowerCase().includes(keyword.toLowerCase()) && topic.push(data)
    })
    this.setState(({ tempTopic: topic, }))
  }

  handleOutsideClick = e => {
    this.props.readTopics.map((data) => {
      if (this.state[data.id] === true && this.state.searchText === '' && e.target.type !== 'search') {
        this.setState(() => ({ [data.id]: false }))
      }
    })
  }

  handleSearchBoxClick = e => {
    this.props.readTopics.map((data) => {
      if (this.state[data.id] === true && this.state.searchText === '') {
        this.setState(() => ({ [data.id]: true }))
      }
    })
  }

  handleTopicSearch = e => {
    let searchInput = e.target.value
    let TOPIC = []
    this.setState(() => ({
      keyword: searchInput,
    }), _ => {
      this.state.readTopics && this.state.readTopics.map(data => {
        data.name.toLowerCase().includes(searchInput.toLowerCase()) && TOPIC.push(data)
        this.setState(() => ({
          newTopics: TOPIC
        }))
      })
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="topicsTab" id="topicsTab" onClick={this.handleOutsideClick}>
          <div className="page-title-row">
            <div className="page-title-box remove-flex-basis">
              <h2 className="page-title"> Topics </h2>
              <div className="page-breadcum">
                <p><a href="#">Configuration </a> > Topics </p>
              </div>
            </div>
            <div className="set-flex align-center">
              <div className="search-bar">
                <div class="right-search"><input type="search" class="search-input " placeholder="Search Topics" onChange={this.handleTopicSearch} /><i class="icon-search"></i></div>
              </div>
              <button className="btn btn-secondary ml10" onClick={this.handleClickTopic}> <i className="icon-plus"></i> TOPIC </button>
            </div>
          </div>
          <div className="page-body mt40">
            <div className="topicsList" >
              {
                this.state.keyword.length === 0 ?
                  this.state.readTopics && this.state.readTopics.map((data, index) => {
                    return <div className="single-topic-wrap pad20" key={index}>
                      <div className="single-topic-wrap-head">
                        <h2>{`${data.type === 'custom' ? data.name : data.name}`}</h2>
                        <div className="topic-add-btn set-flex align-center set-height-36">
                          <div className="overflow-hidden set-flex align-center">
                            {this.state[data.id] && <input type="search" autoFocus onChange={this.handleSearchBox} className="form-control topic-search ml10" placeholder="Search Topic Keywords" onClick={this.handleSearchBoxClick} />}
                            <i className="icon-search ml10 topic-search-icon" id={data.id} onClick={this.handleBoxToggle}></i>
                          </div>
                          <i className={"icon-edit ml10" + (this.state[data.id] ? '' : '')} id={data.id} onClick={this.particularTopicRead}></i>
                          {
                            data.type === 'custom' && <button
                              style={{
                                "background": "transparent",
                                "border": "none",
                                "cursor": "pointer"
                              }}
                              value={data.name}
                              id={data.id}
                              onClick={this.particularTopicDeleteid}
                            > <i className="icon-delete" data-toggle="modal" data-target="#DeleteTopic" ></i></button>}

                        </div>
                      </div>
                      <hr style={{ "margin": '5px 0 15px 0', "border-color": '#dde2ee' }} />
                      <div className="single-topic-wrap-body mt10">
                        <div className="topic-wrapper">
                          {
                            this.state.i !== undefined && this.state.i !== '' && this.state.searchText !== '' && index === this.state.i ?
                              this.state.tempTopic.map((d, indx) => {
                                return <div className="ovalBox" key={indx}><span>{d}</span></div>
                              })
                              : data.value.map((dat, ind) => {
                                return <div className="ovalBox" key={ind}><span>{dat}</span></div>
                              })
                          }
                        </div>
                      </div>
                    </div>
                  }) :
                  this.state.newTopics.map((data, index) => {
                    return <div className="single-topic-wrap pad20" key={index}>
                      <div className="single-topic-wrap-head">
                        <h2>{`${data.type === 'custom' ? data.name : data.name}`}</h2>
                        <div className="topic-add-btn set-flex align-center set-height-36">
                          <div className="overflow-hidden set-flex align-center">
                            {this.state[data.id] && <input type="search" autoFocus onChange={this.handleSearchBox} className="form-control topic-search ml10" placeholder="Search Topic Keywords" onClick={this.handleSearchBoxClick} />}
                            <i className="icon-search ml10 topic-search-icon" id={data.id} onClick={this.handleBoxToggle}></i>
                          </div>
                          <i className={"icon-edit ml10" + (this.state[data.id] ? '' : '')} id={data.id} onClick={this.particularTopicRead}></i>
                          {
                            data.type === 'custom' && <button
                              style={{
                                "background": "transparent",
                                "border": "none",
                                "cursor": "pointer"
                              }}
                              value={data.name}
                              id={data.id}
                              onClick={this.particularTopicDeleteid}
                            > <i className="icon-delete" data-toggle="modal" data-target="#DeleteTopic" ></i></button>}

                        </div>
                      </div>
                      <hr style={{ "margin": '5px 0 15px 0', "border-color": '#dde2ee' }} />
                      <div className="single-topic-wrap-body mt10">
                        <div className="topic-wrapper">
                          {
                            this.state.i !== undefined && this.state.i !== '' && this.state.searchText !== '' && index === this.state.i ?
                              this.state.tempTopic.map((d, indx) => {
                                return <div className="ovalBox" key={indx}><span>{d}</span></div>
                              })
                              : data.value.map((dat, ind) => {
                                return <div className="ovalBox" key={ind}><span>{dat}</span></div>
                              })
                          }
                        </div>
                      </div>
                    </div>
                  })
              }
            </div>
            <div className="add-user-popup animated slideInRight">
              <div className="popup-wrapper">
                <div className="popup-head">
                  <h2>{this.state.type ? 'Edit Topic' : 'Add New Topic'}</h2>
                  <p>include new topics in the library</p>
                </div>
                <div className="popup-body">
                  <div className="add-user-form mt40">
                    <form>
                      <div className="form-group">
                        <div className="input-wraper">
                          <input name="topicName" className="topicName form-control" value={this.state.name} onChange={this.onChangeKey} placeholder="Topic Name" maxLength="255" />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="input-wraper keywordWrapInputBox">
                          {
                            this.state.value && this.state.value.map((data, index) => {
                              return <div className="ovalBox" key={index}><span className="btn" id={data}>{data}<i className="icon-close" onClick={this.deleteCurrentElementString}></i></span></div>
                            })
                          }
                          <input name="keyword" className="topicInput" onKeyUp={this.onChangeKey} onChange={this.onChangeKey} placeholder="Enter Keywords" />
                        </div>
                      </div>
                    </form>
                    <div className="actionBtns mt20">
                      <button type="button" className="colorBtn btn btn-secondary" value={this.state.type ? 'update-topic' : 'add-topic'} onClick={this.handleClickTopicAdd}>{this.state.type ? 'UPDATE TOPIC' : 'SAVE TOPIC'}</button>
                      <button type="button" className="btn emptyColorBtn" onClick={this.handleClickTopicCancel}>CANCEL</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

// const Topics = (props) => {

//   let [addTopicToggle, setAddTopicToggle] = useState(false);
//   let [name, setName] = useState('');
//   let [value, setValue] = useState([]);
//   let [id, setId] = useState('');
//   let [type,setType] = useState('')

//   useEffect(() => {
//     const { client_id, emailid } = props.user
//     props.loadTopicList(client_id, emailid)
//   }, []);

//   const handleClickTopic = () => {
//     document.getElementsByClassName('add-user-popup')[0].style.display = "block"
//     document.getElementsByClassName('topicName')[0].disabled = false
//   }

//   const handleClickTopicAdd = (e) => {
//     const { client_id, emailid } = props.user

//     if (e.target.value === 'update-topic' && name && value && id) {
//       this.props.updateTopics(client_id, emailid, name, value, id)

//     }
//     if (e.target.value === 'add-topic' && name && value) {
//       this.props.createTopics(client_id, emailid, name, value)

//     }
//     handleClickTopicCancel()
//   }
//   const handleClickTopicCancel = () => {

//     this.setState(() => ({
//       name: '',
//       value: [],
//       type: '',
//       id: ''
//     }), () => {
//       window.jQuery('.topicInput').val("")
//       window.jQuery('.topicName').val("")
//     })
//     document.getElementsByClassName('add-user-popup')[0].classList.remove('slideInRight')
//     document.getElementsByClassName('add-user-popup')[0].classList.add('slideOutRight')

//     setTimeout(() => {
//       document.getElementsByClassName('add-user-popup')[0].style.display = "none"
//       document.getElementsByClassName('add-user-popup')[0].classList.add('slideInRight')
//       document.getElementsByClassName('add-user-popup')[0].classList.remove('slideOutRight')
//     }, 1000)

//   }

//   const deleteCurrentElementString = (e) => {
//     e.preventDefault()
//     let val = e.target.parentElement.id
//     let { value } = this.state
//     let filterdVal = value && value.filter(dat => dat !== val)
//     this.setState(({
//       value: filterdVal
//     }))
//   }

//   const onChangeKey = (e) => {
//     e.preventDefault();
//     let name = e.target.name;
//     let string = e.target.value;
//     if (name === 'topicName') {
//       setName(string);
//     }
//     if (name === 'keyword') {
//       if (e.keyCode === 13 && string.length !== 0 && (/^\S/).test(string)) {
//         setValue(value.concat(string))
//         window.jQuery('.topicInput').val("")
//       }
//     }
//   }

//   const particularTopicRead = (e) => {
//     e.preventDefault()
//     document.getElementsByClassName('add-user-popup')[0].style.display = "block"
//     let current_id = e.target.id
//     let data = this.props.readTopics.filter((topic) => {
//       if (topic.id === current_id) {
//         return topic
//       }
//     })
//     this.setState(() => ({
//       value: data[0].value,
//       name: data[0].name,
//       id: data[0].id,
//       type: data[0].type
//     }), () => {
//       if (this.state.type === 'pre_defined') {
//         document.getElementsByClassName('topicName')[0].disabled = true
//       } else {
//         document.getElementsByClassName('topicName')[0].disabled = false
//       }
//       window.scroll(0, 0)
//     })

//   }

//   const particularTopicDeleteid = (e) => {
//     let current_id = e.currentTarget.id
//     this.props.deleteTopic(current_id, e.currentTarget.value)

//   }

//   return (
//     <React.Fragment>

//       <div className="topicsTab" id="topicsTab">

//         <div className="page-title-row">
//           <div className="page-title-box">
//             <h2 className="page-title"> Topics </h2>
//             <div className="page-breadcum">
//               <p><a href="#">Configuration </a> > Topics </p>
//             </div>
//           </div>
//           <button className="btn btn-secondary" onClick={handleClickTopic}> <i className="icon-plus"></i> TOPIC </button>
//         </div>

//         <div className="page-body mt40">
//           <div className="topicsList">
//             {
//               props.readTopics && props.readTopics.map((data, index) => {

//                 return <div className="single-topic-wrap" key={index}>
//                   <div className="single-topic-wrap-head">
//                     <h2>{data.name}</h2>
//                     <div className="topic-add-btn">
//                       <i className="icon-edit" id={data.id} onClick={particularTopicRead}></i>
//                       {data.type === 'custom' && <button
//                         style={{
//                           "background": "transparent",
//                           "border": "none",
//                           "cursor": "pointer"
//                         }}
//                         value={data.name}
//                         id={data.id}
//                         onClick={particularTopicDeleteid}
//                       > <i className="icon-delete" data-toggle="modal" data-target="#DeleteTopic" ></i></button>}
//                     </div>
//                   </div>
//                   <div className="single-topic-wrap-body mt10">
//                     <div className="topic-wrapper">
//                       {
//                         data.value.map((dat, ind) => {
//                           return <div className="ovalBox" key={ind}><span>{dat}<i className="icon-close" ></i></span></div>
//                         })
//                       }

//                     </div>
//                   </div>
//                 </div>
//               })
//             }


//           </div>

//           <div className="add-user-popup animated slideInRight">
//             <div className="popup-wrapper">
//               <div className="popup-head">
//                 <h2>{type ? 'Edit Topic' : 'Add New Topic'}</h2>
//                 <p>include new topics in the library</p>
//               </div>
//               <div className="popup-body">
//                 <div className="add-user-form mt40">
//                   <form>
//                     <div className="form-group">
//                       <div className="input-wraper">
//                         <input name="topicName" className="topicName form-control" value={name} onChange={onChangeKey} placeholder="Topic Name" maxLength="255" />

//                       </div>
//                     </div>

//                     <div className="form-group">
//                       <div className="input-wraper keywordWrapInputBox">

//                         {value && value.map((data, index) => {
//                           return <div className="ovalBox" key={index}><span className="btn" id={data}>{data}<i className="icon-close" onClick={deleteCurrentElementString}></i></span></div>
//                         })
//                         }
//                         <input name="keyword" className="topicInput" onKeyUp={onChangeKey} onChange={onChangeKey} placeholder="Enter Keywords" />

//                       </div>
//                     </div>
//                   </form>
//                   <div className="actionBtns mt20">
//                     <button type="button" className="colorBtn btn btn-secondary" value={type ? 'update-topic' : 'add-topic'} onClick={handleClickTopicAdd}>{type ? 'UPDATE TOPIC' : 'SAVE TOPIC'}</button>
//                     <button type="button" className="btn emptyColorBtn" onClick={handleClickTopicCancel}>CANCEL</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//       <ToastContainer
//         position="top-right"
//         autoClose={2000}
//         hideProgressBar
//         newestOnTop={false}
//         closeOnClick={false}
//         rtl={false}
//         pauseOnVisibilityChange
//         draggable
//         pauseOnHover={false}
//       />
//     </React.Fragment>
//   )
// }

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    readTopics: state.configureReducer.readTopics
  }
}

const mapActionToProps = {
  loadTopicList: configureAction.loadTopicList,
  createTopics: configureAction.createTopics,
  updateTopics: configureAction.updateTopics,
}

export default connect(mapStateToProps, mapActionToProps)(Topics)