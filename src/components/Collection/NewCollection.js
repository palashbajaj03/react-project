import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import cookie from 'react-cookies';
import DatePicker from 'react-date-picker';
import { sentimentPoints } from '../../constants'
import { ApiConst } from '../../constants';
import { collectionAction, searchAction } from '../../actions'
import Scrollbar from 'react-scrollbars-custom'
import 'react-toastify/dist/ReactToastify.css';
import AllFilters from '../Search/AllFilters';

class NewCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spl1: '',
      cspl1: '',
      date: new Date(),
      singletoggle: false,
      keep_updating: false,
      isOpen: false,
      repId: [],
      repIds: [],
      channelName: '',
      currentselectedoption: '',
      closeModal: false,
      inputsearch: true,
      calendarToggle: false,
      searchConditionToggle: true,
      collection: {
        name: "",
        description: "",
        type: "manual",
        end_date: '',
        filter: {}
      },
      resetToggle: true,
      end_date: '',
      singletoggle: false,
      collectionName: "",
      keep_updating: false,
      temp_opportunity: [],
      radioMobileM: '',
      radioDuration: '',
      engagement: false,
      signals: false,
      topic: false,
      condition: 'OR',
      keywords: [],
      search_strings: [],
      filter: {
      },
      pagination: {
        itemsCountPerPage: 10,
        activePage: 0
      },
      reomvePills: '',
      topics: [],
    }
  }

  singleClickDate = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      singletoggle: !prevState.singletoggle
    }))
  }

  onChangeSingleDate = (date) => {
    let date_to = moment(date).format("YYYY-MM-DDThh:mm:ss[Z]")
    this.setState((prevState) => ({
      single_end_date: date_to,
      collection: {
        ...prevState.collection,
        end_date: date_to,
      },
    }))
  }

  calenderSingleRangeApply = () => {
    let date = this.state.single_end_date
    this.setState((prevState) => ({
      collection: {
        ...prevState.collection,
        end_date: date,
      },
      singletoggle: false,
      singleDateValue: moment(date).format("Do MMMM, YYYY")
    }))
    var datePicker = document.getElementsByClassName('react-date-picker__calendar--open')[0];
    datePicker.classList.remove('react-date-picker__calendar--open')
    datePicker.classList.add('react-date-picker__calendar--closed')
  }

  calenderSingleRangeCancel = () => {
    this.setState((prevState) => ({
      collection: {
        ...prevState.collection,
        end_date: moment().add(30, 'days').format("YYYY-MM-DD") + "T00:00:00Z",
      },
      singletoggle: false,
      singleDateValue: ''
    }))
    var datePicker = document.getElementsByClassName('react-date-picker__calendar--open')[0];
    datePicker.classList.remove('react-date-picker__calendar--open')
    datePicker.classList.add('react-date-picker__calendar--closed')
  }

  componentDidMount() {
    window.jQuery('#createCollection').on('show.bs.modal', this.onCancel)
  }

  onChange = (e) => {
    let name = e.target.value.replace(/[&<>"]/g, "");
    const nameReg = /^[\s\S]{0,255}$/g
    if (nameReg.test(name) && name !== ' ' && name.length <= 255) {
      this.setState((prevState) => ({
        collection: {
          ...prevState.collection,
          name: name
        }
      }))
    }
  }

  checkChannel = () => {
    if (this.state.filter.channels.length >= 1) {
      return true
    }
    else {
      this.setState(prevState => ({
        search_input: {
          ...prevState.filter,
          channel: this.props.searchFilter && this.props.searchFilter.channels
        }
      }))
      return true;
    }
  }

  checkCollectionName = async (client_id, emailid) => {
    const status = await axios({
      method: 'POST',
      url: ApiConst.BASE_URL + ApiConst.COLLECTION_EXIST,
      data: {
        client_id,
        emailid,
        name: this.state.collection.name
      },
      headers: {
        "token": cookie.load('user_token'),
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.data.status === 'success') {
        return res.data.data.exists
      }
    })
    return status
  }

  saveData = async () => {
    const { client_id, emailid, firstname, lastname, rep_id } = this.props.user;
    if (this.state.collection.type === 'rule_based') {
      if ((this.state.collection.name !== ' ') && (this.state.collection.name)) {
        document.getElementById("create-button").setAttribute("disabled", true)
        const status = await this.checkCollectionName(client_id, emailid);
        const channelExist = await this.checkChannel()
        if (!status && channelExist) {
          this.props.create({
            collection: {
              name: this.state.collection.name,
              description: "",
              type: "rule_based",
              end_date: '',
              created_by: {
                first_name: firstname,
                last_name: lastname,
                emailid,
                rep_id
              },
              // keep_updating: this.state.keep_updating,
              filter: {
                ...this.state.filter
              }
            },
          }, client_id, emailid)
          this.getFilterValues('reset', true, '', '')
        }
      } else if (this.state.collection.name.trim() === '') {
        toast.info('Collection name cannot be blank!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
        });
      } else {
        toast.info(' Collection with this name already exists', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
        });
      }
    } else {
      if ((this.state.collection.name !== ' ') && (this.state.collection.name)) {
        const status = await this.checkCollectionName(client_id, emailid);
        if (!status) {
          this.setState(({ closeModal: true }), () => {
            this.props.create({
              collection: {
                name: this.state.collection.name,
                description: "",
                type: "manual",
                end_date: '',
                created_by: {
                  first_name: firstname,
                  last_name: lastname,
                  emailid,
                  rep_id
                },
                // keep_updating: this.state.keep_updating,
                filter: {}
              },
            }, client_id, emailid)
          })
          this.getFilterValues('reset', true, '', '')
        } else {
          toast.info('Collection with this name already exists', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
          });
        }
      }
    }

  }

  getFilterValues = (widget, data, RequestObject, pillValue) => {
    //  console.log(widget, data, RequestObject, pillValue)
    switch (widget) {
      case 'Load_CHANNEL':
        this.setState((prevState) => ({
          filter: {
            ...prevState.filter,
            channels: data
          },
          channel_temp: data
        }))
        break;
      case 'CHANNEL':
        let chanel = data[0].string !== 'Channel: All Channels' ? [{ id: data[0].value, label: data[0].value, deterministic: data[0].deterministic }] : data[0].value
        this.setState((prevState) => ({
          temp_search_channel: data,
          filter: {
            ...prevState.filter,
            channels: chanel
          },
          pagination: {
            ...prevState.pagination,
            itemsCountPerPage: 10,
            activePage: 0
          },
          reomvePills: pillValue
        }), () => {
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'DATE':
        if (data !== undefined && data.length > 0) {
          this.setState((prevState) => {
            data[0].from === '' && data[0].to === '' && delete prevState.filter.date
            return {
              temp_finaldate_range: data,
              filter: (data[0].from === '' && data[0].to === '') ?
                {
                  ...prevState.filter,
                }
                : {
                  ...prevState.filter,
                  date: {
                    from: data[0].from,
                    to: data[0].to
                  }
                },
              pagination: {
                ...prevState.pagination,
                itemsCountPerPage: 10,
                activePage: 0
              },
              reomvePills: pillValue
            }
          }, () => {
            //   const { client_id, emailid } = this.props.user
            //   const { filter, pagination } = this.state;
            //   this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
        }
        break;
      case 'CUSTOM_DATE':
        if (data.length > 0) {
          this.setState((prevState) => ({
            temp_finaldate_range: data,
            filter: {
              ...prevState.filter,
              date: {
                from: data[0].from,
                to: data[0].to
              }
            },
            pagination: {
              ...prevState.pagination,
              itemsCountPerPage: 10,
              activePage: 0
            },
            reomvePills: pillValue
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
        }
        break;
      case 'SPEAKERS':
        this.setState((prevState) => {
          data.length === 0 && delete prevState.filter.speakers
          return {
            temp_searchspeaker: data,
            filter: data.length > 0 ? {
              ...prevState.filter,
              speakers: RequestObject
            } : {
                ...prevState.filter,
              },
            pagination: {
              ...prevState.pagination,
              itemsCountPerPage: 10,
              activePage: 0
            },
            reomvePills: pillValue
          }
        }, () => {
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'REPID':
        this.setState((prevState) => {
          return {
            repId: data,
            filter: {
              ...prevState.filter,
              reps: prevState.repIds.concat(data.map(data => data.repID))

            },
            pagination: {
              ...prevState.pagination,
              itemsCountPerPage: 10,
              activePage: 0
            },
            reomvePills: pillValue
          }
        }, () => {
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'TOPICS':
        this.setState((prevState) => {
          data.length === 0 && prevState.filter !== undefined && prevState.filter.topics !== undefined && delete prevState.filter.topics
          return {
            topics: data,
            filter: (data.length === 0 && prevState.filter !== undefined) ? {
              ...prevState.filter,
            }
              : (prevState.filter !== undefined) ? {
                ...prevState.filter,
                topics: data
              }
                : {
                  ...prevState.filter,
                },
            reomvePills: pillValue
          }
        }, _ => {
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'DEAD_AIR':
        this.setState((prevState) => {
          RequestObject.length === 0 && prevState.filter !== undefined && prevState.filter.interactivity !== undefined && delete prevState.filter.interactivity.dead_air
          return {
            temp_deadAir: data,
            filter: (RequestObject.length === 0 && prevState.filter !== undefined && prevState.filter.interactivity !== undefined) ?
              {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity
                }
              }
              : (prevState.filter !== undefined && prevState.filter.interactivity !== undefined) ? {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity,
                  dead_air: RequestObject,
                }
              } : prevState.filter !== undefined ?
                  {
                    ...prevState.filter,
                    interactivity: {
                      ...prevState.filter.interactivity,
                      dead_air: RequestObject,
                    }
                  }
                  : {
                    ...prevState.filter,
                    interactivity: {
                      dead_air: RequestObject,
                    }
                  },
            reomvePills: pillValue
          }
        }, _ => {
          Object.keys(this.state.filter.interactivity).length === 0 && delete this.state.filter.interactivity
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'INTERACTIVITY':
        this.setState((prevState) => {
          RequestObject.length === 0 && delete prevState.filter.interactivity.interaction_switches
          let rq = RequestObject.length > 0 && RequestObject.map((data) => { return data.substring(0, data.length - 1) })
          return {
            temp_deadairRange: data,
            filter: RequestObject.length === 0 ?
              {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity
                }
              }
              : (prevState.filter !== undefined && prevState.filter.interactivity !== undefined) ? {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity,
                  interaction_switches: rq,
                }

              } : prevState.filter !== undefined ?
                  {
                    ...prevState.filter,
                    interactivity: {
                      interaction_switches: rq,
                    }
                  } : {
                    ...prevState.filter,
                    interactivity: {
                      interaction_switches: rq,
                    }
                  },
            reomvePills: pillValue
          }
        }, _ => {
          Object.keys(this.state.filter.interactivity).length === 0 && delete this.state.filter.interactivity
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'NOQ':
        this.setState((prevState) => {
          RequestObject.length === 0 && delete prevState.filter.interactivity.no_of_questions
          return {
            temp_no_of_questions_userLog: data,
            filter: (RequestObject.length === 0) ?
              {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity,
                }
              }
              : prevState.filter !== undefined ? {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity,
                  no_of_questions: RequestObject
                }
              } : {
                  ...prevState.filter,
                  interactivity: {
                    no_of_questions: RequestObject
                  }
                },
            reomvePills: pillValue
          }
        }, _ => {
          Object.keys(this.state.filter.interactivity).length === 0 && delete this.state.filter.interactivity
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'DURATION':
        this.setState((prevState) => {
          RequestObject.length === 0 && delete prevState.filter.interactivity.duration
          return {
            temp_durationLog: data,
            filter: RequestObject.length === 0 ?
              {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity,
                }
              }
              : prevState.filter !== undefined ? {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity,
                  duration: RequestObject,
                }
              } : {
                  ...prevState.filter,
                  interactivity: {
                    duration: RequestObject,
                  }
                },
            reomvePills: pillValue
          }
        }, _ => {
          Object.keys(this.state.filter.interactivity).length === 0 && delete this.state.filter.interactivity
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'MONOLOGUE':
        this.setState((prevState) => {
          RequestObject.length === 0 && delete prevState.filter.interactivity.monologue
          return {
            temp_monologue_conv: data,
            filter: RequestObject.length === 0 ?
              {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity,
                }
              }
              : prevState.filter !== undefined ? {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity,
                  monologue: RequestObject,
                }
              } : {
                  ...prevState.filter,
                  interactivity: {
                    monologue: RequestObject,
                  }
                },
            reomvePills: pillValue
          }
        }, _ => {
          Object.keys(this.state.filter.interactivity).length === 0 && delete this.state.filter.interactivity
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'SENTIMENT':
        this.setState((prevState) => {
          RequestObject.length === 0 && delete prevState.filter.interactivity.sentiment
          return {
            temp_sentiment_polarityLog: data,
            filter: RequestObject.length === 0 ?
              {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity
                }
              }
              : prevState.filter !== undefined ? {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity,
                  sentiment: RequestObject,
                }
              } : {
                  ...prevState.filter,
                  interactivity: {
                    sentiment: RequestObject,
                  }
                },
            reomvePills: pillValue
          }
        }, _ => {
          Object.keys(this.state.filter.interactivity).length === 0 && delete this.state.filter.interactivity
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'MOBILE_MENTION':
        this.setState((prevState) => {
          data[0].mobilemention === "" && prevState.filter !== undefined && prevState.filter.interactivity !== undefined && delete prevState.filter.interactivity.mobile_mention
          return {
            temp_mobilemention: data,
            filter: (data[0].mobilemention === "" && prevState.filter !== undefined) ?
              {
                ...prevState.filter,
                interactivity: {
                  ...prevState.filter.interactivity,
                }
              }
              : data[0].mobilemention === "" ?
                {
                  ...prevState.filter,
                  interactivity: {
                  }
                }
                : prevState.filter !== undefined ? {
                  ...prevState.filter,
                  interactivity: {
                    ...prevState.filter.interactivity,
                    mobile_mention: data[0].mobilemention,
                  }
                } : {
                    ...prevState.filter,
                    interactivity: {
                      mobile_mention: data[0].mobilemention,
                    }
                  },
            reomvePills: pillValue
          }
        }, _ => {
          Object.keys(this.state.filter.interactivity).length === 0 && delete this.state.filter.interactivity
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'EMAIL_MENTION':
        this.setState((prevState) => {
          data[0].emailmention === "" && prevState.filter !== undefined && prevState.filter.interactivity !== undefined && delete prevState.filter.interactivity.email_mention
          return {
            temp_emailmention: data,
            filter: (data[0].emailmention === '' && prevState.filter !== undefined) ? {
              ...prevState.filter,
              interactivity: {
                ...prevState.filter.interactivity,
              }
            } : data[0].emailmention === '' ?
                {
                  ...prevState.filter,
                  interactivity: {
                  }
                }
                : prevState.filter !== undefined ?
                  {
                    ...prevState.filter,
                    interactivity: {
                      ...prevState.filter.interactivity,
                      email_mention: data[0].emailmention,
                    }
                  }
                  : {
                    ...prevState.filter,
                    interactivity: {
                      email_mention: data[0].emailmention,
                    }
                  },
            reomvePills: pillValue
          }
        }, _ => {
          Object.keys(this.state.filter.interactivity).length === 0 && delete this.state.filter.interactivity
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'OPPORTUNITY':
        this.setState((prevState) => {
          data[0].oppVal === "any" && prevState.filter !== undefined && prevState.filter.signals !== undefined && delete prevState.filter.signals.opportunity

          data[0].oppVal === 'No' && prevState.filter !== undefined && prevState.filter.signals !== undefined && prevState.filter.signals.opportunity !== undefined && delete prevState.filter.signals.opportunity.stage
          return {
            temp_opportunity: data,
            filter: (data[0].opportunity === "" && prevState.filter !== undefined && prevState.filter.signals !== undefined) ? {
              ...prevState.filter,
              signals: {
                ...prevState.filter.signals,
              }
            } : (prevState.filter !== undefined && prevState.filter.signals !== undefined) ?
                {
                  ...prevState.filter,
                  signals: {
                    ...prevState.filter.signals,
                    opportunity: {
                      ...prevState.filter.signals.opportunity,
                      value: data[0].opportunity,
                    }
                  }
                } :
                data[0].opportunity === "" ?
                  {
                    ...prevState.filter,
                    signals: {
                    }
                  }
                  : (prevState.filter !== undefined) ? {
                    ...prevState.filter,
                    ...prevState.filter,
                    signals: {
                      ...prevState.filter.signals,
                      opportunity: {
                        value: data[0].opportunity,
                      }
                    }
                  } : {
                      ...prevState.filter,
                      signals: {
                        opportunity: {
                          value: data[0].opportunity,
                        }
                      }
                    },
            reomvePills: pillValue
          }
        }, _ => {
          Object.keys(this.state.filter.signals).length === 0 && delete this.state.filter.signals
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'BJO':
        this.setState((prevState) => {
          return {
            temp_journey: data,
            filter: (prevState.filter !== undefined && prevState.filter.signals !== undefined && prevState.filter.signals.opportunity !== undefined) ? {
              ...prevState.filter,
              signals: {
                ...prevState.filter.signals,
                opportunity: {
                  ...prevState.filter.signals.opportunity,
                  stage: RequestObject
                }
              }
            } : (prevState.filter !== undefined && prevState.filter.signals !== undefined) ?
                {
                  ...prevState.filter,
                  signals: {
                    ...prevState.filter.signals,
                    opportunity: {
                      ...prevState.filter.signals.opportunity,
                      stage: RequestObject
                    }
                  }
                } :
                data[0] ?
                  {
                    ...prevState.filter,
                    signals: {
                      ...prevState.filter.signals,
                      opportunity: {
                        ...prevState.filter.signals.opportunity,
                        stage: RequestObject
                      }
                    }
                  }
                  : (prevState.filter !== undefined) ? {
                    ...prevState.filter,
                    signals: {
                      ...prevState.filter.signals,
                      opportunity: {
                        ...prevState.filter.signals.opportunity,
                        stage: RequestObject
                      }
                    }
                  } : {
                      ...prevState.filter,
                      signals: {
                        ...prevState.filter.signals,
                        opportunity: {
                          ...prevState.filter.signals.opportunity,
                          stage: RequestObject
                        }
                      }
                    },
            reomvePills: pillValue
          }
        }, _ => {
          Object.keys(this.state.filter.signals).length === 0 && delete this.state.filter.signals
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'BANT':
        this.setState((prevState) => {
          data.length === 0 && prevState.filter.signals !== undefined && delete prevState.filter.signals.bant
          return {
            temp_bant_authority: data,
            filter: (data.length > 0 && prevState.filter !== undefined && prevState.filter.signals !== undefined) ? {
              ...prevState.filter,
              signals: {
                ...prevState.filter.signals,
                bant:
                  RequestObject
              }
            } : (data.length === 0 && prevState.filter.signals !== undefined) ?
                {
                  ...prevState.filter,
                  signals: {
                    ...prevState.filter.signals,
                  }
                }
                : data.length === 0 ?
                  {
                    ...prevState.filter,
                  }
                  : (prevState.filter !== undefined) ? {
                    ...prevState.filter,
                    signals: {
                      ...prevState.filter.signals,
                      bant:
                        RequestObject
                    }
                  } : {
                      ...prevState.filter,
                      signals: {
                        bant:
                          RequestObject
                      }
                    },
            reomvePills: pillValue
          }
        }, _ => {
          this.state.filter.signals !== undefined && Object.keys(this.state.filter.signals).length === 0 && delete this.state.filter.signals
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'NEXT_STEPS':
        this.setState((prevState) => {
          data[0].next_steps === "" && prevState.filter !== undefined && prevState.filter.signals !== undefined && prevState.filter.signals.next_steps !== undefined && delete prevState.filter.signals.next_steps
          return {
            temp_next_step: data,
            filter: (data[0].next_steps === "" && prevState.filter !== undefined && prevState.filter.signals !== undefined) ? {
              ...prevState.filter,
              signals: {
                ...prevState.filter.signals,
              }
            } : (prevState.filter !== undefined && prevState.filter.signals !== undefined) ?
                {
                  ...prevState.filter,
                  signals: {
                    ...prevState.filter.signals,
                    next_steps: data[0].next_steps
                  }
                }
                : data[0].next_steps === "" ? {
                  ...prevState.filter,
                  signals: {
                  }
                }
                  : (prevState.filter !== undefined) ? {
                    ...prevState.filter,
                    signals: {
                      next_steps: data[0].next_steps
                    }
                  } : {
                      ...prevState.filter,
                      signals: {
                        next_steps: data[0].next_steps
                      }
                    },
            reomvePills: pillValue
          }
        }, _ => {
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'FEEDBACK':
        this.setState((prevState) => {
          data[0].feedback === "" && prevState.filter !== undefined && prevState.filter.feedback !== undefined && delete prevState.filter.feedback
          return {
            temp_feedback: data,
            filter: (data[0].feedback === "" && prevState.filter !== undefined) ? {
              ...prevState.filter,
            } : data[0].feedback === "" ?
                {
                  ...prevState.filter,
                  feedback: {
                  }
                }
                : prevState.filter !== undefined ?
                  {
                    ...prevState.filter,
                    feedback: {
                      value: 1,
                      state: [data[0].feedback]
                    }
                  }
                  : {
                    ...prevState.filter,
                    feedback: {
                      value: 1,
                      state: [data[0].feedback]
                    }
                  },
            reomvePills: pillValue
          }
        }, _ => {
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'CONNECT':
        this.setState((prevState) => {
          data.length === 0 && delete prevState.filter.connect
          return {
            temp_contact: data,
            filter: (prevState.filter !== undefined && prevState.filter.connect !== undefined) ? {
              ...prevState.filter,
              connect: RequestObject,
            } : (prevState.filter !== undefined && prevState.filter.connect !== undefined) ?
                {
                  ...prevState.filter,
                  connect: RequestObject,
                }
                : data.length === 0 ? {
                  ...prevState.filter,
                }
                  : (prevState.filter !== undefined) ? {
                    ...prevState.filter,
                    connect: RequestObject,
                  } : {
                      ...prevState.filter,
                      connect: RequestObject,
                    },
            reomvePills: pillValue
          }
        }, _ => {
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'CRM':
        this.setState((prevState) => {
          data[0].CRM === "" && prevState.filter !== undefined && prevState.filter.crm !== undefined && delete prevState.filter.crm
          return {
            temp_crm: data,
            filter: (data[0].CRM === "" && prevState.filter !== undefined) ? {
              ...prevState.filter,
            } : data[0].CRM === "" ?
                {
                  ...prevState.filter,
                  crm: {
                  }
                }
                : prevState.filter !== undefined ?
                  {
                    ...prevState.filter,
                    crm: {
                      ...prevState.filter.crm,
                      existing_customer: data[0].CRM
                    }
                  }
                  : {
                    ...prevState.filter,
                    crm: {
                      existing_customer: data[0].CRM
                    }
                  },
            reomvePills: pillValue
          }
        }, _ => {
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
        break;
      case 'reset':
        this.setState(() => ({
          searchList: undefined,
          lastSelectedSort: 'Date',
          search_strings: [],
          filter: {
            channels: this.state.channel_temp
          },
          pagination: {
            itemsCountPerPage: 10,
            activePage: 0
          },
          //conv
          temp_appointment: [],
          temp_followup: [],
          temp_feedback: [],
          temp_contact: [],
          temp_gatekeeper: [],
          temp_ivr: [],
          temp_crm: [],
          temp_search_channel: [],
          temp_finaldate_range: [],
          temp_searchspeaker: [],
          repId: [], temp_deadAir: [],
          temp_deadairRange: [],
          temp_no_of_questions_userLog: [],
          temp_durationLog: [],
          temp_monologue_conv: [],
          temp_sentiment_polarityLog: [],
          temp_mobilemention: [],
          temp_emailmention: [],
          temp_opportunity: [],
          temp_journey: [],
          temp_bant_authority: [],
          temp_bant_budget: [],
          temp_bant_need: [],
          temp_bant_timing: [],
          temp_next_step: [],
          temp_monologue_reps: [],
          //reps
          temp_sentiment_polarity_repLog: [],
          temp_sentiment_polarity_repLog: [],
          temp_dead_air_range_reps: [],
          temp_dead_air_reps: [],
          temp_no_of_question_reps: [],
          temp_listenLog: [],
          topics: []
        }))
        break;
    }
  }

  onCancel = e => {
    this.setState((prevState) => ({
      collection: {
        ...prevState.collection,
        name: '',
        type: 'manual'
      },
    }), _ => {
      this.getFilterValues('reset', true, '', '')
    })
  }

  changeType = (e) => {
    const type = e.target.value;
    this.setState((prevState) => ({
      collection: {
        ...prevState.collection,
        type,
        name: ''
      },
      // collectionName:''
    }), _ => {
      this.getFilterValues('reset', true, '', '')
    })
  }

  onChangeTextSearch = (e) => {
    let val = e.target.value
    if (e.keyCode === 13 && document.activeElement.id === "search-scoop" && e.target.value.length !== 0 && (/^\S/).test(e.target.value)) {
      if (e.target.value.length <= 512) {
        e.preventDefault();
        this.setState((prevState) => ({
          filter: {
            ...prevState.filter,
            condition: this.state.condition,
            keywords: prevState.search_strings.concat(val)
          },
          search_strings: prevState.search_strings.concat(val),
          pagination: {
            ...prevState.pagination,
            itemsCountPerPage: 10,
            activePage: 0
          }
        }), () => {
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
          // window.scrollTo(0, 0)
        })
        e.target.value = ''
      } else {
        toast.info('Search string length should not be greater than 512 characters', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
        })
      }
    }
  }

  deleteCurrentElement = (e) => {
    let forTopic = e.target.value.split(':')
    let string = e.target.value
    let searchinput = this.state.search_strings
    var index = searchinput && searchinput.indexOf(string);
    let rep = e.target.value
    let repinput = this.state.repId
    const index1 = repinput && repinput.map(rep => rep.repID).indexOf(rep)
    if (index !== '' && index > -1 && searchinput.length > 0) {
      searchinput.splice(index, 1)
      if (searchinput.length > 0) {
        this.setState((prevState) => ({
          filter: {
            ...prevState.filter,
            keywords: searchinput
          },
          pagination: {
            ...prevState.pagination,
            itemsCountPerPage: 10,
            activePage: 0
          }
        }), () => {
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
      } else {
        delete this.state.filter.keywords
        delete this.state.filter.condition
        this.setState((prevState) => ({
          filter: {
            ...prevState.filter,
          },
          pagination: {
            ...prevState.pagination,
            itemsCountPerPage: 10,
            activePage: 0
          }
        }), () => {
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
      }
    } else if (index1 !== '' && index1 > -1) {
      let FINALREP = this.state.repId
      FINALREP.splice(index1, 1)
      let repids = FINALREP.map(data => data.repID)
      if (repids.length > 0) {
        this.setState((prevState) => {
          return {
            repId: FINALREP,
            filter: {
              ...prevState.filter,
              reps: repids
            },
            pagination: {
              ...prevState.pagination,
              itemsCountPerPage: 10,
              activePage: 0
            },
            reomvePills: ['REPS', FINALREP]
          }
        }, () => {
          if (document.getElementById(string) !== null) {
            document.getElementById(string).disabled = false
          }
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
      }
      else {
        delete this.state.filter.reps
        this.setState((prevState) => {
          return {
            repId: repinput,
            filter: {
              ...prevState.filter,
            },
            pagination: {
              ...prevState.pagination,
              itemsCountPerPage: 10,
              activePage: 0
            },
            reomvePills: ['REPS', []]
          }
        }, () => {
          if (document.getElementById(string) !== null) {
            document.getElementById(string).disabled = false
          }
          // const { client_id, emailid } = this.props.user
          // const { filter, pagination } = this.state;
          // this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
      }
    } else if (forTopic[0] === 'topic') {
      let topic = e.target.id
      let subtopic = forTopic[1]
      let obj = this.state.topics
      let i
      if (topic === subtopic) {
        obj.map((data, index) => {
          data.name === topic && obj.splice(index, 1)
        })
        this.setState((prevState) => ({
          topics: obj,
          bool: !prevState.bool,
          reomvePills: ['TOPIC', ''],
        }))
      }
      else {
        obj.map((data, index) => {
          if (data.name === topic) {
            i = obj[index].value.indexOf(subtopic)
            obj[index].value.splice(i, 1)
            if (obj.length === 1 && obj[index].value.length === 0) {
              delete this.state.filter.topics
              this.setState((prevState) => ({
                reomvePills: ['TOPIC', ''],
                bool: !prevState.bool,
                topics: obj,
              }))
            }
            else if (obj[index].value.length > 0) {
              this.setState((prevState) => ({
                topics: obj,
                reomvePills: ['TOPIC', ''],
                bool: !prevState.bool
              }))
            }
            else if (obj[index].value.length === 0) {
              obj.splice(index, 1)
              this.setState((prevState) => ({
                topics: obj,
                reomvePills: ['TOPIC', ''],
                bool: !prevState.bool
              }))
            }

          }
        })
      }
      this.setState(() => ({
        topics: obj,
        reomvePills: ['TOPIC', '']
      }), () => {
        // const { client_id, emailid } = this.props.user
        // const { filter, pagination } = this.state;
        // this.props.loadSearchList(filter, pagination, client_id, emailid)
      })
    }
    else {
      switch (e.target.value) {
        case 'channel':
          delete this.state.filter.channels
          this.setState(() => ({
            temp_search_channel: [],
            filter: this.state.filter,
            reomvePills: 'CHANNEL'
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'date':
          delete this.state.filter.date
          this.setState(() => ({
            temp_finaldate_range: [],
            filter: this.state.filter,
            reomvePills: ['DATE', '']
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })

          break;
        case 'speaker':
          let Sremove = e.target.id
          const Sfinal = this.state.temp_searchspeaker
          Sfinal > 0 && Sfinal.map((data, i) => (data.value === Sremove && Sfinal.splice(i, 1)))
          Sfinal.length === 0 && delete this.state.filter.speakers
          this.setState(() => ({
            temp_searchspeaker: Sfinal,
            filter: this.state.filter,
            reomvePills: ['SPEAKER', Sremove]
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'DEAD_AIR':
          let DAremove = e.target.id
          let DAfinal = this.state.temp_deadAir
          DAfinal.map((data, index) => (data.value === DAremove && DAfinal.splice(index, 1)))
          DAfinal.length === 0 && delete this.state.filter.interactivity.dead_air
          this.setState(() => {
            return {
              temp_deadAir: DAfinal,
              filter: this.state.filter,
              reomvePills: ['DEADAIR', DAremove]
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'interactivity_tricles':
          let ITremove = e.target.id
          let ITfinal = this.state.temp_deadairRange
          ITfinal.map((data, index) => (data.interactivity_tricles === ITremove && ITfinal.splice(index, 1)))
          ITfinal.length === 0 && delete this.state.filter.interactivity.interaction_switches
          delete this.state.filter.interactivity.interaction_switches
          this.setState(() => {
            return {
              temp_deadairRange: ITfinal,
              filter: this.state.filter,
              reomvePills: ['INTERACTIVITY', ITremove]
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'NOQ':
          let NOQremove = e.target.id
          let NOQfinal = this.state.temp_no_of_questions_userLog
          NOQfinal.map((data, index) => ((data.no_questions_min + '-' + data.no_questions_max) === NOQremove && NOQfinal.splice(index, 1)))
          NOQfinal.length === 0 && delete this.state.filter.interactivity.no_of_questions
          this.setState(() => {
            return {
              temp_no_of_questions_userLog: NOQfinal,
              filter: this.state.filter,
              reomvePills: ['NOQ', NOQremove]
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'duration':
          let Dremove = e.target.id
          let Dfinal = this.state.temp_durationLog
          Dfinal.map((data, index) => ((data.duration_min + '-' + data.duration_max) === Dremove && Dfinal.splice(index, 1)))
          Dfinal.length === 0 && delete this.state.filter.interactivity.duration
          this.setState(() => {
            return {
              temp_durationLog: Dfinal,
              filter: this.state.filter,
              reomvePills: ['DURATION', Dremove]
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'monologue_conv':
          let Mremove = e.target.id
          let Mfinal = this.state.temp_monologue_conv
          Mfinal.map((data, index) => (data.sentiment === Mremove && Mfinal.splice(index, 1)))
          Mfinal.length === 0 && delete this.state.filter.interactivity.monologue

          this.setState(() => {
            return {
              temp_monologue_conv: Mfinal,
              filter: this.state.filter,
              reomvePills: ['MONO', Mremove]
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'sentiment_polarity':
          let SPremove = e.target.id
          let SPfinal = this.state.temp_sentiment_polarityLog
          SPfinal.map((data, index) => (data.sentiment === SPremove && SPfinal.splice(index, 1)))
          SPfinal.length === 0 && delete this.state.filter.interactivity.sentiment
          this.setState(() => {
            return {
              temp_sentiment_polarityLog: SPfinal,
              filter: this.state.filter,
              reomvePills: ['SENTIMENT', SPremove]
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'email-mention':
          delete this.state.filter.interactivity.email_mention
          this.setState(() => {
            return {
              temp_emailmention: [],
              filter: this.state.filter,
              reomvePills: ['EMAILMENTION', '']
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'mobile_mention':
          delete this.state.filter.interactivity.mobile_mention
          this.setState(() => {
            return {
              temp_mobilemention: [],
              filter: this.state.filter,
              reomvePills: ['MOBILEMENTION', '']
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'opportunity':
          delete this.state.filter.signals.opportunity
          this.setState(() => {
            return {
              temp_opportunity: [],
              filter: this.state.filter,
              reomvePills: ['OPPORTUNITY', '']
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'STAGE':
          let BJOremove = e.target.id
          let BJOfinal = this.state.temp_journey
          BJOfinal.map((data, index) => (data.stageValue === BJOremove && BJOfinal.splice(index, 1)))
          BJOfinal.length === 0 && delete this.state.filter.signals.opportunity.stage
          this.setState((prevState) => {
            return {
              temp_journey: BJOfinal,
              filter: this.state.filter,
              reomvePills: ['BJO', BJOremove]
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'BANT':
          let BANTremove = e.target.id
          let BANTfinal = this.state.temp_bant_authority
          BANTfinal.map((data, index) => (data.bantValue === BANTremove && BANTfinal.splice(index, 1)))
          BANTfinal.length === 0 && delete this.state.filter.signals.bant
          this.setState(() => {
            return {
              temp_bant_authority: BANTfinal,
              filter: this.state.filter,
              reomvePills: ['BANT', BANTremove]
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'next_steps':
          delete this.state.filter.signals.next_steps
          this.setState(() => {
            return {
              temp_next_step: [],
              filter: this.state.filter,
              reomvePills: ['NEXTSTEPS', '']
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'feedback':
          delete this.state.filter.feedback
          this.setState(() => {
            return {
              temp_feedback: [],
              filter: this.state.filter,
              reomvePills: ['FEEDBACK', '']
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'CONNECT':
          let CONNECTremove = e.target.id
          let CONNECTfinal = this.state.temp_contact
          CONNECTfinal.map((data, index) => (data.connectValue === CONNECTremove && CONNECTfinal.splice(index, 1)))
          CONNECTfinal.length === 0 && delete this.state.filter.connect
          this.setState(() => {
            return {
              temp_contact: CONNECTfinal,
              filter: this.state.filter,
              reomvePills: ['CONNECT', CONNECTremove]
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'CRM':
          delete this.state.filter.crm.existing_customer
          this.setState(() => {
            return {
              temp_crm: [],
              filter: this.state.filter,
              reomvePills: ['CRM', '']
            }
          }, _ => {
            // const { client_id, emailid } = this.props.user
            // const { filter, pagination } = this.state;
            // this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
      }
    }
  }

  changeKeepUpdating = () => {
    this.setState((prevState) => ({
      keep_updating: !prevState.keep_updating,
      singleDateValue: '',
      single_end_date: '',
      collection: {
        ...prevState.collection,
        end_date: '',
      },
    }))
  }

  handleSortConditionFilter = (e) => {
    if (e.target.checked) {
      this.setState((prevState) => ({
        searchConditionToggle: true,
        condition: 'OR',
        filter: {
          ...prevState.filter,
          condition: "OR",
        }
        ,
        pagination: {
          ...prevState.pagination,
          itemsCountPerPage: 10,
          activePage: 0
        }
      }), () => {
        // const { client_id, emailid } = this.props.user
        // const { filter, pagination } = this.state;
        // this.props.loadSearchList(filter, pagination, client_id, emailid)
      })
    } else {
      this.setState((prevState) => ({
        searchConditionToggle: false,
        condition: 'AND',
        filter: {
          ...prevState.filter,
          condition: "AND",
        }
        ,
        pagination: {
          ...prevState.pagination,
          itemsCountPerPage: 10,
          activePage: 0
        }
      }), () => {
        // const { client_id, emailid } = this.props.user
        // const { filter, pagination } = this.state;
        // this.props.loadSearchList(filter, pagination, client_id, emailid)
      })
    }
  }

  render() {
    // let sortedCustomTopics = this.props.searchFilter && this.props.searchFilter.custom_topics && this.props.searchFilter.custom_topics.sort((a, b) => {
    //   var nameA = a.label.toUpperCase();
    //   var nameB = b.label.toUpperCase();
    //   if (nameA < nameB) {
    //     return -1;
    //   }
    //   if (nameA > nameB) {
    //     return 1;
    //   }
    //   return 0;
    // })
    // this.props.searchFilter && this.props.searchFilter.custom_topics && this.props.searchFilter.custom_topics.map(data => {
    //   return data.value.sort((a, b) => {
    //     var nameA = a.toUpperCase();
    //     var nameB = b.toUpperCase();
    //     if (nameA < nameB) {
    //       return -1;
    //     }
    //     if (nameA > nameB) {
    //       return 1;
    //     }
    //     return 0;
    //   })
    // })
    let TOPICS = this.props.searchFilter !== undefined && this.props.searchFilter.conversation.topics
    return (
      <React.Fragment>
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
        <div className="modal" id="createCollection">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" onClick={this.onCancel}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="modal-box">
                  <div className="modal-icon">
                    <img src="/static/images/create-collection.png" />
                  </div>
                  <div className="modal-title">
                    <h2>Create Collection</h2>
                    <p>Collections can be accessed from the side navigation</p>
                  </div>
                  <div className="collectionOptions">
                    <ul className="options">
                      <li>
                        <div className="radioContainer">
                          <input type="radio" name="collection" value="manual" className="radio-btn manualRadio" onChange={this.changeType} checked={this.state.collection.type === "manual"} />
                          <span className="virtual-radio"></span>
                          <span className="radio-text">Manual Collection</span>
                        </div>
                      </li>
                      <li>
                        <div className="radioContainer">
                          <input type="radio" name="collection" value="rule_based" data-toggle="collapse" data-target="#ruleBased" className="radio-btn ruleRadio" onChange={this.changeType} checked={this.state.collection.type === "rule_based"} />
                          <span className="virtual-radio"></span>
                          <span className="radio-text">Rule-based Collection</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  {this.state.collection.type == "rule_based" && <div className="ruleBased collectionSearch" id="ruleBased">
                    {/*<Scrollbars className="scroll" style={{ height: "300px" }}
                      renderTrackVertical={props => <div className="track-vertical" />}
                      renderThumbVertical={props => <div className="thumb-horizontal" />}
    >*/}
                    <div className="searchConversations">
                      <div className="searchPane " onClick={() => { this.setState(() => ({ inputsearch: true })) }}>
                        {
                          ((this.state.search_strings && this.state.search_strings.length > 0) || (this.state.temp_searchspeaker && this.state.temp_searchspeaker.length > 0) || (this.state.temp_search_channel && this.state.temp_search_channel.length > 0) || (this.state.temp_durationLog && this.state.temp_durationLog.length > 0) || (this.state.temp_no_of_questions_userLog && this.state.temp_no_of_questions_userLog.length > 0) || (this.state.temp_sentiment_polarity_repLog && this.state.temp_sentiment_polarity_repLog.length > 0) || (this.state.temp_sentiment_polarityLog && this.state.temp_sentiment_polarityLog.length > 0) || (this.state.temp_journey && this.state.temp_journey.length > 0) || (this.state.temp_emailmention && this.state.temp_emailmention.length > 0) || (this.state.temp_mobilemention && this.state.temp_mobilemention.length > 0) || this.state.repId.length > 0 || (this.state.temp_opportunity && this.state.temp_opportunity.length > 0) || (this.state.temp_deadAir && this.state.temp_deadAir.length > 0) || (this.state.temp_deadairRange && this.state.temp_deadairRange.length > 0) || (this.state.temp_monologue_conv && this.state.temp_monologue_conv.length > 0) || (this.state.temp_bant_authority && this.state.temp_bant_authority.length > 0) || (this.state.temp_next_step && this.state.temp_next_step.length > 0) || (this.state.temp_feedback && this.state.temp_feedback.length > 0) || (this.state.temp_contact && this.state.temp_contact.length > 0) || (this.state.temp_crm && this.state.temp_crm.length > 0) || (this.state.temp_finaldate_range && this.state.temp_finaldate_range.length > 0) || (this.state.topics && this.state.topics.length > 0)) &&
                          <React.Fragment>
                            <div className="search-element">{
                              this.state.search_strings && this.state.search_strings.map((data, index) => {
                                return <span key={index}> {data} <button onClick={this.deleteCurrentElement} value={data}> <i className="icon-close"></i> </button></span>
                              })
                            }
                              {
                                this.state.temp_search_channel && this.state.temp_search_channel.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_searchspeaker && this.state.temp_searchspeaker.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type} id={data.value}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_finaldate_range && this.state.temp_finaldate_range.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.repId && this.state.repId.map((data, index) => {
                                  return <span key={index}> {data.repName} <button onClick={this.deleteCurrentElement} value={data.repID}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                TOPICS !== false && this.state.topics && this.state.topics.map((data) => {
                                  let name = data.name
                                  if (data.value.length === (TOPICS !== false && TOPICS.filter(d => d.name === name)[0].value.length)) {
                                    return <span key={Math.random()}> {'Topic: ' + data.name} <button onClick={this.deleteCurrentElement} id={data.name} value={'topic:' + data.name}> <i className="icon-close"></i> </button></span>
                                  }
                                  else {
                                    return data.value && data.value.map(dat => {
                                      return <span key={Math.random()}> {data.name + ": " + dat} <button onClick={this.deleteCurrentElement} id={data.name} value={'topic:' + dat}> <i className="icon-close"></i> </button></span>
                                    })
                                  }
                                })
                              }
                              {
                                this.state.temp_deadAir && this.state.temp_deadAir.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type} id={data.value}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_deadairRange && this.state.temp_deadairRange.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type} id={data.interactivity_tricles}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_no_of_questions_userLog && this.state.temp_no_of_questions_userLog.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type} id={data.no_questions_min + "-" + data.no_questions_max}> <i className="icon-close"></i> </button></span>
                                })}
                              {
                                this.state.temp_durationLog && this.state.temp_durationLog.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type} id={data.duration_min + '-' + data.duration_max}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_monologue_conv && this.state.temp_monologue_conv.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type} id={data.monologue_min + '-' + data.monologue_max}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {this.state.temp_sentiment_polarityLog && this.state.temp_sentiment_polarityLog.map((data, index) => {
                                return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type} id={data.sentiment}> <i className="icon-close"></i> </button></span>
                              })}
                              {
                                this.state.temp_mobilemention && this.state.temp_mobilemention.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_emailmention && this.state.temp_emailmention.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_opportunity && this.state.temp_opportunity.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_journey && this.state.temp_journey.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type} id={data.stageValue}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_bant_authority && this.state.temp_bant_authority.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type} id={data.bantValue}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_next_step && this.state.temp_next_step.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_feedback && this.state.temp_feedback.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_contact && this.state.temp_contact.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type} id={data.connectValue}> <i className="icon-close"></i> </button></span>
                                })
                              }
                              {
                                this.state.temp_crm && this.state.temp_crm.map((data, index) => {
                                  return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                                })
                              }
                            </div>
                          </React.Fragment>
                        }
                      </div>
                      <div className="input-hide-search">{
                        this.state.inputsearch && <React.Fragment><input type="text" onChange={this.onChangeTextSearch} onKeyUp={this.onChangeTextSearch} id="search-scoop" placeholder="Enter Keywords" />
                          {/* <button onClick={() => { this.setState(() => ({ inputsearch: false })) }}> X </button> */}
                          <div className="comp-btn">
                            <label class="switch switch-left-right">
                              <input onChange={this.handleSortConditionFilter} class="switch-input" type="checkbox" checked={this.state.searchConditionToggle} />
                              <span class="switch-label" data-on="OR" data-off="AND"></span>
                              <span class="switch-handle"></span>
                            </label>
                          </div>
                        </React.Fragment>
                      }
                      </div>
                      <AllFilters collection={false} getValues={this.getFilterValues} removePills={this.state.reomvePills} topics={this.state.topics} bool={this.state.bool} />
                    </div>
                    {/* <div className="collectionName ruleBasedPart">
                      <div className="form-group checkboxText">
                        <input type="checkbox" name="updating" className="" onChange={this.changeKeepUpdating} /> Keep updating the collection with new data
                                        </div>
                      {
                        this.state.keep_updating && <div className="form-group">
                          <input type="text" name="endDate" className="form-control" value={this.state.singleDateValue} placeholder="Select End Date (Optional)" onClick={this.singleClickDate} />
                          {this.state.singletoggle && <React.Fragment>
                            <div className="SingleDatePicker">
                              <DatePicker
                                isOpen={true} //default open state
                                onChange={this.onChangeSingleDate}
                                // onChange={this.onChangeSingleDate}
                                // onChange={this.onChangeSingleDate}
                                // onChange={this.onChangeSingleDate}
                                // onChange={this.onChangeSingleDate}
                                onCalendarClose={() => {
                                  let date = this.state.single_end_date
                                  this.setState(() => ({
                                    singletoggle: false,
                                    singleDateValue: moment(date).format("Do MMMM, YYYY")
                                  }))
                                }}
                              />
                            </div>
                          </React.Fragment>
                          }
                        </div>}
                    </div> */}
                  </div>}
                  <div className="collectionName manual">
                    <div className="form-group">
                      <input name="collectionName" id="search-scoo" className="form-control" onKeyUp={this.handleEnterChange} placeholder="Add name" onChange={this.onChange} value={this.state.collection.name} />
                    </div>
                  </div>
                  <div className="collectionButtons">
                    <button type="button" id="create-button" className="colorBtn btn btn-secondary" disabled={this.props.status || this.state.status} onClick={this.saveData} data-dismiss={this.state.collection.name ? "modal" : ''}>CREATE</button>
                    <button type="button" className="btn emptyColorBtn" data-dismiss="modal" onClick={this.onCancel}>CANCEL</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

NewCollection.defaultProps = {
  status: false
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    channels: state.searchReducer.channels,
    speakers: state.searchReducer.speakers,
    DateRange: state.searchReducer.DateRange,
    OpportunityOptions: state.searchReducer.OpportunityOptions,
    BuyingJourneyOptions: state.searchReducer.BuyingJourneyOptions,
    Interactivity_tricles: state.searchReducer.Interactivity_tricles,
    duration: state.searchReducer.duration,
    interaction_switches: state.searchReducer.interaction_switches,
    no_of_questions_user: state.searchReducer.no_of_questions_user,
    sentiment_polarity: state.searchReducer.sentiment_polarity,
    sentiment_polarity_rep: state.searchReducer.sentiment_polarity_rep,
    talk_to_listen: state.searchReducer.talk_to_listen,
    repChannelId: state.searchReducer.repChannelId,
    searchFilter: state.searchReducer.searchFilter,
    status: state.collectionReducer.status
  };
};

const mapActionToProps = {
  create: collectionAction.createCollection,
  loadSearchFilter: searchAction.searchFilter,
  loadRepChannel: searchAction.rep_by_channel_id
};

export default connect(mapStateToProps, mapActionToProps)(NewCollection);