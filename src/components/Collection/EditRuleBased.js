import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment';
import axios from 'axios';
import ReactGA from 'react-ga';
import { Link, Redirect } from 'react-router-dom'
import Pagination from 'rc-pagination';
import { ToastContainer, toast } from 'react-toastify';
import cookie from 'react-cookies';
import DatePicker from 'react-date-picker';
import { ApiConst } from '../../constants';
import { searchAction, conversationAction, collectionAction } from '../../actions'
import { routingConstants, sentimentPoints, timezoneDatePrint } from '../../constants'
import { PageView, initGA } from '../Tracking/index';
import BookMarkConversation from '../Conversation-List/BookMarkConversation';
import 'rc-slider/assets/index.css';
import Scrollbar from 'react-scrollbars-custom';
import AllFilters from '../Search/AllFilters';
class EditRuleBased extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        resetToggle: true,
        end_date: '',
        singletoggle: false,
        collectionName: "",
        keep_updating: false,
        repId: [],
        repIds: [],
        counter: 0,
        temp_opportunity: [],
        radioMobileM: '',
        radioDuration: '',
        engagement: false,
        signals: false,
        topic: false,
        inputsearch: true,
        calendarToggle: false,
        searchConditionToggle: true,
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
  componentDidUpdate(prevProps) {
    if (prevProps.repChannelId !== this.props.repChannelId) {
      if (this.state.cta !== undefined && this.state.resetToggle) {
        let REPS = []
        this.state.cta !== undefined && this.state.cta.filter.reps !== undefined && this.state.cta.filter.reps.length > 0 && this.state.cta.filter.reps.filter(data => {
          this.props.repChannelId.filter(dat => {
            return data === dat.rep_id && REPS.push({ repID: dat.rep_id, repName: dat.name })
          })
        })
        this.setState(() => ({
          repId: REPS,
        }), _ => {
          REPS.map(data => {
            document.getElementById(data.repID).disabled = true
          })
        })
      }
    }
  }
  componentWillUnmount() {
    this.props.resetSearch();
    //  this.props.retainFilters(this.state);
    //this.props.cancelApiRequest()
  }

  // resetValues = () => {
  //   this.setState(({
  //     collectionName: '',
  //     keep_updating: false,
  //     singleDateValue: '',
  //     single_end_date: '',
  //     end_date: '',
  //   }))
  // }
 
  componentDidMount() {
    const { emailid, client_id } = this.props.user
    ReactGA.ga('create', 'UA-144819158-1', { 'userId': { emailid } })
    initGA('UA-144819158-1', { standardImplementation: true });
    PageView();
    let cta = this.props.location.cta
    let val = this.getQueryStringValue("val") !== "" ? this.getQueryStringValue("val") : this.getQueryStringValue("valBant") !== "" ? this.getQueryStringValue("valBant") : this.getQueryStringValue("valConnect") !== "" ? this.getQueryStringValue("valConnect") : this.getQueryStringValue("valDuration") !== "" ? this.getQueryStringValue("valDuration") : ""
    if ((cta !== undefined && Object.keys(cta).length !== 0 && cta) || val) {
      if (val !== "") {
        cta = this.getQueryStringValue("val") !== "" ? JSON.parse(localStorage.getItem('ctaTopicTrends'))[val] : this.getQueryStringValue("valBant") !== "" ? JSON.parse(localStorage.getItem('ctaBANT'))[val] : this.getQueryStringValue("valConnect") !== "" ? JSON.parse(localStorage.getItem('ctaCONNECT'))[val] : this.getQueryStringValue("valDuration") !== "" ? JSON.parse(localStorage.getItem('ctaDURATION'))[val] : ""
        let uri = window.location.toString();
        if (uri.indexOf("?") > 0) {
          let clean_uri = uri.substring(0, uri.indexOf("?"));
          window.history.replaceState({}, document.title, clean_uri);
        }
      }
     // console.log(cta)
      let repChannel = []
      cta.filter.reps !== undefined && cta.filter.channels !== undefined && cta.filter.channels.map(data => {
        repChannel.push(data.label)
      })
      cta.filter.reps !== undefined && cta.filter.reps.length > 0 && cta.filter.channels !== undefined && this.props.loadRepChannel(repChannel, client_id, emailid)
      let channel = cta.filter.channels === undefined ? "" : cta.filter.channels.length > 1 ? [{ string: 'Channel: All Channels', type: 'channel', value: cta.filter.channels }] : [{ string: 'Channel: ' + cta.filter.channels[0].label, type: 'channel', value: cta.filter.channels[0].label }]
      let temp_finaldate_range = cta.filter.date !== undefined && cta.filter.date.from !== "" ? [{ type: 'date', string: "Custom Range: " + moment(cta.filter.date.from).format("DD/MM/YYYY") + ' - ' + moment(cta.filter.date.to).format("DD/MM/YYYY"), from: cta.filter.date.from, to: cta.filter.date.to }] : undefined;
      let topics = [];
      cta.filter.topics && cta.filter.topics.length > 0 && cta.filter.topics.map((data, index) => {
        topics.push(data)
      })
      let temp_deadAir = []
      cta.filter.interactivity !== undefined && cta.filter.interactivity.dead_air !== undefined && cta.filter.interactivity.dead_air.map(data => {
        temp_deadAir.push({ type: 'DEAD_AIR', string: 'Dead Air: ' + data, value: data })
      })
      let temp_deadairRange = []
      cta.filter.interactivity !== undefined && cta.filter.interactivity.interaction_switches !== undefined && cta.filter.interactivity.interaction_switches.map(data => {
        temp_deadairRange.push({ type: "interactivity_tricles", interactivity_tricles: data, string: "Interactivity Class: " + data })
      })
      let temp_no_of_questions_userLog = []
      cta.filter.interactivity !== undefined && cta.filter.interactivity.no_of_questions !== undefined && cta.filter.interactivity.no_of_questions.map(data => {
        temp_no_of_questions_userLog.push({ type: 'NOQ', string: 'No of Questions: ' + data.min + '-' + data.max, no_questions_min: data.min, no_questions_max: data.max })
      })
      let temp_durationLog = []
      cta.filter.interactivity !== undefined && cta.filter.interactivity.duration !== undefined && temp_durationLog.push({ type: 'duration', string: 'Duration: ' + cta.filter.interactivity.duration[0].min + '-' + cta.filter.interactivity.duration[0].max, duration_min: cta.filter.interactivity.duration[0].min, duration_max: cta.filter.interactivity.duration[0].max })
      let temp_monologue_conv = []
      cta.filter.interactivity !== undefined && cta.filter.interactivity.monologue !== undefined && cta.filter.interactivity.monologue.map(data => {
        temp_monologue_conv.push({ type: 'monologue_conv', string: 'Monologue Conversation: ' + data.min + '-' + data.max, monologue_min: data.min, monologue_max: data.max })
      })
      let temp_sentiment_polarityLog = []
      cta.filter.interactivity !== undefined && cta.filter.interactivity.sentiment !== undefined && cta.filter.interactivity.sentiment.map(data => {
        temp_sentiment_polarityLog.push({ sentiment: data, type: 'sentiment_polarity', string: 'Customer Sentiment: ' + data })
      })
      let temp_mobilemention = []
      cta.filter.interactivity !== undefined && cta.filter.interactivity.mobile_mentions !== undefined && temp_mobilemention.push({ type: 'mobile_mention', mobilemention: cta.filter.interactivity.mobile_mentions === 'any' ? '' : cta.filter.interactivity.mobile_mentions === 'yes' ? 1 : cta.filter.interactivity.mobile_mentions === 'no' ? 0 : '', string: "Mobile Mentions: " + cta.filter.interactivity.mobile_mentions, mmVal: cta.filter.interactivity.mobile_mentions });
      let temp_emailmention = []
      cta.filter.interactivity !== undefined && cta.filter.interactivity.email_mention !== undefined && temp_emailmention.push({ type: 'email-mention', emailmention: cta.filter.interactivity.email_mention === 'any' ? '' : cta.filter.interactivity.email_mention === 'yes' ? 1 : cta.filter.interactivity.email_mention === 'no' ? 0 : '', string: "Email Mentions: " + cta.filter.interactivity.email_mention, emVal: cta.filter.interactivity.email_mention });
      let temp_opportunity = []
      cta.filter.signals !== undefined && cta.filter.signals.opportunity !== undefined && temp_opportunity.push({ type: "opportunity", opportunity: cta.filter.signals.opportunity.value, string: "Opportunity: " + (cta.filter.signals.opportunity.value === '' ? 'Any' : cta.filter.signals.opportunity.value === 1 ? 'Yes' : cta.filter.signals.opportunity.value === 0 ? 'No' : ''), oppVal: cta.filter.signals.opportunity.value });
      let temp_journey = []
      cta.filter.signals !== undefined && cta.filter.signals.journey !== undefined && cta.filter.signals.journey.map(data => {
        temp_journey.push({ requestObj: 1, type: "STAGE", stageValue: data, string: "Buying Stage Journey: " + data })
      })
      let temp_bant_authority = []
      cta.filter.signals !== undefined && cta.filter.signals.bant !== undefined && Object.entries(cta.filter.signals.bant).map(data => {
        if (data[0] === 'authority') {
          temp_bant_authority.push({ bantValue: data[0], string: 'Bant: ' + data[0], type: 'BANT', requestObj: data[1] })
        } else if (data[0] === 'budget') {
          temp_bant_authority.push({ bantValue: data[0], string: 'Bant: ' + data[0], type: 'BANT', requestObj: data[1] })
        } else if (data[0] == 'need') {
          temp_bant_authority.push({ bantValue: data[0], string: 'Bant: ' + data[0], type: 'BANT', requestObj: data[1] })
        } else if (data[0] === 'timing') {
          temp_bant_authority.push({ bantValue: data[0], string: 'Bant: ' + data[0], type: 'BANT', requestObj: data[1] })
        } else if (data[0] === 'condition') {
        }
      })
      let temp_next_step = []
      cta.filter.signals !== undefined && cta.filter.signals.next_steps !== undefined && temp_next_step.push({ NSVal: cta.filter.signals.next_steps, type: 'next_steps', string: 'Next Steps: ' + (cta.filter.signals.next_steps === '' ? 'Any' : cta.filter.signals.next_steps === 1 ? 'Yes' : cta.filter.signals.next_steps === 0 ? 'No' : ''), next_steps: cta.filter.signals.next_steps })
      let temp_feedback = []
      cta.filter.feedback !== undefined && temp_feedback.push({ type: 'feedback', string: 'Feedback: ' + cta.filter.feedback, feedVal: cta.filter.feedback, feedback: cta.filter.feedback === 'any' ? '' : cta.filter.feedback === 'yes' ? 1 : cta.filter.feedback === 'no' ? 0 : '' })
      let temp_contact = []
      cta.filter.connect !== undefined && Object.entries(cta.filter.connect).map(data => {
        if (data[0] === 'contact') {
          temp_contact.push({ type: 'CONNECT', requestObj: data[1], connectValue: data[0], string: 'Connect: ' + data[0] })
        } else if (data[0] === 'gatekeeper') {
          temp_contact.push({ type: 'CONNECT', requestObj: data[1], connectValue: data[0], string: 'Connect: ' + data[0] })
        } else if (data[0] === 'ivr') {
          temp_contact.push({ type: 'CONNECT', requestObj: data[1], connectValue: data[0], string: 'Connect: ' + data[0] })
        } else if (data[0] === 'condition') {
        }
      })
      let temp_crm = []
      cta.filter.crm !== undefined && temp_crm.push({ type: 'CRM', string: 'CRM: ' + cta.filter.crm, crmVal: cta.filter.crm, CRM: cta.filter.crm === 'any' ? '' : cta.filter.crm === 'yes' ? 1 : cta.filter.crm === 'no' ? 0 : '' })
      this.setState((prevState) => ({
        collectionName: this.props.location && this.props.location.collectionName,
        tempCollectionName: this.props.location && this.props.location.collectionName,
        temp_search_channel: channel,
        temp_finaldate_range,
        topics,
        temp_deadAir,
        temp_deadairRange,
        temp_no_of_questions_userLog,
        temp_durationLog,
        temp_monologue_conv,
        temp_sentiment_polarityLog,
        temp_mobilemention,
        temp_emailmention,
        temp_opportunity,
        temp_journey,
        temp_bant_authority,
        temp_next_step,
        temp_feedback,
        temp_feedback,
        temp_contact,
        temp_crm,
        cta: cta,
        filter: cta.filter,
        pagination: cta.pagination,
      }), _ => {
        const { client_id, emailid } = this.props.user
        const { filter, pagination } = this.state;
        this.props.loadSearchList(filter, pagination, client_id, emailid);
        localStorage.removeItem('ctaTopicTrends');
        localStorage.removeItem('ctaBANT');
        localStorage.removeItem('ctaCONNECT');
        localStorage.removeItem('ctaDURATION');
      })

    } else {

    }
    if (this.props.filterState) {
      let filterState = this.props.filterState
      this.setState(prevState => ({
        ...prevState,
        ...filterState
      }), _ => {
        this.setState(() => ({
          backFilters: this.state
        }))
      })
    }
   // window.jQuery('#saveToCollection').on('show.bs.modal', this.resetValues)
  }

getQueryStringValue = (key) => {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
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

  handleSaveToCollection = async () => {
    const { client_id, emailid } = this.props.user
    let { collectionName } = this.state;
    collectionName.trim();
    if (collectionName && collectionName !== ' ') {
      const status = (this.state.collectionName !== this.state.tempCollectionName) ? await this.checkCollectionName(client_id, emailid) : false;
      //const dateExist = await this.checkDate();
      const channelExist = await this.checkChannel()
      if (channelExist && !status) {
        this.props.update({
          id: this.props.match.params.collection,
          collection: {
            name: collectionName,
            //description: "",
           // type: "rule_based",
            //end_date: '',
            // created_by: {
            //   first_name: firstname,
            //   last_name: lastname,
            //   emailid,
            //   rep_id
            // },
            // keep_updating: this.state.keep_updating,
            filter: {
              ...this.state.filter
            }
          }, client_id, emailid
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

  itemRender = (current, type, element) => {
    if (type === 'page') {
      current = current < 10 ? '0' + current : current;
      return <a>{current}</a>;
    }
    return element;
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
          window.scrollTo(0, 0)
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

  handleActivity = (e) => {
    e.preventDefault()
    const { client_id, emailid, firstname, lastname, rep_id } = this.props.user;
    const [item, id] = e.target.id.split(' ')
    const itemId = e.target.id;
    let user;
    if (item === 'star') {
      user = {
        emailid,
        first_name: firstname,
        last_name: lastname,
        rep_id
      }
      document.getElementById(itemId).style.pointerEvents = "none";
      if (!e.target.className.includes('starActive')) {
        this.setState(() => ({
          starred: true
        }), () => {
          const { starred } = this.state
          this.props.star({ client_id, emailid, starred, id, user });
        })
      } else {
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
        if (this.props.back) {
          this.props.setConversationId(this.state.conversationId)
        }
        if (!this.props.collectionList) {
          this.props.readCollection({ client_id, emailid })
        }
      })
    }
  }

  handleCheckBox = (e) => {
    if (e.target.id === 'Opportunities' && e.target.checked) {
      this.setState((prevState) => {
        return {
          opportunities: true,
          counter: prevState.counter + 1
        }
      })
    } else if (e.target.id === 'Representatives' && e.target.checked) {
      this.setState((prevState) => ({
        representatives: true,
        counter: prevState.counter + 1
      }))
    } else if (e.target.id === 'CustomerEngagement' && e.target.checked) {
      this.setState((prevState) => ({
        customerEngagement: true,
        counter: prevState.counter + 1
      }))
    }

    if (e.target.id === 'Opportunities' && !e.target.checked) {


      this.setState((prevState) => {
        return {
          opportunities: false,
          counter: prevState.counter - 1
        }
      })

    } else if (e.target.id === 'Representatives' && !e.target.checked) {
      this.setState((prevState) => ({
        representatives: false,
        counter: prevState.counter - 1
      }))
    } else if (e.target.id === 'CustomerEngagement' && !e.target.checked) {
      this.setState((prevState) => ({
        customerEngagement: false,
        counter: prevState.counter - 1
      }))
    }
  }
  handleCollectionName = (e) => {
    const name = e.target.value
    if ((/^[\s\S]{0,255}$/).test(name) && name !== ' ') {
      this.setState({ collectionName: name })
    }
  }
 

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleSortFilter = e => {
    let val = e.target.id.split('-')
    if (val[0] === 'Date ') {
      if (val[1] === ' Asc') {
        this.setState((prevState) => ({
          filter: {
            ...prevState.filter,
            sort_by: 'date',
            sort_order: 'asc'
          }
        }), _ => {
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
      }
      else {
        this.setState((prevState) => ({
          filter: {
            ...prevState.filter,
            sort_by: 'date',
            sort_order: 'desc'
          }
        }), _ => {
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
      }
    }
    else if (val[0] === 'Duration ') {
      if (val[1] === ' High to Low') {
        this.setState((prevState) => ({
          filter: {
            ...prevState.filter,
            sort_by: 'duration',
            sort_order: 'desc'
          }
        }), _ => {
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
      }
      else {
        this.setState((prevState) => ({
          filter: {
            ...prevState.filter,
            sort_by: 'duration',
            sort_order: 'asc'
          }
        }), _ => {
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
        })
      }
    }
  }

  UNSAFE_componentWillReceiveProps(prevProps) {
    this.setState(() => ({
      searchList: prevProps.searchList
    }))
  }

  getInitials = (string) => {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
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
        const { client_id, emailid } = this.props.user
        const { filter, pagination } = this.state;
        this.props.loadSearchList(filter, pagination, client_id, emailid)
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
        const { client_id, emailid } = this.props.user
        const { filter, pagination } = this.state;
        this.props.loadSearchList(filter, pagination, client_id, emailid)
      })
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
        const { client_id, emailid } = this.props.user
        const { filter, pagination } = this.state;
        this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
        case 'date':
          delete this.state.filter.date
          this.setState(() => ({
            temp_finaldate_range: [],
            filter: this.state.filter,
            reomvePills: ['DATE', '']
          }), () => {
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
          })
          break;
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
            const { client_id, emailid } = this.props.user
            const { filter, pagination } = this.state;
            this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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
          const { client_id, emailid } = this.props.user
          const { filter, pagination } = this.state;
          this.props.loadSearchList(filter, pagination, client_id, emailid)
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

  render() {
    let TOPICS = this.props.searchFilter !== undefined && this.props.searchFilter.conversation.topics
    return (
      this.props.location.cta !== undefined ?  <React.Fragment>
      <AllFilters getValues={this.getFilterValues} removePills={this.state.reomvePills} topics={this.state.topics} bool={this.state.bool} backFilters={this.state.backFilters} filter={this.state.cta !== undefined ? this.state : undefined} collection={true} />
      <div className="search-wrapp">
        <div className="custom-row">
          <div className="start-all-search">
            <div className="input-hide-search">{
              this.state.inputsearch && <React.Fragment><input type="text" onChange={this.onChangeTextSearch} onKeyUp={this.onChangeTextSearch} id="search-scoop" placeholder="Search with some keywords, numbers or phrases" autoFocus maxLength="512" />
                {/* <button onClick={() => { this.setState(() => ({ inputsearch: false })) }}> X </button> */}
                <div className="search-icon">
                  <span className="animated slideInDown"><i className="icon-search"></i></span>
                </div>
                <div className="comp-btn">
                  <label className="switch switch-left-right animated slideInUp">
                    <input onChange={this.handleSortConditionFilter} className="switch-input" type="checkbox" checked={this.state.searchConditionToggle} />
                    <span className="switch-label" data-on="OR" data-off="AND"></span>
                    <span className="switch-handle"></span>
                  </label>
                </div>
              </React.Fragment>
            }
            </div>
            <div className="searchTop ">
              {/* <button className="btn btn-secondary"> <i className="icon-plus"></i> Create Collection </button>  */}
              <div className="searchPane animated fadeInRight" onClick={() => { this.setState(() => ({ inputsearch: true })) }} >
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
                  // : <div className="search-element"> Search with some keywords, numbers or phrases</div>
                }
              </div>
              {
                ((this.state.search_strings && this.state.search_strings.length > 0) || (this.state.temp_searchspeaker && this.state.temp_searchspeaker.length > 0) || (this.state.temp_search_channel && this.state.temp_search_channel.length > 0) || (this.state.temp_durationLog && this.state.temp_durationLog.length > 0) || (this.state.temp_no_of_questions_userLog && this.state.temp_no_of_questions_userLog.length > 0) || (this.state.temp_sentiment_polarity_repLog && this.state.temp_sentiment_polarity_repLog.length > 0) || (this.state.temp_sentiment_polarityLog && this.state.temp_sentiment_polarityLog.length > 0) || (this.state.temp_journey && this.state.temp_journey.length > 0) || (this.state.temp_emailmention && this.state.temp_emailmention.length > 0) || (this.state.temp_mobilemention && this.state.temp_mobilemention.length > 0) || this.state.repId.length > 0 || (this.state.temp_opportunity && this.state.temp_opportunity.length > 0) || (this.state.temp_deadAir && this.state.temp_deadAir.length > 0) || (this.state.temp_deadairRange && this.state.temp_deadairRange.length > 0) || (this.state.temp_monologue_conv && this.state.temp_monologue_conv.length > 0) || (this.state.temp_bant_authority && this.state.temp_bant_authority.length > 0) || (this.state.temp_next_step && this.state.temp_next_step.length > 0) || (this.state.temp_feedback && this.state.temp_feedback.length > 0) || (this.state.temp_contact && this.state.temp_contact.length > 0) || (this.state.temp_crm && this.state.temp_crm.length > 0) || (this.state.temp_finaldate_range && this.state.temp_finaldate_range.length > 0) || (this.state.topics && this.state.topics.length > 0)) && <div className="saveBtnContainer animated slideInUp">
                  <button className="savebtn" data-toggle="modal" data-target="#saveToCollection" id="searchsave" onClick={this.props.back === true ? this.saveButtonClicked : undefined}>SAVE</button>
                </div>
              }
            </div>
            {
              this.props.searchList !== undefined && this.props.searchList.data !== undefined && this.props.searchList.data.length > 0 && this.props.searchList.pagination !== undefined && this.props.searchList.pagination.total_records < 1 ? <span style={{
                fontSize: '14px',
                fontWeight: 'normal',
                fontStyle: 'normal',
                fontStretch: 'normal',
                lineHeight: '1.71',
                letterSpacing: 'normal',
                color: '#8f8faa'
              }}>Showing {this.props.searchList !== undefined && this.props.searchList.pagination.total_records} of {this.props.searchList !== undefined && this.props.searchList.pagination.total_records} conversation(s)</span> : ''
            }
            {
              this.props.searchList !== undefined && this.props.searchList.pagination.total_records !== 0 && <div className="pageSortingBox">
                <div className="showingResult">
                  <span>Showing {this.props.searchList !== undefined && this.numberWithCommas(this.props.searchList.pagination.total_records)} conversation(s)</span>
                </div>
                <div className="sortingBtns">
                  {/* <div className="sortBtn condition">
                    <div className="dropdown">
                      <button type="button" className="dropdown-toggle" data-toggle="dropdown">
                        Search Condition
                      </button>
                      <div className="dropdown-menu" onClick={this.handleSortConditionFilter}>
                        <button id="OR" className="dropdown-item">OR</button>
                        <button id="AND" className="dropdown-item">AND</button>
                      </div>
                    </div>
                  </div> */}
                  <div className="sortBtn">
                    <div className="dropdown">
                      <button type="button" className="dropdown-toggle" data-toggle="dropdown">
                        Sort
                      </button>
                      <div className="dropdown-menu" onClick={this.handleSortFilter}>
                        <button id="Date - Desc" className="dropdown-item">Date - Descending</button>
                        <button id="Date - Asc" className="dropdown-item">Date - Ascending</button>
                        <button id="Duration - High to Low" className="dropdown-item">Duration - High to Low</button>
                        <button id="Duration - Low to High" className="dropdown-item">Duration - Low to High</button>
                        {/*<button id="Relevance" className="dropdown-item">Relevance</button>*/}
                      </div>
                    </div>
                  </div>
                  {/* <div className="viewBtn">
                  <div className="dropdown">
                    <button type="button" className="dropdown-toggle" data-toggle="dropdown">
                      View {this.state.counter > 0 && <span className="selectCounter">{this.state.counter}</span>}
                    </button>
                    <div className="dropdown-menu">
                      <ul>
                        <li>
                          <div className="form-group dropDownText checkboxContainer">
                            <input name="isGoing" type="checkbox" id="engagement" className="setHeight" onChange={this.handleCheckBox} checked={this.state.opportunities} />
                            <span className="checkBoxText">Engagement</span>
                            <span className="virtualBox"></span>
                          </div>
                        </li>
                        <li>
                          <div className="form-group dropDownText checkboxContainer">
                            <input name="isGoing" type="checkbox" id="signals" onChange={this.handleCheckBox} checked={this.state.representatives} />
                            <span className="checkBoxText">Signals</span>
                            <span className="virtualBox"></span>
                          </div>
                        </li>
                        <li>
                          <div className="form-group dropDownText checkboxContainer">
                            <input name="isGoing" type="checkbox" id="topics" onChange={this.handleCheckBox} checked={this.state.customerEngagement} />
                            <span className="checkBoxText">Topics</span>
                            <span className="virtualBox"></span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div> */}
                </div>
              </div>
            }
            <div className="conversation-inner-wrapp mt25">
              {
                this.props.searchList !== undefined ? this.props.searchList.data.map((conversation, index) => {
                  let reps = conversation.participants.filter((rep) => rep.speaker_label === 'rep');
                  let prosp = conversation.participants.filter((rep) => rep.speaker_label === 'prospect')
                  let newTime = conversation.date.replace("Z", "");
                  return <Link key={index} to={`${routingConstants.CONVERSATION_DETAIL}/${conversation.record_id}`}>
                    <div className={`start-conversation-row animated slideInDown ${conversation.chat_sentiment <= -0.5 ? ' color-1' : (conversation.chat_sentiment >= -0.49999 && conversation.chat_sentiment <= 0.49999) ? 'color-2' : 'color-3'}`}>
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
                            <h4 className="media-text">{reps.map((rep) => rep.first_name +" "+rep.last_name).join(', ')} </h4>
                            <div className="subText">
                              <i className={conversation.source === "text" ? 'icon-chat' : conversation.source === 'audio' ? 'icon-audio' : 'icon-video'}></i> <span className="side-text">{conversation.channel_name}</span>
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
                              <i id={"star " + conversation.record_id} className={`${conversation.starred || (this.props.starred && this.props.starred.map(data => data.record_id).includes(conversation.record_id)) ? 'icon-starred starActive' : 'icon-starred'}`} > </i>
                              <div className="tooltipText">
                                <span>{conversation.starred || this.props.starred && this.props.starred.map(data => data.record_id).includes(conversation.record_id) ? 'Remove from starred collection' : 'Add to starred collection'}</span>
                              </div>
                            </li>
                            <li>
                              <i id={"book " + conversation.record_id} className="icon-bookmark" data-toggle="modal" data-target="#bookMarkConversation"> </i>
                            </li>
                            {/* <li>
                          <i className="icon-share" onClick={this.onClick}> </i>
                      </li>
                      <li>
                        <i className="icon-delete" onClick={this.onClick}> </i>
                      </li> */}
                          </ul>
                        </div>
                        {
                          (conversation.preview && conversation.preview.reps && conversation.preview.reps.length > 0 || conversation.preview && conversation.preview.prospects && conversation.preview.prospects.length > 0) && <div className="col-lg-12">
                            <div className="transcriptsTitle col-lg-12">
                              <h5>Transcripts</h5>
                            </div>
                            <div className="row">
                              {
                                conversation.preview.reps && conversation.preview.reps.length === 0 ? '' : <div className="col-lg-6">
                                  <div className="chatBox verticalBar">
                                    <div className="recipient">
                                      <span>R</span>
                                    </div>
                                    <div className="chatSerial">
                                      {
                                        conversation.preview.reps && conversation.preview.reps.length === 0 ? '' :
                                          conversation.preview.reps.map((data, index) => {
                                            return <React.Fragment key={index}>
                                              <span className="msg">
                                                {/* {data.message.substring(0, data.start_keyword)}<b>{data.message.substring(data.start_keyword, data.end_keyword)} </b>{data.message.substring(data.end_keyword, data.message.length)} */}
                                                {
                                                  data.message
                                                }
                                              </span>
                                            </React.Fragment>
                                          })
                                      }
                                    </div>
                                  </div>
                                </div>
                              }
                              {
                                conversation.preview.prospects && conversation.preview.prospects.length === 0 ? '' : <div className="col-lg-6">
                                  <div className="chatBox">
                                    <div className="client">
                                      <span>C</span>
                                    </div>
                                    <div className="chatSerial">
                                      {
                                        conversation.preview.prospects && conversation.preview.prospects.length === 0 ? '' :
                                          conversation.preview.prospects.map((data, index) => {
                                            return <React.Fragment key={index}>
                                              <span className="msg">
                                                {
                                                  data.message
                                                }
                                                {/* {data.message.substring(0, data.start_keyword)}<b>{data.message.substring(data.start_keyword, data.end_keyword)} </b>{data.message.substring(data.end_keyword, data.message.length)} */}
                                              </span>
                                            </React.Fragment>
                                          })
                                      }
                                    </div>
                                  </div>
                                </div>
                              }
                            </div>
                          </div>
                        }
                      </div>
                      <div className="extra-div">
                        {
                          this.state.engagement && <div className="opportunities animated slideInDown">
                            <div className="row">
                              <div className="col-lg-3">
                              </div>
                            </div>
                          </div>
                        }
                        {
                          this.state.signals && <div className="representatives animated slideInDown">
                            <div className="row">
                              <div className="col-lg-3">
                              </div>
                            </div>
                          </div>
                        }
                        {
                          this.state.topic && <div className="customerEngagement animated slideInDown">
                            <div className="row">
                              {
                                conversation.topics.map((data, index) => {
                                  return <div className="col-lg-3">
                                    <h4 className="media-text"> {data.name}</h4>
                                    <div className="list-content-keyword">
                                      {data.keywords.map((name, ind) => {
                                        return <div className="colmn-highlightedText" key={ind}>{name} </div>
                                      })}
                                    </div>
                                  </div>
                                })
                              }
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </Link>
                }) :
                  <React.Fragment>
                    {/*!this.props.location.cta && <div className="page-title-row">
                        <div className="collectionTitle">
                          <h2 className="page-title">
                            <span className="titleIcon">
                              <i className="icon-comparison"></i>
                            </span>
                            Recently saved collection
                        </h2>
                          <div className="viewAllBtn">
                            <Link to={
                              {
                                pathname: "/collection/starred",
                                state: {
                                  name: 'Starred Conversation'
                                }
                              }
                            }>View All Collection</Link>
                          </div>
                        </div>
                          </div>*/}
                    {/*                      <div className="search-inner-wrapp mt25">
                        <div className="collectionGrid">
                          {this.props.recentlySavedCollection && this.props.recentlySavedCollection.map((data, index) => {
                            return <Link to={
                              {
                                pathname: "/collection/" + data.id,
                                state: {
                                  name: data.name
                                }
                              }
                            } key={index}><div className="gridd">
                                <div className="gridBox animated fadeInUp">
                                  <h4>{data.name}</h4>
                                </div>
                              </div>
                            </Link>
                          })}
                        </div>
                        </div>*/}
                    <div className="emptyBox">
                      <div className="msgImage">
                        <img src="/static/images/search-collection-empty.svg" alt="msgImage" />
                      </div>
                      <div className="msgText">
                        {/* <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. </p>*/}
                      </div>
                    </div>
                  </React.Fragment>
              }
              {
                this.props.searchList !== undefined && this.props.searchList.data.length > 0 ? <div className="show-conversation-row mt30">
                  <div className="dropdown show">
                    <button className="btn custom-dropdown dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.pagination.itemsCountPerPage} Results </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuLink" onClick={this.filter}>
                      <button className="dropdown-item" value={10}>10 Results</button>
                      <button className="dropdown-item" value={20}>20 Results</button>
                      <button className="dropdown-item" value={30}>30 Results</button>
                      <button className="dropdown-item" value={50}>50 Results</button>
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
                </div> : this.props.searchList !== undefined && <div className="emptyBox">
                  <div className="msgImage">
                    <img src="/static/images/search-empty.svg" alt="search-empty" />
                  </div>
                  <div className="msgText">
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      {
        this.props.back ? <BookMarkConversation convId={this.state.conversationId && this.state.conversationId} collectionList={this.props.collectionList && this.props.collectionList} /> : ''
      }
      {
        this.props.back ? <div className="modal" id="saveToCollection">
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
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                            })
                          }
                          {
                            this.state.temp_finaldate_range && this.state.temp_finaldate_range.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                            })
                          }
                          {
                            this.state.repId && this.state.repId.map((data, index) => {
                              return <span key={index}> {data.repName} <button onClick={this.deleteCurrentElement} value={data.repId}> <i className="icon-close"></i> </button></span>
                            })
                          }
                          {
                            this.state.topics && this.state.topics.map((data, index) => {
                              return data.value && data.value.map(dat => {
                                return <span key={Math.random()}> {data.name + ": " + dat} <button onClick={this.deleteCurrentElement} value={data.name + dat}> <i className="icon-close"></i> </button></span>
                              })
                            })
                          }
                          {
                            this.state.temp_deadAir && this.state.temp_deadAir.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                            })
                          }
                          {
                            this.state.temp_deadairRange && this.state.temp_deadairRange.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                            })
                          }
                          {
                            this.state.temp_no_of_questions_userLog && (this.state.temp_no_of_questions_userLog[0] !== 0 || this.state.temp_no_of_questions_userLog[1] !== 0) && this.state.temp_no_of_questions_userLog && this.state.temp_no_of_questions_userLog.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                            })}
                          {
                            this.state.temp_durationLog && (this.state.temp_durationLog[0] !== 0 || this.state.temp_durationLog[1] !== 0) && this.state.temp_durationLog && this.state.temp_durationLog.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                            })
                          }
                          {
                            this.state.temp_monologue_conv && this.state.temp_monologue_conv.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                            })
                          }
                          {
                            this.state.temp_sentiment_polarityLog && (this.state.temp_sentiment_polarityLog[0] !== 0 || this.state.temp_sentiment_polarityLog[1] !== 0) && this.state.temp_sentiment_polarityLog && this.state.temp_sentiment_polarityLog.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                            })
                          }
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
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                            })
                          }
                          {
                            this.state.temp_bant_authority && this.state.temp_bant_authority.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
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
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                            })
                          }
                          {
                            this.state.temp_crm && this.state.temp_crm.map((data, index) => {
                              return <span key={index}> {data.string} <button onClick={this.deleteCurrentElement} value={data.type}> <i className="icon-close"></i> </button></span>
                            })
                          }
                        </div>
                      </React.Fragment>
                    </div>
                    <div className="form-group">
                      <input type="text" name="collectionName" id="search-scoo" className="form-control" onKeyUp={this.handleEnterChange} onChange={this.handleCollectionName} placeholder="Add name" value={this.state.collectionName} />
                    </div>
                    {/* <div className="form-group checkboxText checkboxContainer">
                      <input type="checkbox" name="updating" className="setHeight" onChange={this.handleCollectionUpdate} checked={this.state.keep_updating} /> Keep updating the collection with new data
                            <span className="virtualBox"></span>
                    </div> */}
                    {this.state.keep_updating && <div className="form-group">
                      <input type="text" name="endDate" className="form-control" value={this.state.singleDateValue} placeholder="Select End Date (Optional)" onClick={this.singleClickDate} />
                      {
                        this.state.singletoggle && <React.Fragment>
                          <div className="SingleDatePicker">
                            <DatePicker
                              isOpen={true} //default open state
                              onChange={this.onChangeSingleDate}
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
                    </div>
                    }
                  </div>
                  <div className="collectionButtons">
                      <button type="button" id="create-button" className="colorBtn btn btn-secondary" onClick={this.handleSaveToCollection} data-dismiss="modal">UPDATE</button>
                      <button type="button" className="btn emptyColorBtn" data-dismiss="modal">CANCEL</button>
                    </div>

                </div>
              </div>
            </div>
          </div>
        </div> : ''
      }
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
    </React.Fragment > : <Redirect to={routingConstants.COLLECTION + "/starred"} />
    )
  }
}

EditRuleBased.defaultProps = {
  back: true
};

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    searchList: state.searchReducer.searchList,
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
    search_output: state.searchReducer.search_output,
    starred: state.collectionReducer.starredConversation,
    collectionList: state.conversationReducer.manualCollection
  }
}

const mapActionToProps = {
  loadSearchList: searchAction.loadSearchList,
  loadSearchFilter: searchAction.searchFilter,
  loadRepChannel: searchAction.rep_by_channel_id,
  star: conversationAction.starConversation,
  readCollection: conversationAction.manualCollectionList,
  create: collectionAction.createCollection,
  update: collectionAction.updateCollection,
  resetSearch: searchAction.resetSearch,

}

export default connect(mapStateToProps, mapActionToProps)(EditRuleBased)