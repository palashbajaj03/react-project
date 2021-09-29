/* Info: This file is for Conversation List Component */
/* Created on {3-07-19} By {Siddhant Chopra}*/
/* Modified on {12-08-19} By {Pravesh Sharma}*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'rc-pagination';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { Link, withRouter } from 'react-router-dom';

import { conversationAction, collectionAction } from '../../actions';
import { routingConstants, ApiConst } from "../../constants";
import axios from 'axios';
import cookie from 'react-cookies';
import AllSearch from '../Search/AllSearch';
import BookMarkConversation from './BookMarkConversation';
import { ToastContainer, toast } from 'react-toastify';
import './ConversationList.css';

momentDurationFormatSetup(moment);

class ConversationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsCountPerPage: this.props.conversationList ? this.props.conversationList.pagination.page_limit : 10,
      activePage: this.props.conversationList ? this.props.conversationList.pagination.page_current : 0,
      toggle: false,
      display: true,
      starred: false,
      temp_durationLog: [0, 0],
      temp_sentiment_polarityLog: '',
      temp_sentiment_polarity_repLog: '',
      temp_no_of_questions_userLog: [0, 0],
      temp_listenLog: [0, 0],
      temp_interaction_switchesLog: [0, 0],
    }
  }

  componentDidMount() {
    const { itemsCountPerPage, activePage } = this.state;
    const { client_id, emailid } = this.props.user
    this.props.loadConversationList({ itemsCountPerPage, activePage }, client_id, emailid);
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100);
    window.jQuery('#saveToCollection').on('show.bs.modal', this.resetValues)
  }

  resetValues = () => {
    this.setState(({
      collectionName: '',
    }))
  }

  filter = (e) => {
    //This function is used to change the number of conversation per page
    const count = parseInt(e.target.value);
    let { activePage } = this.state;
    const { client_id, emailid } = this.props.user
    let total = this.props.conversationList.pagination.total_records;
    if (total) {
      let totalPage = Math.ceil((total / count))
      activePage = totalPage <= activePage ? totalPage - 1 : activePage;
    }
    this.setState(() => ({ itemsCountPerPage: count, activePage }), () => {
      const { itemsCountPerPage, activePage } = this.state;
      this.props.loadConversationList({ itemsCountPerPage, activePage }, client_id, emailid)
    });
  }

  setConversationId = (id) => {
    this.setState(({ conversationId: id }))
  }

  populateSaveToCollection = (data) => {
    this.setState(({
      search_input: {
        ...data.data
      },
      search_strings: data.search_strings,
      temp_search_channel: data.temp_search_channel,
      currentselectedoption: data.currentselectedoption,
      temp_finaldate_range: data.temp_finaldate_range,
      temp_finaldate: data.temp_finaldate,
      temp_opportunity: data.temp_opportunity,
      temp_journey: data.temp_journey,
      temp_repChannelId: data.temp_repChannelId,
      temp_listenLog: data.temp_listenLog,
      temp_interaction_switchesLog: data.temp_interaction_switchesLog,
      temp_no_of_questions_userLog: data.temp_no_of_questions_userLog,
      temp_sentiment_polarity_repLog: data.temp_sentiment_polarity_repLog,
      temp_sentiment_polarityLog: data.temp_sentiment_polarityLog,
      temp_followup: data.temp_followup,
      temp_appointment: data.temp_appointment,
      temp_emailmention: data.temp_emailmention,
      temp_pricesensitive: data.temp_pricesensitive,
      temp_lastmessage: data.temp_lastmessage,
      temp_BizMetric: data.temp_BizMetric,
      temp_BizCompetition: data.temp_BizCompetition,
      temp_BizProduct: data.temp_BizProduct,
      temp_BizExpKey: data.temp_BizExpKey,
      temp_durationLog: data.temp_durationLog,
      temp_handleStats: data.temp_handleStats,
      temp_searchspeaker: data.temp_searchspeaker,
      keep_updating: data.keep_updating,
      repId:data.repId,
      repIds:data.repIds
    }))
  }

  onChange(activePage, pageSize) {
    //This function is handler of pagination change
    const { client_id, emailid } = this.props.user
    this.setState(() => ({ itemsCountPerPage: pageSize, activePage: activePage - 1 }), () => {
      const { itemsCountPerPage, activePage } = this.state;
      this.props.loadConversationList({ itemsCountPerPage, activePage }, client_id, emailid)
      window.scrollTo(0, 0);
    });
  }
  handleEnterChange = (e) => {
    if (e.keyCode === 13 && document.activeElement.id === "search-scoo") {
      document.getElementById("create-button").click()
    }
  }


  checkCollectionName = async (client_id, emailid) => {
    const status = await axios({
      method: 'POST',
      url: ApiConst.BASE_URL + ApiConst.COLLECTION_EXIST,
      data: {
        client_id,
        emailid,
        name: this.state.collectionName
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

  handleCollectionName = (e) => {
    const name = e.target.value
    if ((/^[\s\S]{0,255}$/).test(name) && name !== ' ') {
      this.setState({ collectionName: name })
    }
  }

  checkDate = () => {
    if (this.state.search_input.search_conversation_date_from) {
      return true
    } else {
      this.setState(prevState => ({
        search_input: {
          ...prevState.search_input,
          search_conversation_date_from: moment().format("YYYY-MM-DD") + "T00:00:00Z",
          search_conversation_date_to: moment().add(30, 'days').format("YYYY-MM-DD") + "T00:00:00Z",
        }
      }))
      return true;
    }
  }

  handleSaveToCollection = async () => {
    const { client_id, emailid } = this.props.user
    const { search_input, collectionName } = this.state;
    if (collectionName) {
      const status = await this.checkCollectionName(client_id, emailid);
      const dateExist = await this.checkDate();
      if (!status && dateExist) {
        this.props.create({
          name: collectionName,
          description: "",
          keep_updating: this.state.keep_updating,
          type: "rule_based",
          end_date: moment().add(30, 'days').format("YYYY-MM-DD") + "T00:00:00Z",
          result_criteria: {
            ...this.state.search_input
          }
        }, client_id, emailid)
      } else {
        toast.info('Collection with this name already exists', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
        })
      }
    } else {
      toast.info('Enter a valid name', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
      })
    }
  }

  itemRender = (current, type, element) => {
    //This function renders the number inside the pagination, We can style them here
    if (type === 'page') {
      current = current < 10 ? '0' + current : current;
      return <a>{current}</a>;
    }
    return element;
  };

  handleMorph = () => {
    //This function handels the opening and closing of search page
    this.setState((prevState) => ({
      toggle: !prevState.toggle,
      display: !prevState.display
    }))
  }

  handleActivity = (e) => {
    //This function handels the bookmarking and starring of conversation
    e.preventDefault()
    const { client_id, emailid } = this.props.user;
    const [item, id] = e.target.id.split(' ')
    const itemId = e.target.id

    if (item === 'star') {
      document.getElementById(itemId).style.pointerEvents = "none";
      if (!e.target.className.includes('starActive')) {
        // e.target.classList.add('starActive')
        this.setState(() => ({
          starred: true
        }), () => {
          const { starred, itemsCountPerPage, activePage } = this.state
          this.props.starOnList({ client_id, emailid, starred, id, pagination: { itemsCountPerPage, activePage } });
        })
      } else {
        // e.target.classList.remove('starActive')
        this.setState(() => ({
          starred: false
        }), () => {
          const { starred, itemsCountPerPage, activePage } = this.state
          this.props.starOnList({ client_id, emailid, starred, id, pagination: { itemsCountPerPage, activePage } });
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
  }

  deleteCurrentElement = (e) => {
    let string = e.target.value
    let searchinput = this.state.search_strings
    var index = searchinput && searchinput.indexOf(string);
    let rep = e.target.value
    let repinput = this.state.repId
    const index1 = repinput && repinput.indexOf(rep)
    let repinputs = this.state.repIds
    var removeIndex = repinputs.map(function (item) { return item.name; }).indexOf(rep)

    if (index !== '' && index > -1) {

      searchinput.splice(index, 1)
      this.setState((prevState) => ({
        search_strings: searchinput,
        search_pagination: {
          ...prevState.search_pagination,
          itemsCountPerPage: 10,
          activePage: 0
        }
      }), () => {
        // const { client_id, emailid } = this.props.user
        // const { search_input, search_pagination } = this.state;
        // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
      })
    }
    else if (index1 !== '' && index1 > -1 && removeIndex !== '' && removeIndex > -1) {
      repinput.splice(index1, 1)
      repinputs.splice(removeIndex, 1);
      this.setState((prevState) => ({
        lastSelectedRep: 'Select Reps',
        repId: repinput,
        search_input: {
          ...prevState.search_input,
          search_advanced: {
            ...prevState.search_input.search_advanced,
            rep: {
              ...prevState.search_input.search_advanced.rep,
              rep_details: repinputs
            }
          }
        },
        search_pagination: {
          ...prevState.search_pagination,
          itemsCountPerPage: 10,
          activePage: 0
        }
      }), () => {
        // const { client_id, emailid } = this.props.user
        // const { search_input, search_pagination } = this.state;
        // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
      })
    }

    else {
      switch (e.target.value) {
        case 'Listen':
          this.setState((prevState) => ({
            temp_listenLog: [0, 0],
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                rep: {
                  ...prevState.search_input.search_advanced.rep,
                  talk_to_listen_ratio_min: '',
                  talk_to_listen_ratio_max: '',

                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })
          break;
        case 'interaction_switches':
          this.setState((prevState) => ({
            temp_interaction_switchesLog: [0, 0],
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                rep: {
                  ...prevState.search_input.search_advanced.rep,
                  interactivity_switches_min: '',
                  interactivity_switches_max: '',

                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })
          break;
        case 'no_of_questions_user':
          this.setState((prevState) => ({
            temp_no_of_questions_userLog: [0, 0],
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                rep: {
                  ...prevState.search_input.search_advanced.rep,
                  no_questions_min: '',
                  no_questions_max: '',

                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })
          break;
        case 'sentiment_polarity_rep':
          document.getElementsByClassName('inptWrapper')[this.state.spl1] && document.getElementsByClassName('inptWrapper')[this.state.spl1].classList.remove('radioSelected')
          this.setState((prevState) => ({
            spl: '',
            temp_sentiment_polarity_repLog: '',
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                rep: {
                  ...prevState.search_input.search_advanced.rep,
                  sentiment_level_min: '',
                  sentiment_level_max: '',

                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'sentiment_polarity':
          document.getElementsByClassName('sent')[this.state.cspl1] && document.getElementsByClassName('sent')[this.state.cspl1].classList.remove('radioSelected')
          this.setState((prevState) => ({
            cspl: '',
            temp_sentiment_polarityLog: '',
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                customer_engagement: {
                  ...prevState.search_input.search_advanced.customer_engagement,
                  sentiment_level_min: '',
                  sentiment_level_max: '',

                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'duration':
          this.setState((prevState) => ({
            temp_durationLog: [0, 0],
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                basic_stats: {
                  ...prevState.search_input.search_advanced.basic_stats,
                  duration_min: '',
                  duration_max: ''
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })
          break;
        case 'opportunity':
          this.setState((prevState) => ({
            temp_opportunity: '',
            lastSelectedOpp: 'Opportunity',
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                opportunities: {
                  ...prevState.search_input.search_advanced.opportunities,
                  opportunity_stage: []
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'journey':
          this.setState((prevState) => ({
            temp_journey: '',
            lastSelectedBuy: 'Buying Journey Stage',
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                opportunities: {
                  ...prevState.search_input.search_advanced.opportunities,
                  buying_journey_stage: []
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }

          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'channel':
          this.setState((prevState) => ({
            radiostate: '',
            channelName: '',
            search_input: {
              ...prevState.search_input,
              search_channel: []
            },
            temp_search_channel: '',
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })
          break;
        case 'speaker':
          this.setState((prevState) => ({
            speakereName: '',
            radioSpeaker: '',
            search_input: {
              ...prevState.search_input,
              search_speaker: ''
            },
            temp_searchspeaker: '',
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })
          break;
        case 'date':
          this.setState((prevState) => ({
            currentselectedoption: '',
            radioDate: '',
            temp_finaldate_range: '',
            temp_finaldate: '',
            search_input: {
              ...prevState.search_input,
              search_conversation_date_from: moment().subtract(7, 'days').format("YYYY-MM-DD") + "T00:00:00Z",
              search_conversation_date_to: moment().format("YYYY-MM-DD") + "T00:00:00Z",
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'followup':
          this.setState((prevState) => ({
            radioFollow: '',
            temp_followup: '',
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                customer_engagement: {
                  ...prevState.search_input.search_advanced.customer_engagement,
                  followup: '',
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'appointment':
          this.setState((prevState) => ({
            temp_appointment: '',
            radioAppointment: '',

            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                customer_engagement: {
                  ...prevState.search_input.search_advanced.customer_engagement,
                  appointment: '',
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'email-mention':
          this.setState((prevState) => ({
            temp_emailmention: '',
            radioEmail: '',

            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                customer_engagement: {
                  ...prevState.search_input.search_advanced.customer_engagement,
                  email_mentions: '',
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'price-sensitive':
          this.setState((prevState) => ({
            temp_pricesensitive: '',
            radioPrice: '',

            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                customer_engagement: {
                  ...prevState.search_input.search_advanced.customer_engagement,
                  price_sensitive: ''
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'last-message-is-question':
          this.setState((prevState) => ({
            temp_lastmessage: '',
            radioLastM: '',
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                customer_engagement: {
                  ...prevState.search_input.search_advanced.customer_engagement,
                  last_message_in_action: '',
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'bizmetric':
          this.setState((prevState) => ({
            temp_BizMetric: '',
            radioBiz: '',
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                business_metrics: {
                  ...prevState.search_input.search_advanced.business_metrics,
                  pricing: '',
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'BizCompetition':
          this.setState((prevState) => ({
            temp_BizCompetition: '',
            radioComp: '',
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                business_metrics: {
                  ...prevState.search_input.search_advanced.business_metrics,
                  competition: '',
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'BizProduct':
          this.setState((prevState) => ({
            temp_BizProduct: '',
            radioProd: '',
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                business_metrics: {
                  ...prevState.search_input.search_advanced.business_metrics,
                  product: '',
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'BizExpKey':
          this.setState((prevState) => ({
            temp_BizExpKey: '',

            radioExpKey: '',

            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                business_metrics: {
                  ...prevState.search_input.search_advanced.business_metrics,
                  expert_keywords: '',
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'stats':
          this.setState((prevState) => ({
            temp_handleStats: '',
            radioDuration: '',
            search_input: {
              ...prevState.search_input,
              search_advanced: {
                ...prevState.search_input.search_advanced,
                basic_stats: {
                  ...prevState.search_input.search_advanced.basic_stats,
                  conversion: '',
                }
              }
            },
            search_pagination: {
              ...prevState.search_pagination,
              itemsCountPerPage: 10,
              activePage: 0
            }
          }), () => {
            // const { client_id, emailid } = this.props.user
            // const { search_input, search_pagination } = this.state;
            // this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
          })

          break;
        case 'reset':
          document.getElementsByClassName('inptWrapper')[this.state.spl1] && document.getElementsByClassName('inptWrapper')[this.state.spl1].classList.remove('radioSelected')
          document.getElementsByClassName('sent')[this.state.cspl1] && document.getElementsByClassName('sent')[this.state.cspl1].classList.remove('radioSelected')
          this.setState((prevState) => ({
            lastSelectedSort: 'Date',
            temp_durationLog: [0, 0],
            temp_listenLog: [0, 0],
            temp_interaction_switchesLog: [0, 0],
            temp_no_of_questions_userLog: [0, 0],
            temp_sentiment_polarityLog: '',
            temp_sentiment_polarity_repLog: '',
            search_input: {
              search_strings: [],
              search_channel: [{ id: "web_chat", label: "All Channel" },
              { id: "telephony", label: "All Channel" },
              { id: "online_meeting_tools", label: "All Channel" }],
              search_speaker: "",
              search_conversation_date_from:
                moment().subtract(7, 'days').format("YYYY-MM-DD") + "T00:00:00Z",
              search_conversation_date_to:
                moment().format("YYYY-MM-DD") + "T00:00:00Z",
              search_advanced: {
                opportunities: {
                  opportunity_stage: [

                  ],
                  buying_journey_stage: [

                  ]
                },
                rep: {
                  rep_details: [

                  ],
                  talk_to_listen_ratio_min: '',
                  talk_to_listen_ratio_max: '',
                  no_questions_min: '',
                  no_questions_max: '',
                  interactivity_switches_min: '',
                  interactivity_switches_max: '',
                  sentiment_level_min: '',
                  sentiment_level_max: ''
                },
                customer_engagement: {
                  sentiment_level_min: '',
                  sentiment_level_max: '',
                  followup: '',
                  appointment: '',
                  email_mentions: '',
                  mobile_mentions: '',
                  price_sensitive: '',
                  last_message_in_action: ''
                },
                business_metrics: {
                  competition: '',
                  pricing: ''
                },
                basic_stats: {
                  conversion: '',
                  duration_min: '',
                  duration_max: ''
                }
              }
            },
            search_pagination: {
              itemsCountPerPage: 10,
              activePage: 0
            },
            spl: '',
            cspl: '',
            repId: [],
            repIds: [],
            lastSelectedRep: 'Select Reps',
            lastSelectedOpp: 'Opportunity',
            lastSelectedBuy: 'Buying Journey Stage',
            channelName: '',
            currentselectedoption: '',
            radiostate: '',
            radioSpeaker: '',
            radioDate: '',
            radioFollow: '',
            radioAppointment: '',
            radioEmail: '',
            radioPrice: '',
            radioLastM: '',
            radioBiz: '',
            radioExpKey: '',
            radioComp: '',
            radioProd: '',
            radioDuration: '',
            // temp_durationLog: '',
            // temp_sentiment_polarityLog: '',
            // temp_sentiment_polarity_repLog: '',
            // temp_no_of_questions_userLog: '',
            // temp_listenLog: '',
            // temp_interaction_switchesLog: '',
            temp_journey: '',
            temp_opportunity: '',
            temp_searchspeaker: '',
            temp_search_channel: '',
            temp_repChannelId: '',
            temp_lastmessage: '',
            temp_pricesensitive: '',
            temp_emailmention: '',
            temp_appointment: '',
            temp_followup: '',
            temp_handleStats: '',
            temp_BizMetric: '',
            temp_BizCompetition: '',
            temp_BizProduct: '',
            temp_BizExpKey: '',
            temp_finaldate: '',
            temp_finaldate_range: '',
            speakereName: '',
            search_strings: '',
          }), () => {
            const { client_id, emailid } = this.props.user
            const { search_input, search_pagination } = this.state;
            this.props.loadSearchList(search_input, search_pagination, client_id, emailid)
            // this.setState(({
            //   temp_finaldate: [{
            //     type: 'date', string: "Date: Last 7 Days", from: this.state.search_input.search_conversation_date_from, to: this.state.search_input.search_conversation_date_to
            //   }]
            // }))
          })


      }
    }


  }
  getInitials = (string) => {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }
  render() {
    return (
      <React.Fragment>
        <ToastContainer
          position="top-right"
          autoClose={200}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover={false}
        />
        <div className="conversation-wrapp">
          <div className="custom-row">
            {this.state.toggle &&
              <div className="Morph-search animated fadeIn">
                <AllSearch close={this.handleMorph} back={true} save={this.populateSaveToCollection} setConversationId={this.setConversationId} />
              </div>}
            {this.state.display && <div className={`start-all-conversation ${this.state.display ? 'animated fadeIn' : 'animated bounce'}`}>
              <div className="page-title-row">
                <div className="page-title-box">
                  <h2 className="page-title"> List of Conversations </h2>
                  <span className="page-title-text"> All conversations </span>
                </div>
                <div className="searchBox animated slideInLeft">
                  <span onClick={this.handleMorph}>
                    <input type="search" className="form-control" id="searchConversation" placeholder="Search with some keywords, numbers, phrases, reps, customer" />
                    <span className="searchIcon"><i className="icon-search"></i></span>
                  </span>
                </div>
              </div>
              {this.props.conversationList && <div className="conversation-inner-wrapp mt25 animated zoomIn">
                {this.props.conversationList.conversations.map((conversation, index) => (
                  <Link key={index} to={`${routingConstants.CONVERSATION_DETAIL}/${conversation.record_id}`}>
                    <div className={'start-conversation-row  ' + `${conversation.chat_sentiment < -0.5 ? ' color-1' : conversation.chat_sentiment < 0.5 ? ' color-2' : ' color-3'}`}>
                      {conversation.opportunity ? <span className="opportunity"> opportunity </span> : ''}
                      <div className="row">
                        <div className="conver-profile col-lg-4 col-md-4">
                          <div className="active-user-img as-img mr25">
                            <span className="initials-logo"> {conversation.reps.length > 1 ? conversation.reps.map((rep) =>
                              this.getInitials(rep.name)) : conversation.reps.map((rep) => this.getInitials(rep.name))
                            }</span>
                          </div>
                          <div className="media-name-box">
                            <h4 className="media-text"> {conversation.reps.length > 1 ? conversation.reps.map((rep) => rep.name).join(', ') : conversation.reps.map((rep) => rep.name)} </h4>
                            <div className="subText">
                              <i className={conversation.channel_id === "web_chat" ? 'icon-chat' : conversation.channel_id === 'telephony' ? 'icon-audio' : 'icon-video'}></i> <span className="side-text">{conversation.channel_subtype}</span>
                            </div>
                          </div>
                        </div>
                        <div className="conver-detail col-lg-3 ">
                          <h4 className="media-text">{conversation.visitors.map(user => user.name)}</h4>
                          <small className="small-text">{conversation.visitors.map((user) => user.organization)}</small>
                        </div>
                        <div className="conver-call-detail col-lg-3 ">
                          <h5 className="call-time">{moment.duration(conversation.duration, "seconds").format("h [hrs] m [mins] s [secs]")}</h5>
                          <small className="small-text">{moment(conversation.date).format('Do MMMM YYYY, hh:mm A')} </small>
                        </div>
                        <div className="col-lg-2">
                          <ul className="icons-group" onClick={this.handleActivity}>
                            <li className="showTooltip">
                              <i id={"star " + conversation.record_id} className={`${conversation.starred ? 'icon-starred starActive' : 'icon-starred'}`} > </i>
                              <div className="tooltipText">
                                <span>{conversation.starred ? 'Remove from starred collection' : 'Add to starred collection'}</span>
                              </div>

                            </li>
                            <li>
                              <i id={"book " + conversation.record_id} className="icon-bookmark" data-toggle="modal" data-target="#bookMarkConversation"> </i>
                            </li>
                            {/*<li>
                                <i className="icon-share" onClick={this.onClick}> </i>
                              </li>*/}
                            { /*<li>
                                <i className="icon-delete" > </i>
                              </li>*/}
                          </ul>
                        </div>

                      </div>
                    </div>
                  </Link>
                ))}
              </div>}
              {this.props.conversationList && <div className="show-conversation-row mt30">
                <div className="dropdown show">
                  <button className="btn custom-dropdown dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.itemsCountPerPage} Conversations per page</button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink" onClick={this.filter}>
                    <button className="dropdown-item" value={10}>10 Conversations per page</button>
                    <button className="dropdown-item" value={20}>20 Conversations per page</button>
                    <button className="dropdown-item" value={30}>30 Conversations per page</button>
                    <button className="dropdown-item" value={50}>50 Conversations per page</button>
                  </div>
                </div>
                <div className="pagination">
                  <Pagination
                    defaultPageSize={10}
                    pageSize={this.state.itemsCountPerPage}
                    defaultCurrent={this.state.activePage + 1}
                    showTitle={false}
                    onChange={this.onChange.bind(this)}
                    total={this.props.conversationList.pagination.total_records}
                    itemRender={this.itemRender}
                  />
                </div>
              </div>}
            </div>}
          </div>
        </div>
        <BookMarkConversation convId={this.state.conversationId && this.state.conversationId} collectionList={this.props.collectionList && this.props.collectionList} />
        {<div className="modal" id="saveToCollection">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body">
                <div className="modal-box">
                  <div className="modal-icon">
                    <img src="/static/images/create-collection.png" />
                  </div>
                  <div className="modal-title">
                    <h2>Save to Collection</h2>
                    <p>Collections can be accessed from the side navigation</p>
                  </div>
                  <div className="collectionName">
                    <div className="collections">
                      <React.Fragment>
                        <div className="search-element">{
                          this.state.search_strings && this.state.search_strings.map((data, index) => {
                            return <span key={index}> {data} <button onClick={this.deleteCurrentElement} value={data}> X </button></span>
                          })
                        }
                          {this.state.temp_search_channel && this.state.temp_search_channel.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}
                          {this.state.temp_searchspeaker && this.state.temp_searchspeaker.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })
                          }
                          {
                            this.state.currentselectedoption === 'Custom Range' ? this.state.temp_finaldate_range && this.state.temp_finaldate_range.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                            }) : this.state.temp_finaldate && this.state.temp_finaldate.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                            })
                          }
                          {this.state.temp_opportunity && this.state.temp_opportunity.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}
                          {this.state.temp_journey && this.state.temp_journey.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}
                          {this.state.repId && this.state.repId.map((data, index) => {
                            return <span key={index}> {data} <button onClick={this.deleteCurrentElement} value={data}> X </button></span>
                          })}
                          {
                            (this.state.temp_listenLog[0] !== 0 || this.state.temp_listenLog[1] !== 0) && this.state.temp_listenLog && this.state.temp_listenLog.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                            })
                          }
                          {(this.state.temp_interaction_switchesLog[0] !== 0 || this.state.temp_interaction_switchesLog[1] !== 0) && this.state.temp_interaction_switchesLog && this.state.temp_interaction_switchesLog.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}

                          {(this.state.temp_no_of_questions_userLog[0] !== 0 || this.state.temp_no_of_questions_userLog[1] !== 0) && this.state.temp_no_of_questions_userLog && this.state.temp_no_of_questions_userLog.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}
                          {(this.state.temp_sentiment_polarity_repLog[0] !== 0 || this.state.temp_sentiment_polarity_repLog[1] !== 0) && this.state.temp_sentiment_polarity_repLog && this.state.temp_sentiment_polarity_repLog.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}
                          {(this.state.temp_sentiment_polarityLog[0] !== 0 || this.state.temp_sentiment_polarityLog[1] !== 0) && this.state.temp_sentiment_polarityLog && this.state.temp_sentiment_polarityLog.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}


                          {this.state.temp_followup && this.state.temp_followup.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}
                          {this.state.temp_appointment && this.state.temp_appointment.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}
                          {this.state.temp_emailmention && this.state.temp_emailmention.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}
                          {this.state.temp_pricesensitive && this.state.temp_pricesensitive.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}
                          {this.state.temp_lastmessage && this.state.temp_lastmessage.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}
                          {this.state.temp_BizMetric && this.state.temp_BizMetric.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}
                          {
                            this.state.temp_BizExpKey && this.state.temp_BizExpKey.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                            })
                          }
                          {
                            this.state.temp_BizProduct && this.state.temp_BizProduct.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                            })
                          }
                          {
                            this.state.temp_BizCompetition && this.state.temp_BizCompetition.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                            })
                          }
                          {
                            (this.state.temp_durationLog[0] !== 0 || this.state.temp_durationLog[1] !== 0) && this.state.temp_durationLog && this.state.temp_durationLog.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                            })
                          }
                          {this.state.temp_handleStats && this.state.temp_handleStats.map((data, index) => {
                            return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> X </button></span>
                          })}

                        </div>



                      </React.Fragment>
                    </div>
                    <div className="form-group">
                      <input type="text" name="collectionName" id="search-scoo" onKeyUp={this.handleEnterChange} className="form-control" onChange={this.handleCollectionName} placeholder="Add name" value={this.state.collectionName} />
                    </div>
                    {/*   <div className="form-group checkboxText checkboxContainer">
                      <input type="checkbox" name="updating" className="setHeight" /> Keep updating the collection with new data
                            <span className="virtualBox"></span>
                        </div>*/}

                  </div>

                  <div className="collectionButtons">
                    <button type="button" id="create-button" className="colorBtn btn btn-secondary" onClick={this.handleSaveToCollection} data-dismiss="modal">CREATE</button>
                    <button type="button" className="btn emptyColorBtn" data-dismiss="modal">Cancel</button>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  conversationList: state.conversationReducer.convesationList,
  collectionList: state.conversationReducer.manualCollection
})

const mapActionToProps = {
  loadConversationList: conversationAction.loadConversationList,
  star: conversationAction.starConversation,
  create: collectionAction.createCollection,
  readCollection: conversationAction.manualCollectionList,
  starOnList: conversationAction.starConversationListPage
}

export default withRouter(connect(mapStateToProps, mapActionToProps)(ConversationList));