import React, { Component } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import Scrollbar from 'react-scrollbars-custom'
import momentDurationFormatSetup from 'moment-duration-format';
import { MentionsInput, Mention } from 'react-mentions'
import { withRouter } from 'react-router-dom';
import { conversationAction, collectionAction } from '../../actions'
import BookMarkConversation from '../Conversation-List/BookMarkConversation'
import './ConversationDetail.css'
import { PageView, initGA } from '../Tracking/index';
import ReactGA, { set } from 'react-ga';
import VideoPlayer from '../Conversation-Detail/VideoPlayer'
import { timezoneDatePrint } from '../../constants'
import wordCloud from "highcharts/modules/wordcloud.js";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
wordCloud(Highcharts);


momentDurationFormatSetup(moment);
class ConversationDetail extends Component {
  val = 0
  constructor(props) {
    super(props)
    this.child = React.createRef();
    this.state = {
      type: 'basic',
      visibleText: '',
      invisibleText: '',
      transcriptVisibleText: '',
      transcriptInvisibleText: '',
      // FeedbackvisibleText: '',
      // FeedbackInvisibleText: '',
      id: [],
      value: '',
      commentInput: false,
      transcriptInput: false,
      searchInputTranscript: '',
      searchInputComment: '',
      toggle: true,
      handleCustomerDiv: false,
      handleContactDiv: false,
      handleValue: '',
      totalWidth: 0,
      count: [],
      ids: [],
      countWord: true,
      showComment: false,
      showTranscript: false,
      showTransMessage: false,
      val: 0,
      tagged: [],
      wordcounter: 0,
      wordCount: 0,
      commentCount: 0,
      commentcounter: 0,
      referenceSeq: '',
      "feedback": {
        "type": "basic",
        "message": '',
        "datetime": moment().format("YYYY-MM-DDTHH:mm:ss") + "Z"
      },
      reply: false,
      timeline: [],
      interactionChecked: [],
      colors: ['#fff', '#38A7ED', '#0BD2C7', '#F34646', '#FDBB4E', '#8E95C2', '#169ECA', '#8e44ad', '#d35400', '#27ae60', '#2c3e50', '#6F1E51', '#ED4C67', '#C4E538', '#0652DD', '#EE5A24', '#f8c291'],
      flagTimeline: [],
      colorCount: 0,
    }
  }

  componentDidMount() {
    const { client_id, emailid } = this.props.user
    ReactGA.ga('create', 'UA-144819158-1', { 'userId': { emailid } })
    initGA('UA-144819158-1', { standardImplementation: true });
    PageView();
    this.props.loadConversationDetail(this.props.match.params.id, client_id, emailid)
    this.props.loadHierarchy({ client_id, emailid })
    localStorage.removeItem('record');
    window.scrollTo(0, 0)
  }

  componentWillUnmount() {
    this.props.remove();
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
          this.props.star({ client_id, emailid, starred, id, user, source: "detail" });
        })
      } else {
        this.setState(() => ({
          starred: false
        }), () => {
          const { starred } = this.state
          this.props.star({ client_id, emailid, starred, id, user, source: "detail" });
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
  onChangeTextSearchTranscript = (e) => {

    const val = e.target.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    this.setState(() => ({
      searchInputTranscript: val,
    }), () => {
      if (document.querySelectorAll(".msgNode .msg span div .totalWordCount").length > 0) {
        var elmnt = document.querySelectorAll(".msgNode .msg span div .totalWordCount");
        elmnt[0].scrollIntoView({ block: "end" });
      }
      this.setState(() => ({
        wordCount: document.querySelectorAll(".msgNode .msg span div .totalWordCount").length
      }))

    })

  }

  onChangeTextSearchComment = (e) => {
    const val = e.target.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    this.setState(() => ({
      searchInputComment: val,
    }), () => {
      if (document.querySelectorAll(".msgNode .msg span div .totalWordCount").length > 0) {
        var elmnt = document.querySelectorAll(".msgNode .msg span div .totalWordCount");
        elmnt[0].scrollIntoView({ block: "end" });
      }
      this.setState(() => ({
        commentCount: document.querySelectorAll(".msgNode .msg span div .totalWordCount").length
      }))

    })
  }


  boldString = (str, find) => {
    const re = new RegExp(find, 'gi')
    if (str.match(re)) {
      const splitStr = str.split(re)
      const replace2 = str.match(re)
      const final = splitStr && splitStr.map((value, index) => (splitStr[index] + (replace2[index] !== undefined || replace2[index] !== null ? "<div class='totalWordCount'>" + replace2[index] + "</div>" : '')))
      const final2 = final.toString()
      const final3 = final2.substring(0, final2.length - 26)
      const FF = final3.replace(/,/gi, '')
      return { __html: FF }

    }
    else
      return { __html: str }
  }

  titleCase = (str) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  handleWordCloud = () => {
    let word = []
    this.props.conversationDetail.analysis.summary.map((data) => {
      word.push({ name: this.titleCase(data.item), weight: data.count })
    })

    let options = {
      title: {
        text: null
      },
      credits: {
        enabled: false
      },
      xAxis: {
        visible: false
      },
      series: [
        {
          // point: {
          //   cursor: 'pointer',
          //   events: {
          //     click: function () {
          //       window.jQuery("#searchCloud").modal('show');
          //     }
          //   }
          // },
          type: "wordcloud",
          data: word
        }
      ]
    };

    return options
  }

  componentDidUpdate(prevProps) {
    localStorage.removeItem('conversationPage');
    window.jQuery('.roundIcon span').tooltip()
    window.jQuery('.breadcum.rewrap ul li').tooltip()
    window.jQuery('.transcript-bar .icon-chat').tooltip()

    if (prevProps.conversationDetail !== this.props.conversationDetail) {
      if (this.props.conversationDetail.analysis.summary !== undefined && this.props.conversationDetail.analysis.summary.length > 0) {
        let options = this.handleWordCloud()
        this.setState(() => ({
          options
        }))
      }

    }

    if (this.props.conversationDetail !== undefined && (this.props.conversationDetail.channel_id === 'telephony' || this.props.conversationDetail.channel_id === 'online_meeting_tools')) {
      if (document.getElementsByClassName('analysis-legend')[0].children.length > 0) {
        document.getElementsByClassName('vjs-progress-control')[0].classList.add('set-top-196');
      }
      else if (document.getElementsByClassName('analysis-legend')[0].children.length === 0) {
        document.getElementsByClassName('vjs-progress-control')[0].classList.remove('set-top-196');
      }
    }
    this.state.flagTimeline.length > 0 && window.jQuery('.analysis-legend .tag').each(function () {
      let title = []
      let arrF = []
      let arr = []
      let distinct = (value, index, self) => {
        return self.indexOf(value) === index;
      }
      title.push(this.title)
      window.jQuery('.legend.Black').each(function () {
        arr.push(this.title)
        arrF = arr.filter(distinct)
      })
      // console.log(title, arrF)
      title.map((data) =>
        arrF.map(dat => (data === dat && window.jQuery(this).children().length < 2) ? window.jQuery(this).append('<svg class= "hide-flag" height="18px" style={{ fill: data.style }} viewBox="-94 0 448 448" width="18px" xmlns="http://www.w3.org/2000/svg"><path d="m260.039062 120-228.039062-99.769531v199.539062zm0 0" /><path d="m0 0h16.007812v448h-16.007812zm0 0" /></svg>') : '')
      )
      if (arrF.length === 0) {
        window.jQuery('.hide-flag').remove()
      }
    })

    // var a = window.jQuery('.conversationTimelineWrapBody.mt100 .timelineList li').length
    // window.jQuery('.video-js .vjs-progress-holder .vjs-play-progress span.runningBar').css('height',a*5.2+'rem')

    if (prevProps.conversationDetail !== this.props.conversationDetail) {
      if (this.state.feedback_id !== "" && this.state.showReplies) {
        let id = this.state.feedback_id
        let feed = this.props.conversationDetail.feedback.filter((data) => {
          return data.id === id
        })
        this.setState(() => ({
          feedbackMessage: {
            parentMsg: feed[0].seq ? this.props.conversationDetail && this.props.conversationDetail.transcripts[feed[0].seq] !== undefined && this.props.conversationDetail.transcripts[feed[0].seq].message : undefined,
            by: feed[0].commented_by.first_name,
            id: feed[0].id,
            msg: feed[0].message,
            stages: feed[0].stages,
            time: feed[0].datetime,
            emailid: feed[0].commented_by.emailid
          },
          replies: feed[0].thread
        }))
      }

      const signals = Object.keys(this.props.conversationDetail !== undefined && this.props.conversationDetail.analysis.signals).map((data) => {
        return [(data), this.props.conversationDetail.analysis.signals[data]];
      })
      let temp = []
      signals.map((data) => {
        data[1].label === 'BANT' ? data[1].values.map((dat) => {
          this.setState(() => ({
            [dat.name]: false
          }))
        }) : data[1].label === 'Next Steps' ?

            this.setState(() => ({
              'Next Steps': false
            })) : data[0] === "opportunity" &&
            temp.push(data[1].state)
        temp.map((Da) => {
          this.setState(() => ({
            [Da]: false
          }))
        })
      })
      const interaction = Object.keys(this.props.conversationDetail !== undefined && this.props.conversationDetail.analysis.interaction).map((data) => {
        return [(data), this.props.conversationDetail.analysis.interaction[data]];
      })
      let temp1 = []
      interaction.map((data) => {
        data[1].messages && temp1.push(data[0])
        temp1.map((dat) => {
          this.setState(() => ({
            [dat]: false
          }))
        })
      })
      const topics = Object.keys(this.props.conversationDetail !== undefined && this.props.conversationDetail.analysis.topics).map((data) => {
        return [(data), this.props.conversationDetail.analysis.topics[data]];
      })

      let temp2 = []
      topics.map((data) => {
        data[1].messages && temp2.push(data[1].name)
        temp2.map((dat) => {
          this.setState(() => ({
            [dat]: false
          }))
        })
      })

    }

    if (prevProps.starred !== this.props.starred) {
      const { client_id, emailid } = this.props.user
      this.props.loadStarred({ client_id, emailid })
    }
    if (this.state.countWord !== false) {
      this.setState(() => ({
        countWord: false,
      }))
    }
    if (prevProps.userHierarchy !== this.props.userHierarchy) {
      this.setState(({ suggestions: this.props.userHierarchy }))
    }

    if (prevProps.match.params.id !== this.props.match.params.id) {
      const { client_id, emailid } = this.props.user
      this.props.loadConversationDetail(this.props.match.params.id, client_id, emailid)
    }

    let message_id = this.props.location.data
    if (((prevProps.conversationDetail !== this.props.conversationDetail) || (prevProps.location.data !== this.props.location.data)) && message_id) {

      this.setState(({ showComment: true }), _ => {                         // NCSCOP-223
        setTimeout(() => {
          if (message_id && document.getElementById(message_id)) {
            document.getElementById(message_id).scrollIntoView({ behavior: "smooth" })
          }
        }, 1100)
      })
    }

  }

  postComment = () => {

    const { client_id, emailid, firstname, lastname, rep_id } = this.props.user;
    let first_name = firstname
    let last_name = lastname
    const ConversationId = this.props.match.params.id;
    let feedback;
    this.setState(() => ({
      type: (this.state.reply || this.state.showReplies) ? 'thread' : (this.state.tagged.length > 0 && this.state.referenceSeq === '') ? 'tagged' : this.state.referenceSeq ? 'reference' : 'basic'
    }), () => {
      switch (this.state.type) {
        case 'basic':
          feedback = {
            type: this.state.type,
            message: this.state.visibleText.trim(),
            datetime: moment().format("YYYY-MM-DDTHH:mm:ss") + "Z"
          }
          break;
        case 'tagged':
          feedback = {
            type: this.state.type,
            message: this.state.invisibleText.trim(),
            datetime: moment().format("YYYY-MM-DDTHH:mm:ss") + "Z",
            tagged_user: this.state.tagged
          }
          break;
        case 'thread':
          feedback = {
            type: this.state.type,
            feedback_id: this.state.feedback_id,
            message: this.state.tagged.length > 0 ? this.state.invisibleText.trim() : this.state.visibleText.trim(),
            datetime: moment().format("YYYY-MM-DDTHH:mm:ss") + "Z",
            tagged_user: this.state.tagged.length > 0 ? this.state.tagged : undefined
          }
          break;
        case 'reference':
          let tempRef = []
          tempRef.push({ seq: this.state.referenceSeq, message: this.state.transcriptMessageText })
          feedback = {
            type: this.state.type,
            seq: this.state.referenceSeq,
            message: this.state.tagged.length > 0 ? this.state.transcriptInvisibleText.trim() : this.state.transcriptVisibleText.trim(),
            datetime: moment().format("YYYY-MM-DDTHH:mm:ss") + "Z",
            ...(this.state.tagged.length > 0 && { tagged_user: this.state.tagged }),
            // tagged: this.state.tagged.length > 0 ? this.state.tagged :undefined
          }
          this.setState(({ tempRef }))
      }
      if ((/^\S/).test(feedback.message)) {
        this.props.postComment({ client_id, emailid, id: ConversationId, feedback, first_name, last_name, rep_id })
        this.setState(({
          visibleText: '',
          invisibleText: '',
          plainText: '',
          transcriptVisibleText: '',
          transcriptInvisibleText: '',
          transcriptPlainText: '',
          tagged: [],
          reply: false,
          //  feedback_id: '',
          showReplies: false,
          referenceSeq: '',
          showTransMessage: false
        }))
        if (this.state.showReplies === true) {
          this.setState(() => ({
            showReplies: true
          }))
        }
      }
    })
  }

  replyComment = (e) => {
    e.preventDefault();
    let messageText = e.currentTarget.value;
    let feedback_id = e.currentTarget.id
    this.setState(() => ({
      reply: true,
      type: 'thread',
      messageText,
      feedback_id
    }))
  }

  closeReply = (e) => {
    e.preventDefault();
    if (e.target.id === 'transcriptMessageText') {
      this.setState(({
        referenceSeq: '',
        transcriptMessageText: '',
        feedback_id: '',
        type: 'basic',
        transcriptPlainText: '',
        transcriptVisibleText: '',
        transcriptInvisibleText: '',
        showTransMessage: false
      }))
    } else {
      this.setState(() => ({
        reply: false,
        type: 'basic',
        messageText: '',
        feedback_id: '',
      }))
    }
  }

  setComment = (e, newValue, newPlainTextValue, mentions) => {

    let visibleText = e.target.value;
    let invisibleText = '';
    let removeAtRate = '';
    let addParentheses = '';
    let tagged = []
    if (mentions.length === 0) {
      this.setState(({
        tagged: [],
        type: 'basic'
      }))
    }
    if (mentions.length > 0) {
      tagged = mentions.map((data) => {
        let name = data.display.replace(/@/, '').trim().split(" ")
        return {
          first_name: name[0],
          last_name: name[1],
          emailid: data.id
        }
      })
      removeAtRate = visibleText.replace(/@\[[\w]*\s[\w]*\]/g, '')
      addParentheses = removeAtRate.replace(/[(]/g, '{id:');
      addParentheses = addParentheses.replace(/[)]/g, '}');
      invisibleText += addParentheses + " "
      this.setState(({
        type: 'tagged',
        tagged: [
          ...tagged
        ]
      }))
    }
    this.setState(({
      visibleText,
      invisibleText,
      plainText: newPlainTextValue,
    }))
  }
  setTranscriptComment = (e, newValue, newPlainTextValue, mentions) => {
    let transcriptVisibleText = e.target.value;
    let transcriptInvisibleText = '';
    let removeAtRate = '';
    let addParentheses = '';
    let tagged = []
    if (mentions.length === 0) {
      this.setState(({
        tagged: [],
        type: 'basic'
      }))
    }
    if (mentions.length > 0) {
      tagged = mentions.map((data) => {
        let name = data.display.replace(/@/, '').trim().split(" ")
        return {
          first_name: name[0],
          last_name: name[1],
          emailid: data.id
        }
      })
      removeAtRate = transcriptVisibleText.replace(/@\[[\w]*\s[\w]*\]/g, '')
      addParentheses = removeAtRate.replace(/[(]/g, '{id:');
      addParentheses = addParentheses.replace(/[)]/g, '}');
      transcriptInvisibleText += addParentheses + " "
      this.setState(({
        type: 'tagged',
        tagged: [
          ...tagged
        ]
      }))
    }
    this.setState(({
      transcriptVisibleText,
      transcriptInvisibleText,
      transcriptPlainText: newPlainTextValue,
    }))
  }

  transcriptRenderData = (value) => {
    let data = this.props.userHierarchy && this.props.userHierarchy.map(user => ({ display: user.name, id: user.emailid }))

    let suggestions = data && data.filter(val => val.display.toLowerCase().includes(value));
    return suggestions
  }

  renderData = (value) => {
    let data = this.props.userHierarchy && this.props.userHierarchy.map((user) => {
      return { display: user.name, id: user.emailid }
    })
    let suggestions = data && data.filter(val => val.display.toLowerCase().includes(value));
    return suggestions
  }

  handleWordTraverse = (e) => {
    e.preventDefault();
    var elemlength = document.querySelectorAll(".msgNode .msg span div .totalWordCount").length;
    if (elemlength !== 0) {
      this.setState(() => ({
        wordCount: document.querySelectorAll(".msgNode .msg span div .totalWordCount").length
      }))
      switch (e.target.id) {
        case 'downward':
          if (elemlength > this.state.wordcounter) {
            this.setState((prevState) => ({
              wordcounter: prevState.wordcounter + 1
            }), () => {

            })
            elemlength > this.state.wordcounter && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[this.state.wordcounter].classList.add('active')
            this.state.wordcounter > 0 && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[this.state.wordcounter - 1].classList.remove('active')
            var elmnt = document.querySelectorAll(".msgNode .msg span div .totalWordCount");
            elmnt[this.state.wordcounter].scrollIntoView({ behavior: "smooth", block: "end" });
          }
          break;

        case 'upward':
          if (this.state.wordcounter > 0) {
            this.setState((prevState) => ({
              wordcounter: prevState.wordcounter - 1
            }), () => {
              document.querySelectorAll(".msgNode .msg span div .totalWordCount")[this.state.wordcounter] !== undefined && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[this.state.wordcounter].classList.add('active')
              this.state.wordcounter > 0 && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[this.state.wordcounter + 1] !== undefined && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[this.state.wordcounter + 1].classList.remove('active')
              this.state.wordcounter === 0 && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[1] !== undefined && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[1].classList.remove('active')
              var elmnt = document.querySelectorAll(".msgNode .msg span div .totalWordCount");
              elmnt[this.state.wordcounter].scrollIntoView({ behavior: "smooth", block: "end" });
            })

          }
          break;
      }
    }
  }

  handleCommentTraverse = (e) => {
    e.preventDefault();
    var elemlength = document.querySelectorAll(".msgNode .msg span div .totalWordCount").length;
    if (elemlength !== 0) {
      this.setState(() => ({
        commentCount: document.querySelectorAll(".msgNode .msg span div .totalWordCount").length
      }))
      switch (e.target.id) {
        case 'downward':
          if (elemlength > this.state.commentcounter) {
            this.setState((prevState) => ({
              commentcounter: prevState.commentcounter + 1
            }), () => {

            })
            elemlength > this.state.commentcounter && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[this.state.commentcounter].classList.add('active')
            this.state.commentcounter > 0 && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[this.state.commentcounter - 1].classList.remove('active')
            var elmnt = document.querySelectorAll(".msgNode .msg span div .totalWordCount");
            elmnt[this.state.commentcounter].scrollIntoView({ behavior: "smooth", block: "end" });
          }
          break;

        case 'upward':
          if (this.state.commentcounter > 0) {
            this.setState((prevState) => ({
              commentcounter: prevState.commentcounter - 1
            }), () => {
              document.querySelectorAll(".msgNode .msg span div .totalWordCount")[this.state.commentcounter] !== undefined && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[this.state.commentcounter].classList.add('active')
              this.state.wordcounter > 0 && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[this.state.commentcounter + 1] !== undefined && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[this.state.commentcounter + 1].classList.remove('active')
              this.state.commentcounter === 0 && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[1] !== undefined && document.querySelectorAll(".msgNode .msg span div .totalWordCount")[1].classList.remove('active')
              var elmnt = document.querySelectorAll(".msgNode .msg span div .totalWordCount");
              elmnt[this.state.commentcounter].scrollIntoView({ behavior: "smooth", block: "end" });
            })

          }
          break;
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
  handleRepresentative = (e) => {
    if (e.target.id === 'no_of_question') {
      this.setState(() => ({
        handleRepresentative: true,
        toggle: false
      }))
    }
    if (e.target.id === 'back') {
      this.setState(() => ({
        handleRepresentative: false,
        toggle: true,
        referenceSeq: '',
        transcriptMessageText: '',
        feedback_id: '',
        type: 'basic',
        transcriptPlainText: '',
        transcriptVisibleText: '',
        transcriptInvisibleText: '',
        showTransMessage: false
      }))
    }
  }
  getAudioTrack = (e) => {
    let currentTime = e.target.id
    this.setState(() => ({
      CurrentTime: currentTime
    }), () => {
      this.child.current.skipTime();
      document.getElementsByClassName('upDown1')[0].style.display = "flex"
      window.jQuery('.vjs-play-progress.vjs-slider-bar').append('<span class="runningBar"></span>')
      let timelineLength = window.jQuery('.conversationTimelineWrapBody .timelineList li').length
      window.jQuery('.video-js .vjs-progress-holder .vjs-play-progress span.runningBar').css('height', timelineLength * 5.2 + 'rem')
      window.jQuery('.video-js .vjs-progress-control .vjs-mouse-display').css('height', timelineLength * 5.2 + 'rem')
    })
  }

  scrollTranscript = (e) => {
    e.preventDefault()
    let id = e.target.id
    this.setState(({ showTranscript: true }), _ => {
      var elmnt = document.querySelectorAll(".msgNode .msg span div");
      setTimeout(_ => {
        if (id && (id <= elmnt.length)) {
          elmnt[id].scrollIntoView({ behavior: "smooth", block: "end" });
        }
        else {
          elmnt[0].scrollIntoView({ behavior: "smooth", block: "end" })
        }
      }, 1000)

    })
  }

  handleReferenceComment = (e) => {
    let referenceSeq = e.target.id;
    let transcriptMessageText = e.target.getAttribute('data-message');
    this.setState(({ referenceSeq, transcriptMessageText, showTransMessage: true }))
  }

  showCommentBar = (e) => {
    if (e.target.id === 'transcripts') {
      this.setState(({ showTranscript: true, showComment: false }));
      if (e.target.className === 'icon-monologue open') {
        if (document.getElementsByClassName('transcript-bar')[0]) {
          document.getElementsByClassName('transcript-bar')[0].classList.remove('slideInRight')
          document.getElementsByClassName('transcript-bar')[0].classList.add('slideOutRight')
        }
        setTimeout(() => {
          this.setState(({ showTranscript: false }));
        }, 1000)
      }
    } else if (e.target.id === "comment-level") {

      if (e.target.className === "icon-chat open") {
        if (document.getElementsByClassName('comment-bar')[0] !== undefined) {
          document.getElementsByClassName('comment-bar')[0].classList.remove('slideInRight')
          document.getElementsByClassName('comment-bar')[0].classList.add('slideOutRight')
        }
        setTimeout(() => {
          this.setState(({ showComment: false }));
        }, 1000)

      } else {
        this.setState(({ showTranscript: true, showComment: true }), () => {
          document.getElementById('comment-level-box').style.right = "360px";
          document.getElementById('comment-level-box').getElementsByClassName("close-comment-bar")[0].style.display = 'none'
          document.getElementById('transcript-wrapper').getElementsByClassName("close-comment-bar")[0].classList.add('transcript-comment-box')
          document.getElementById('transcript-wrapper').getElementsByClassName("icon-close")[0].classList.add('transcript-comment-box-close')

        });
      }

    }
    else {

      if (e.target.className === "icon-chat open") {
        if (document.getElementsByClassName('comment-bar')[0] !== undefined) {
          document.getElementsByClassName('comment-bar')[0].classList.remove('slideInRight')
          document.getElementsByClassName('comment-bar')[0].classList.add('slideOutRight')
        }
        setTimeout(() => {
          this.setState(({ showComment: false }));
        }, 1000)

      } else {
        this.setState(({ showComment: true, showTranscript: false }), () => {
          document.getElementById('comment-level-box').style.right = "0px";
          document.getElementById('comment-level-box').getElementsByClassName("close-comment-bar")[0].style.display = 'block';
        })
      }
    }
  }

  closeCommentBar = (e) => {
    if (document.getElementsByClassName('close-comment-bar')[0].classList.contains('transcript-comment-box')) {

      if (document.getElementsByClassName('comment-bar')[0] !== undefined) {
        document.getElementsByClassName('comment-bar')[0].classList.remove('slideInRight')
        document.getElementsByClassName('comment-bar')[0].classList.add('slideOutRight')
        setTimeout(() => {
          if (document.getElementsByClassName('transcript-bar')[0]) {
            document.getElementsByClassName('transcript-bar')[0].classList.remove('slideInRight')
            document.getElementsByClassName('transcript-bar')[0].classList.add('slideOutRight')
          }
        }, 1000)
        setTimeout(() => {
          this.setState(({ showTranscript: false, showComment: false }))
        }, 1800)
      } else {
        if (document.getElementsByClassName('transcript-bar')[0]) {
          document.getElementsByClassName('transcript-bar')[0].classList.remove('slideInRight')
          document.getElementsByClassName('transcript-bar')[0].classList.add('slideOutRight')
        }
        setTimeout(() => {
          this.setState(({ showTranscript: false, showComment: false }))
        }, 1000)
      }

    }
    if (e.target.id === 'transcript-bar' && document.getElementsByClassName('transcript-comment-box-close')[0] === undefined) {
      document.getElementsByClassName('transcript-bar')[0].classList.remove('slideInRight')
      document.getElementsByClassName('transcript-bar')[0].classList.add('slideOutRight')

      setTimeout(() => {
        if (document.getElementsByClassName('transcript-bar')[0]) {
          document.getElementsByClassName('transcript-bar')[0].classList.remove('slideOutRight')
          document.getElementsByClassName('transcript-bar')[0].classList.add('slideInRight')
          this.setState(({
            showTranscript: false, showComment: false, transcriptPlainText: '',
            transcriptVisibleText: '',
            transcriptInvisibleText: '',
            showTransMessage: false
          }))
        }
      }, 1000)

    } else {
      if (document.getElementsByClassName('transcript-comment-box-close')[0] === undefined) {
        document.getElementsByClassName('comment-bar')[0].classList.remove('slideInRight')
        document.getElementsByClassName('comment-bar')[0].classList.add('slideOutRight')
        setTimeout(() => {
          if (document.getElementsByClassName('comment-bar')[0]) {
            document.getElementsByClassName('comment-bar')[0].classList.remove('slideOutRight')
            document.getElementsByClassName('comment-bar')[0].classList.add('slideInRight')
            this.setState(({ showComment: false, showTranscript: false }))
          }
        }, 1000)
      }
    }

  }
  checkEnter = e => {
    if (e.charCode === 13 && (this.state.transcriptPlainText || this.state.visibleText || this.state.FeedbackPlainText) && e.shiftKey === false) {
      this.postComment()
      // if (document.getElementById('comment-scroll') !== null) {
      //   setTimeout(() => {
      //     let id = document.getElementById('comment-scroll').getElementsByClassName('transcriptChat')[0].lastElementChild.id
      //     document.getElementById(id).scrollIntoView({ behavior: "smooth", block: 'end' })
      //   }, 1000)
      // }

    }
    if (e.charCode === 13 && (!this.state.transcriptPlainText || !this.state.visibleText) && e.shiftKey === false) {
      e.preventDefault()
    }
  }
  handleSignalToggle = (e) => {
    let signal = e.target.id
    this.setState((prevState) => {
      return { [signal]: !prevState[signal] };
    }, () => {
      document.getElementsByClassName('msg-boundary ' + signal.replace(" ", "")).length > 3 && window.jQuery('.msg-boundary.' + signal.replace(" ", "")).each(function () {
        window.jQuery('.msg-boundary.' + signal.replace(" ", "") + ":nth-child(n+4):nth-last-child(n+2)").css("display", "none")
      })
    })
  }
  handleTimelineToggle = (e) => {
    e.preventDefault();
    let val = e.target.value
    let repName = e.target.getAttribute('data-type');
    let IC = this.state.interactionChecked
    let FT = this.state.flagTimeline
    let time = this.props.conversationDetail.analysis[repName][val]
    let index = IC.indexOf(val)
    let randomColor = this.state.colors
    let indexFT = FT.map(data => data.label).indexOf(val)

    if (index > -1) {

      IC.splice(index, 1)

      FT.splice(indexFT, 1)
      if (val === 'contact_mention') {
        let ind1 = IC.indexOf("Email mention")
        IC.splice(ind1, 1)
        let ind2 = IC.indexOf("Mobile Mention")
        IC.splice(ind2, 1)
        let indexFT1 = FT.map(data => data.label).indexOf('Email mention')
        FT.splice(indexFT1, 1)
        let indexFT2 = FT.map(data => data.label).indexOf('Mobile Mention')
        FT.splice(indexFT2, 1)
      }
      let time = this.state.timeline.filter((data) => {
        return data.type !== val && data
      })
      this.setState((prevState) => ({
        interactionChecked: IC,
        timeline: time,
        flagTimeline: FT,
        colorCount: prevState.colorCount - 1
      }))

    }
    else {
      if (repName === 'interaction') {
        if (val !== 'contact_mention') {
          console.log(val)
          this.setState((prevState) => ({

            interactionChecked: prevState.interactionChecked.concat(val),
            colorCount: prevState.colorCount + 1,

          }), () => {
            let CoCo = this.state.colorCount
            let result = time.timeline.timeline !== undefined && time.timeline.timeline.map(function (el) {
              let o = Object.assign({}, el);
              o.type = val;
              o.style = randomColor[CoCo]
              return o;
            })
            this.setState((prevState) => ({
              flagTimeline: prevState.flagTimeline.concat({ label: val, style: this.state.colors[this.state.colorCount] }),
              timeline: repName !== undefined && prevState.timeline.concat(result),
            }))

          })
        }

        if (repName === 'interaction' && val === 'contact_mention') {
          let MM = this.props.conversationDetail.analysis[repName][val].mobile_mention.timeline.timeline
          let EM = this.props.conversationDetail.analysis[repName][val].email_mention.timeline.timeline
          let combined = MM.concat(EM)

          this.setState((prevState) => ({

            interactionChecked: prevState.interactionChecked.concat('Email mention', 'Mobile Mention', 'contact_mention'),
            colorCount: prevState.colorCount + 1,

          }), () => {
            let CoCo = this.state.colorCount
            let result = combined !== undefined && combined.map(function (el) {
              let o = Object.assign({}, el);
              o.type = val;
              o.style = randomColor[CoCo]
              return o;
            })
            this.setState((prevState) => ({
              flagTimeline: prevState.flagTimeline.concat({ label: 'Email mention', style: this.state.colors[this.state.colorCount] }, { label: 'Mobile Mention', style: this.state.colors[this.state.colorCount] }, { label: 'contact_mention', style: this.state.colors[this.state.colorCount] }),
              timeline: repName !== undefined && prevState.timeline.concat(result),
            }))
          })
        }
      }

      else if (repName === 'topics') {
        let ind = e.target.getAttribute('data-index')
        let time = this.props.conversationDetail.analysis[repName][ind]

        this.setState((prevState) => ({

          interactionChecked: prevState.interactionChecked.concat(val),
          colorCount: prevState.colorCount + 1,

        }), () => {
          let CoCo = this.state.colorCount
          let result = time.timeline !== undefined && time.timeline.map(function (el) {
            let o = Object.assign({}, el);
            o.type = val;
            o.style = randomColor[CoCo]
            return o;
          })
          this.setState((prevState) => ({
            flagTimeline: prevState.flagTimeline.concat({ label: val, style: this.state.colors[this.state.colorCount] }),
            timeline: repName !== undefined && prevState.timeline.concat(result),
          }))
        })
      } else if (repName === 'signals') {
        let temp = []
        if (time.label === 'BANT') {
          time.values.map((data) => (
            data.timeline.map((Da) => {
              return temp.push(Da)
            })
          ))

          this.setState((prevState) => ({

            interactionChecked: prevState.interactionChecked.concat(val),
            colorCount: prevState.colorCount + 1,

          }), () => {
            let CoCo = this.state.colorCount
            let result = temp !== undefined && temp.map(function (el) {
              let o = Object.assign({}, el);
              o.type = val;
              o.style = randomColor[CoCo]
              return o;
            })
            this.setState((prevState) => ({
              flagTimeline: prevState.flagTimeline.concat({ label: val, style: this.state.colors[this.state.colorCount] }),
              timeline: repName !== undefined && prevState.timeline.concat(result),
            }))
          })
        } else {

          this.setState((prevState) => ({

            interactionChecked: prevState.interactionChecked.concat(val),
            colorCount: prevState.colorCount + 1,

          }), () => {
            let CoCo = this.state.colorCount
            let result = time.timeline.timeline !== undefined && time.timeline.timeline.map(function (el) {
              let o = Object.assign({}, el);
              o.type = val;
              o.style = randomColor[CoCo]
              return o;
            })
            this.setState((prevState) => ({
              flagTimeline: prevState.flagTimeline.concat({ label: val, style: this.state.colors[this.state.colorCount] }),
              timeline: repName !== undefined && prevState.timeline.concat(result),
            }))
          })
        }
      }
    }


  }
  handleFeedbackStatus = (e) => {
    e.preventDefault();
    const { client_id, emailid, firstname, lastname, rep_id } = this.props.user;
    let first_name = firstname
    let last_name = lastname
    const ConversationId = this.props.match.params.id;
    let id = e.target.getAttribute('data-id')
    let stat = e.target.getAttribute('data-status')
    let type = e.target.getAttribute('data-type')
    let subid = e.target.getAttribute('data-subid')
    let feedback;
    if (type === 'non-thread')
      feedback = {
        type: "status",
        stage: stat,
        feedback_id: id
      }
    if (type === 'thread') {
      feedback = {
        type: "status",
        stage: stat,
        feedback_id: id,
        thread: true,
        thread_id: subid
      }
    }
    this.props.postComment({ client_id, emailid, id: ConversationId, feedback, first_name, last_name, rep_id })
  }
  handleDoubleClickScroll = (e) => {
    // console.log(e.target.getAttribute('data-seq'))
    let id = e.target.getAttribute('data-seq')
    this.setState(({ showTranscript: true }), _ => {
      var elmnt = document.querySelectorAll(".msgNode .msg span div");
      setTimeout(_ => {
        if (id && (id <= elmnt.length)) {
          // console.log(elmnt[id],elmnt[id].closest('li'))
          elmnt[id].closest('li').classList.add('ScrollStyle')
          elmnt[id].scrollIntoView({ behavior: "smooth", block: "end" });
          setTimeout(() => {
            elmnt[id].closest('li').classList.remove('ScrollStyle')
          }, 3000)
        }
        else {
          elmnt[0].closest('li').classList.add('ScrollStyle')
          elmnt[0].scrollIntoView({ behavior: "smooth", block: "end" })
          setTimeout(() => {
            elmnt[0].closest('li').classList.remove('ScrollStyle')
          }, 3000)
        }
      }, 1000)

    })
  }
  render() {
    this.state.timeline.length > 0 && this.state.timeline.sort((a, b) => Number(a.from) - Number(b.from))

    var count = {};
    this.state.timeline.length > 0 && this.state.timeline.forEach(function (i) { count[i.from] = (count[i.from] || 0) + 1; });

    const timeline = this.state.timeline.length > 0 && this.state.timeline.map(e => e['from']).map((e, i, final) => final.indexOf(e) === i && i).filter(e => this.state.timeline[e]).map(e => this.state.timeline[e]);

    const { searchInputTranscript, searchInputComment } = this.state
    let comments = this.props.conversationDetail && this.props.conversationDetail.feedback;
    let rx = /{id:(([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)}/i;
    comments && comments.map(comment => {
      if (comment.tagged_user.length > 0) {
        comment.tagged_user.map(tag => {
          comment.message = comment.message.replace(rx, '@' + tag.first_name + " " + tag.last_name);
        })
      }
      if (comment.thread && comment.thread.length > 0) {
        comment.thread.map(threadData => {
          if (threadData.tagged_user.length > 0) {
            threadData.tagged_user.map(tag => {
              threadData.message = threadData.message.replace(rx, '@' + tag.first_name + " " + tag.last_name)
            })
          }
        })
      }
    })
    const signals = Object.keys(this.props.conversationDetail !== undefined && this.props.conversationDetail.analysis.signals).map((data) => {
      return [(data), this.props.conversationDetail.analysis.signals[data]];
    })
    const interaction = Object.keys(this.props.conversationDetail !== undefined && this.props.conversationDetail.analysis.interaction).map((data) => {
      return Object.keys(this.props.conversationDetail.analysis.interaction[data]).length > 0 && [(data), this.props.conversationDetail.analysis.interaction[data]];
    })

    const topics = Object.keys(this.props.conversationDetail !== undefined && this.props.conversationDetail.analysis.topics).map((data) => {
      return [(data), this.props.conversationDetail.analysis.topics[data]];
    })

    let width, margin

    let newTime = this.props.conversationDetail && this.props.conversationDetail.date.replace("Z", "")
    let rep_label_count = 0
    let prospect_label_count = 0
    let totalValue = this.props.conversationDetail && this.props.conversationDetail.transcripts[this.props.conversationDetail.transcripts.length - 1].to
    let newTrans = [];
    let spek;
    if (this.props.conversationDetail && this.props.conversationDetail.channel_id === 'web_chat') {
      spek = this.props.conversationDetail && this.props.conversationDetail.timeline.speakers.map(function (el, ind) {
        let o = Object.assign({}, el);
        o.type = 'Speaker_' + ind;
        return o;
      })
      this.props.conversationDetail && this.props.conversationDetail.transcripts.map((data) => {
        return spek.map(function (el) {
          if (el.id === data.id) {
            // console.log(el.type)
            let o = Object.assign({}, data);
            o.type = el.type;
            newTrans.push(o)
          }
        })
      })
    }

    return (
      <React.Fragment>
        <div className="conversation-wrapp">
          <div className="custom-row">
            <div className="single-conversation">
              <div className="breadcum rewrap">
                <div className="back-btn" onClick={() => { this.props.history.goBack() }}><i className="icon-arrow-lhs"></i></div>
                {this.props.conversationDetail && <div className="conv-page-title">{
                  this.props.conversationDetail.channel_subtype
                }
                  {/* {this.props.conversationDetail.channel_id === "web_chat" ? 'Chat' : 'Call'} on {moment(newTime).format('Do MMMM YYYY, hh:mm A')} */}
                  {this.props.conversationDetail.channel_id === "web_chat" ? 'Chat' : 'Call'} on {timezoneDatePrint(this.props.conversationDetail && this.props.conversationDetail.date, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')}
                  {/* ({moment.duration(this.props.conversationDetail && this.props.conversationDetail.duration, "seconds").format("h [hrs] m [mins] s [secs]")}) */}
                </div>}
                <div className="set-flex-one">
                  <ul className="icons-group" onClick={this.handleActivity}>

                    <li className="showTooltip1">
                      <i id={'star ' + this.props.match.params.id} className={`${this.props.conversationDetail && this.props.conversationDetail.starred_by ? 'icon-starred starActive' : 'icon-starred'}`} > </i>
                      <div className="tooltipText1">
                        <span>{this.props.conversationDetail && this.props.conversationDetail.starred_by ? 'Remove from Starred Collection' : 'Add to Starred Collection'}</span>
                      </div>
                    </li>
                    <li data-toggle="tooltip" data-placement="bottom" title="Add to Collection">
                      <i id={'book ' + this.props.match.params.id} className="icon-bookmark" data-toggle="modal" data-target="#bookMarkConversation"> </i>
                    </li>
                    <li data-toggle="tooltip" data-placement="bottom" title="Show Feedback">
                      <i className={this.state.showComment ? "icon-chat open" : "icon-chat"} onClick={this.showCommentBar} ></i>
                    </li>
                    <li id="transcript" data-toggle="tooltip" data-placement="bottom" title="Show Transcript">
                      <i className={this.state.showTranscript ? "icon-monologue open" : "icon-monologue"} id="transcripts" onClick={this.showCommentBar} ></i>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="conversationCol2 being-relative">
                <div className="col2Side1">
                  {this.state.toggle && <div className="tab1"> <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <a className="nav-link" >Analysis</a>
                    </li>
                  </ul>
                    <div className="tab-content">
                      <div className="tab-pane active" id="conversationDetail">
                        <Scrollbar>
                          <div className="filter-content">
                            <div className="accordion" id="filterAccordian">
                              <div className="card">
                                <div className="card-header" id="channel">
                                  <h2 className="mb-0">
                                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseChannel12" aria-expanded="true" aria-controls="collapseChannel">
                                      <i className="icon-phone"></i> Call Info
                                      <span className="accordian-dropdown-icon">
                                        <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                        <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />

                                      </span>
                                    </button>
                                  </h2>
                                </div>
                                <div id="collapseChannel12" className="collapse show" aria-labelledby="channel" data-parent="#filterAccordian">
                                  <div className="card-body">
                                    <div className="channel-options">
                                      <div className="conversationType customer pad0 mb-0">
                                        <div className="contentWrapper">
                                          <ul>

                                            <div className="conver-call-detail">
                                              <ul>
                                                <li><h5 className="d-inline ">Date:</h5>  <small className="small-text color-b">{timezoneDatePrint(this.props.conversationDetail && this.props.conversationDetail.date, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')} </small></li>
                                                <li><h5 className="d-inline ">Duration:</h5> <small className="small-text color-b">{timezoneDatePrint(this.props.conversationDetail && this.props.conversationDetail.duration, this.props.user.timezone, 'h [hrs] m [mins] s [secs]', 'duration')}</small></li>
                                                {/* <li><h5 className="d-inline ">Date:</h5>  <small className="small-text color-b">{moment(newTime).format('Do MMMM YYYY, hh:mm A')} </small></li>
                                                <li><h5 className="d-inline ">Duration:</h5> <small className="small-text color-b">{moment.duration(this.props.conversationDetail && this.props.conversationDetail.duration, "seconds").format("h [hrs] m [mins] s [secs]")}</small></li> */}


                                                <li><h5 className="d-inline ">Channel:</h5> <small className="subText remove-flex align-center">
                                                  <i className={this.props.conversationDetail && this.props.conversationDetail.channel_id === "web_chat" ? 'icon-chat' : this.props.conversationDetail && this.props.conversationDetail.channel_id === 'telephony' ? 'icon-audio' : 'icon-video'}></i> <span className="side-text">{this.props.conversationDetail && this.props.conversationDetail.channel_name}</span>
                                                </small> </li>
                                                <li>
                                                  <h5>Participants:</h5>
                                                  {
                                                    this.props.conversationDetail && this.props.conversationDetail.participants.length > 1 ? this.props.conversationDetail.participants.map((data, index) => {
                                                      return <div className="user-init " key={index}>
                                                        <div className="conver-profile conv-page pl0">
                                                          <div className="active-user-img as-img mr15">
                                                            <span className="initials-logo">
                                                              {
                                                                data.speaker_label === 'rep' ? this.getInitials(data.first_name) : this.getInitials(data.first_name)
                                                              }

                                                            </span>
                                                          </div>
                                                          <div className="media-name-box">
                                                            <h4 className="media-text">
                                                              {/* {
                                  data.speaker_label === 'rep' ? rep_label_count = rep_label_count+1 : data.speaker_label === 'prospect' ?  prospect_label_count = prospect_label_count+1 :''
                               } */}
                                                              {
                                                                rep_label_count > 1 ? data.first_name.join(', ') : prospect_label_count > 1 ? data.first_name.join(', ') : data.first_name
                                                              }

                                                            </h4>

                                                          </div>
                                                        </div>
                                                      </div>
                                                    }) : <div className="user-init">
                                                        <div className="conver-profile conv-page">
                                                          <div className="active-user-img as-img mr15">
                                                            <span className="initials-logo"> {this.props.conversationDetail && this.getInitials(this.props.conversationDetail.participants[0].first_name)}
                                                            </span>
                                                          </div>
                                                          <div className="media-name-box">
                                                            <h4 className="media-text"> {this.props.conversationDetail && this.props.conversationDetail.participants[0].first_name} </h4>
                                                            {/* <div className="subText">
                                                              <i className={this.props.conversationDetail && this.props.conversationDetail.channel_id === "web_chat" ? 'icon-chat' : this.props.conversationDetail && this.props.conversationDetail.channel_id === 'telephony' ? 'icon-audio' : 'icon-video'}></i> <span className="side-text">{this.props.conversationDetail && this.props.conversationDetail.channel_subtype}</span>
                                                            </div> */}
                                                          </div>
                                                        </div>
                                                      </div>
                                                  }
                                                </li>
                                              </ul>

                                            </div>
                                          </ul>

                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                </div>
                              </div>

                              {
                                this.props.conversationDetail !== undefined && this.props.conversationDetail.analysis.summary !== undefined && this.props.conversationDetail.analysis.summary.length > 0 &&
                                <div className="card">
                                  <div className="card-header" id="channel">
                                    <h2 className="mb-0">
                                      <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseChannel6" aria-expanded="false" aria-controls="collapseChannel">
                                        <i className="icon-phone"></i> Summary
                                          <span className="accordian-dropdown-icon">
                                          <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                          <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />

                                        </span>
                                      </button>
                                    </h2>
                                  </div>
                                  <div id="collapseChannel6" className="collapse" aria-labelledby="channel" data-parent="#filterAccordian">
                                    <div className="card-body">
                                      <div className="channel-options">
                                        <div className="conversationType customer pad0">
                                          <div className="contentWrapper">
                                            <div className="start-list-wrapp summary-cloudword" onClick={()=>{  window.jQuery("#searchCloud").modal('show')}} style={{cursor:'pointer'}}>
                                              <HighchartsReact highcharts={Highcharts} options={this.state.options} />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                </div>

                              }

                              {this.props.conversationDetail && (this.props.conversationDetail.analysis.signals.bant.values.length > 0 || this.props.conversationDetail.analysis.signals.opportunity !== undefined) && <div className="card">
                                <div className="card-header" id="channel">
                                  <h2 className="mb-0">
                                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseChannel1" aria-expanded="false" aria-controls="collapseChannel">
                                      <i className="icon-phone"></i> Signals
                                      <span className="accordian-dropdown-icon">
                                        <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                        <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />

                                      </span>
                                    </button>
                                  </h2>
                                </div>
                                <div id="collapseChannel1" className="collapse" aria-labelledby="channel" data-parent="#filterAccordian">
                                  <div className="card-body">
                                    <div className="channel-options">
                                      <div className="conversationType customer pad0">
                                        <div className="contentWrapper">
                                          <ul>
                                            {
                                              signals.map((data) => {

                                                return (data[1].label === "BANT" && data[1].values.length > 0) ? <div className="start-list-wrapp" key={Math.random()}>
                                                  <div className="list-head">
                                                    <h5 className="list-title">{"BANT"}</h5>
                                                    {data[1].toggle && <div className="comp-btn">
                                                      <label className="switch switch-left-right switch-convo"><input className="switch-input" value={data[0]} data-type="signals" onClick={this.handleTimelineToggle} type="checkbox" checked={this.state.interactionChecked.includes(data[0])} /><span className="switch-back"></span><span className="switch-handle"></span></label></div>
                                                    }
                                                  </div>
                                                  <div className="list-body">

                                                    {
                                                      data[1].label === "BANT" && data[1].values.map((dat) => {
                                                        return <div className="list-content" key={Math.random()}>
                                                          <div className="list-content-wrap">
                                                            <h4 className="list-content-title">{this.titleCase(dat.name)}</h4>
                                                            <div className="msg-icon"><i className="icon-chat" key={Math.random()} id={dat.name} onClick={this.handleSignalToggle}></i></div>
                                                          </div>
                                                          <div className="list-content-keyword">
                                                            {dat.keywords.map((da, ind) => {
                                                              return <div className="colmn-highlightedText" key={Math.random()}>{da} </div>
                                                            })}

                                                          </div>
                                                          {dat.messages && this.state[dat.name] && <div className="list-content-para">
                                                            {
                                                              dat.messages.map((msg, ind) => {
                                                                let t = this.props.conversationDetail.transcripts.filter((data) => {
                                                                  return data.seq === msg && data
                                                                })
                                                                let time = t[0].datetime.replace("Z", "")
                                                                return <li className={"msg-boundary " + dat.name} onClick={this.scrollTranscript} key={ind}>
                                                                  <div  >
                                                                    <h5 className="list-content-msg" id={msg}>{t[0].message}</h5>
                                                                    {/* <h5 className="list-content-date">{moment(time).format('Do MMMM YYYY, hh:mm A')}</h5> */}
                                                                    <h5 className="list-content-date">{timezoneDatePrint(t[0].datetime, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')}</h5>
                                                                  </div>
                                                                </li>

                                                              })
                                                            }
                                                            <div> {dat.messages.length > 3 && <h5 className={"hide " + dat.name} onClick={() => {
                                                              window.jQuery('.msg-boundary.' + dat.name + ":nth-child(n+4):nth-last-child(n+2)").css("display", "block");
                                                              window.jQuery('.hide.' + dat.name).css("display", "none");
                                                            }}>view more</h5>} </div>
                                                          </div>}

                                                        </div>
                                                      })
                                                    }
                                                  </div>
                                                </div> : data[1].label === 'Next Steps' && (data[1].values.keywords.length > 0 || data[1].values.messages.length > 0) ?
                                                    <div className="start-list-wrapp" key={Math.random()}>
                                                      <div className="list-head">
                                                        <h5 className="list-title">{"Next Steps"}</h5>
                                                        {data[1].toggle && <div className="comp-btn">
                                                          <label className="switch switch-left-right switch-convo"><input className="switch-input" value={data[0]} data-type="signals" onClick={this.handleTimelineToggle} type="checkbox" checked={this.state.interactionChecked.includes(data[0])} /><span className="switch-back"></span><span className="switch-handle"></span></label></div>
                                                        }
                                                      </div>
                                                      <div className="list-body">

                                                        {

                                                          <div className="list-content" key={Math.random()}>
                                                            <div className="list-content-wrap">
                                                              <h4 className="list-content-title"></h4>
                                                              <div className="msg-icon"><i className="icon-chat" id={data[1].label} onClick={this.handleSignalToggle}></i></div>
                                                            </div>
                                                            <div className="list-content-keyword move-upside">
                                                              {data[1].values.keywords.map((da, ind) => {
                                                                return <div className="colmn-highlightedText" key={Math.random()}>{da} </div>
                                                              })}

                                                            </div>

                                                            {data[1].values.messages && this.state[data[1].label] && <div className="list-content-para">
                                                              {
                                                                data[1].values.messages.map((msg, ind) => {
                                                                  let t = this.props.conversationDetail.transcripts.filter((data) => {
                                                                    return data.seq === msg && data
                                                                  })
                                                                  let time = t[0].datetime.replace("Z", "")
                                                                  return <li className={"msg-boundary " + data[1].label.replace(" ", "")} onClick={this.scrollTranscript} key={ind}>
                                                                    <div>
                                                                      <h5 className="list-content-msg" id={msg}>{t[0].message}</h5>
                                                                      {/* <h5 className="list-content-date">{moment(time).format('Do MMMM YYYY, hh:mm A')}</h5> */}
                                                                      <h5 className="list-content-date">{timezoneDatePrint(t[0].datetime, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')}</h5>
                                                                    </div>
                                                                  </li>

                                                                })
                                                              }
                                                              <div> {data[1].values.messages.length > 3 && <h5 className={"hide " + data[1].label.replace(" ", "")} onClick={() => {
                                                                window.jQuery('.msg-boundary.' + data[1].label.replace(" ", "") + ":nth-child(n+4):nth-last-child(n+2)").css("display", "block");
                                                                window.jQuery('.hide.' + data[1].label.replace(" ", "")).css("display", "none");
                                                              }}>view more</h5>} </div>
                                                            </div>}

                                                          </div>

                                                        }
                                                      </div>
                                                    </div>
                                                    : data[0] === "opportunity" && <div className="start-list-wrapp" key={Math.random()}>
                                                      <div className="list-head">
                                                        <h5 className="list-title">{this.titleCase(data[0])}</h5>
                                                        {data[1].toggle && <div className="comp-btn">
                                                          <label className="switch switch-left-right switch-convo"><input className="switch-input" value={data[0]} data-type="signals" onClick={this.handleTimelineToggle} type="checkbox" checked={this.state.interactionChecked.includes(data[0])} /><span className="switch-back"></span><span className="switch-handle"></span></label></div>
                                                        }
                                                      </div>
                                                      <div className="list-body">
                                                        <div className="list-content">
                                                          <div className="list-content-wrap">
                                                            <h4 className="list-content-title">{data[1].state}</h4>
                                                            <div className="msg-icon"><i className="icon-chat" id={data[1].state} onClick={this.handleSignalToggle} ></i></div>
                                                          </div>
                                                          {data[1].messages && this.state[data[1].state] && <div className="list-content-para">
                                                            {
                                                              data[1].messages.map((msg) => {
                                                                let t = this.props.conversationDetail.transcripts.filter((data) => {
                                                                  return data.seq === msg && data
                                                                })
                                                                let time = t[0].datetime.replace("Z", "")
                                                                return <li className={"msg-boundary " + data[1].state} onClick={this.scrollTranscript} key={Math.random()}>
                                                                  <div  >
                                                                    <h5 className="list-content-msg" id={msg}>{t[0].message}</h5>
                                                                    <h5 className="list-content-date">{timezoneDatePrint(t[0].datetime, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')}</h5>
                                                                    {/* <h5 className="list-content-date">{moment(time).format('Do MMMM YYYY, hh:mm A')}</h5> */}
                                                                  </div>
                                                                </li>
                                                              })
                                                            }
                                                            <div> {data[1].messages.length > 3 && <h5 className={"hide " + data[1].state} onClick={() => {
                                                              window.jQuery('.msg-boundary.' + data[0] + ":nth-child(n+4):nth-last-child(n+2)").css("display", "block");
                                                              window.jQuery('.hide.' + data[1].state).css("display", "none");
                                                            }}>view more</h5>} </div>
                                                          </div>}
                                                        </div>
                                                      </div>
                                                    </div>

                                              })
                                            }
                                          </ul>

                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                </div>
                              </div>}

                              {topics.length > 0 &&
                                <div className="card">
                                  <div className="card-header" id="channel">
                                    <h2 className="mb-0">
                                      <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseChannel2" aria-expanded="false" aria-controls="collapseChannel">
                                        <i className="icon-phone"></i> Topics
                                      <span className="accordian-dropdown-icon">
                                          <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                          <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />

                                        </span>
                                      </button>
                                    </h2>
                                  </div>
                                  <div id="collapseChannel2" className="collapse" aria-labelledby="channel" data-parent="#filterAccordian">
                                    <div className="card-body">
                                      <div className="channel-options">
                                        <div className="conversationType customer pad0">

                                          <div className="contentWrapper">
                                            <ul>
                                              {topics.map((data, index) => {
                                                return <div className="start-list-wrapp" key={Math.random()}>
                                                  <div className="list-head">
                                                    <h5 className="list-title">{this.titleCase(data[1].name)}</h5>
                                                    {data[1].toggle && <div className="comp-btn">
                                                      <label className="switch switch-left-right switch-convo"><input className="switch-input" value={data[1].name} data-type="topics" data-index={index} onClick={this.handleTimelineToggle} type="checkbox" checked={this.state.interactionChecked.includes(data[1].name)} /><span className="switch-back"></span><span className="switch-handle"></span></label></div>
                                                    }
                                                  </div>
                                                  <div className="list-body">
                                                    <div className="list-content">
                                                      <div className="list-content-wrap">
                                                        <h4 className="list-content-title"></h4>
                                                        <div className="msg-icon"><i className="icon-chat" id={data[1].name} onClick={this.handleSignalToggle}></i></div>
                                                      </div>
                                                      <div className="list-content-keyword move-upside">
                                                        {data[1].keywords.map((da, ind) => {
                                                          return <div className="colmn-highlightedText" key={Math.random()}>{da} </div>
                                                        })}

                                                      </div>
                                                      {data[1].messages && this.state[data[1].name] && <div className={"list-content-para"}>
                                                        {
                                                          // this.props.conversationDetail.transcripts.map((trans) => {
                                                          //   data[1].messages.filter((msg)=>{
                                                          //       console.log(msg === trans.seq && trans)
                                                          //   })
                                                          //       })
                                                        }
                                                        {
                                                          data[1].messages.map((msg) => {
                                                            let t = this.props.conversationDetail.transcripts.filter((data) => {
                                                              return data.seq === msg && data
                                                            })
                                                            // console.log(t[0])

                                                            let time = t[0].datetime.replace("Z", "");
                                                            return <li className={"msg-boundary " + data[1].name.replace(" ", "")} onClick={this.scrollTranscript} key={Math.random()}>
                                                              <div  >
                                                                <h5 className="list-content-msg" id={msg}>{t[0].message}</h5>
                                                                <h5 className="list-content-date">{timezoneDatePrint(t[0].datetime, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')}</h5>
                                                                {/* <h5 className="list-content-date">{moment(time).format('Do MMMM YYYY, hh:mm A')}</h5> */}
                                                              </div>
                                                            </li>

                                                          })
                                                        }
                                                        <div> {data[1].messages.length > 3 && <h5 className={"hide " + data[1].name.replace(" ", "")} onClick={() => {
                                                          window.jQuery('.msg-boundary.' + data[1].name.replace(" ", "") + ":nth-child(n+4):nth-last-child(n+2)").css("display", "block");

                                                          window.jQuery('.hide.' + data[1].name.replace(" ", "")).css("display", "none");

                                                        }}>view more</h5>} </div>

                                                      </div>}

                                                    </div>


                                                  </div>
                                                </div>


                                              })}
                                            </ul>

                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>}

                              {interaction.length > 0 && <div className="card">
                                <div className="card-header" id="channel">
                                  <h2 className="mb-0">
                                    <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseChannel" aria-expanded="false" aria-controls="collapseChannel">
                                      <i className="icon-phone"></i> Engagement
                                      <span className="accordian-dropdown-icon">
                                        <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                        <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />

                                      </span>
                                    </button>
                                  </h2>
                                </div>
                                <div id="collapseChannel" className="collapse" aria-labelledby="channel" data-parent="#filterAccordian">
                                  <div className="card-body">
                                    <div className="channel-options">
                                      <div className="conversationType customer pad0">

                                        <div className="contentWrapper">
                                          <ul>
                                            {interaction.map((data) => {
                                              // console.log(Object.keys(data[0] === "contact_mention" && data[1]).length )
                                              return data[0] !== "sentiment" ? <div className={data[0] === "dead_air" ? "start-list-wrapp dead-air" : 'start-list-wrapp'} key={Math.random()}>
                                                <div className="list-head">
                                                  <h5 className="list-title">{this.titleCase(data[0].replace("_", " "))}</h5>
                                                  {data[1].toggle ? <div className="comp-btn">
                                                    <label className="switch switch-left-right switch-convo"><input className="switch-input" value={data[0]} data-type="interaction" onClick={this.handleTimelineToggle} type="checkbox" checked={this.state.interactionChecked.includes(data[0])} /><span className="switch-back" ></span><span className="switch-handle"></span></label></div> : data[0] === "contact_mention" && <div className="comp-btn">
                                                      <label className="switch switch-left-right switch-convo"><input className="switch-input" value={data[0]} data-type="interaction" data-combined="combined" onClick={this.handleTimelineToggle} type="checkbox" checked={this.state.interactionChecked.includes(data[0])} /><span className="switch-back"></span><span className="switch-handle"></span></label></div>

                                                  }
                                                </div>
                                                <div className={"list-body " + data[0]}>
                                                  {
                                                    data[0] === "contact_mention" && Object.entries(data[1]).map((d) => {
                                                      return <div className="list-content" key={Math.random()}>
                                                        <div className="list-content-wrap">
                                                          <h4 className="list-content-title">{this.titleCase(d[0].replace("_", " "))}</h4>
                                                          {/* {d[1].toggle && <button type="button" className="btn btn-xs btn-toggle" data-toggle="button" aria-pressed="false">
                                                            <div className="handle"></div>
                                                          </button>} */}
                                                          <div className="msg-icon"><i className="icon-chat" key={Math.random()} id={d[0]} onClick={this.handleSignalToggle}></i></div>
                                                        </div>

                                                        {d[1].messages && this.state[d[0]] && <div className="list-content-para">
                                                          {
                                                            d[1].messages.map((msg) => {
                                                              let t = this.props.conversationDetail.transcripts.filter((data) => {
                                                                return data.seq === msg && data
                                                              })
                                                              // console.log(t[0])
                                                              let time = t[0].datetime.replace("Z", "")
                                                              return <li className={"msg-boundary " + d[0]} onClick={this.scrollTranscript} key={Math.random()}>
                                                                <div  >
                                                                  <h5 className="list-content-msg" id={msg}>{t[0].message}</h5>
                                                                  <h5 className="list-content-date">{timezoneDatePrint(t[0].datetime, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')}</h5>
                                                                  {/* <h5 className="list-content-date">{moment(time).format('Do MMMM YYYY, hh:mm A')}</h5> */}
                                                                </div>
                                                              </li>
                                                            })
                                                          }
                                                          <div> {d[1].messages.length > 3 && <h5 className={"hide " + d[0]} onClick={() => {
                                                            window.jQuery('.msg-boundary.' + d[0] + ":nth-child(n+4):nth-last-child(n+2)").css("display", "block");
                                                            window.jQuery('.hide.' + d[0]).css("display", "none");
                                                          }}>view more</h5>} </div>
                                                        </div>}

                                                      </div>
                                                    })
                                                  }

                                                  {data[0] !== "contact_mention" && <div className="list-content-count list-content-wrap">
                                                    <h4 className="colmn-highlightedText">

                                                      {data[0] === "dead_air" ? "Count: " + data[1].count : data[0] === "interaction_switches" ? "Count: " + data[1].value : data[0] === "monologue" ? "Count: " + data[1].count : data[0] === "questions" && "Count:" + data[1].value}
                                                    </h4>
                                                    {data[0] === "dead_air" && <h4 className="colmn-highlightedText">
                                                      {data[1].tricile}
                                                    </h4>}
                                                    {data[1].messages && <div className="msg-icon"><i className="icon-chat" key={Math.random()} id={data[0]} onClick={this.handleSignalToggle}></i></div>}
                                                  </div>}
                                                  {data[1].messages && this.state[data[0]] && <div className="list-content-para">
                                                    {
                                                      data[1].messages.map((msg) => {
                                                        let t = this.props.conversationDetail.transcripts.filter((data) => {
                                                          return data.seq === msg && data
                                                        })
                                                        // console.log(t[0])
                                                        let time = t[0].datetime.replace("Z", "")
                                                        return <li className={"msg-boundary " + data[0]} onClick={this.scrollTranscript} key={Math.random()}>
                                                          <div >
                                                            <h5 className="list-content-msg" id={msg}>{t[0].message}</h5>
                                                            <div className="msg-meta-text">
                                                            <h5 className="list-content-date">{timezoneDatePrint(t[0].datetime, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')}</h5>
                                                              {/* <h5 className="list-content-date">{moment(time).format('Do MMMM YYYY, hh:mm A')}</h5> */}
                                                              {msg === data[1].longest && <h5 className="longest-text">Longest</h5>}
                                                            </div>
                                                          </div>
                                                        </li>

                                                      })
                                                    }
                                                    <div> {data[1].messages.length > 3 && <h5 className={"hide " + data[0]} onClick={() => {
                                                      window.jQuery('.msg-boundary.' + data[0] + ":nth-child(n+4):nth-last-child(n+2)").css("display", "block");
                                                      window.jQuery('.hide.' + data[0]).css("display", "none");
                                                    }}>view more</h5>} </div>
                                                  </div>}

                                                </div>
                                              </div> : data[0] === "sentiment" && data[1].values.length > 0 && <div className="start-list-wrapp" key={Math.random()}>
                                                <div className="list-head">
                                                  <h5 className="list-title">{"Sentiment"}</h5>
                                                  {data[1].toggle && <div className="comp-btn">
                                                    <label className="switch switch-left-right switch-convo"><input className="switch-input" value={data[0]} data-type="signals" onClick={this.handleTimelineToggle} type="checkbox" checked={this.state.interactionChecked.includes(data[0])} /><span className="switch-back"></span><span className="switch-handle"></span></label></div>
                                                  }
                                                </div>
                                                <div className="list-body">
                                                  {
                                                    data[0] === "sentiment" && data[1].values.map((dat) => {
                                                      return dat.count !== 0 && <div className="list-content" key={Math.random()}>
                                                        <div className="list-content-wrap">
                                                          <h4 className="list-content-title">{this.titleCase(dat.label)}</h4>
                                                          <div className="msg-icon"><i className="icon-chat" key={Math.random()} id={dat.label} onClick={this.handleSignalToggle}></i></div>
                                                        </div>
                                                        <div className="list-content-count list-content-wrap">
                                                          <h4 className="colmn-highlightedText">

                                                            {"Count: " + dat.count}
                                                          </h4>


                                                        </div>
                                                        {dat.messages && this.state[dat.label] && <div className="list-content-para">
                                                          {
                                                            dat.messages.map((msg, ind) => {
                                                              let t = this.props.conversationDetail.transcripts.filter((data) => {
                                                                return data.seq === msg && data
                                                              })
                                                              // console.log(t[0])
                                                              let time = t[0].datetime.replace("Z", "")
                                                              return <li className={"msg-boundary " + dat.label} onClick={this.scrollTranscript} key={ind}>
                                                                <div >
                                                                  <h5 className="list-content-msg" id={msg}>{t[0].message}</h5>
                                                                  <h5 className="list-content-date">{timezoneDatePrint(t[0].datetime, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')}</h5>
                                                                  {/* <h5 className="list-content-date">{moment(time).format('Do MMMM YYYY, hh:mm A')}</h5> */}
                                                                </div>
                                                              </li>

                                                            })
                                                          }
                                                          <div> {dat.messages.length > 3 && <h5 className={"hide " + dat.label} onClick={() => {
                                                            window.jQuery('.msg-boundary.' + dat.label + ":nth-child(n+4):nth-last-child(n+2)").css("display", "block");
                                                            window.jQuery('.hide.' + dat.label).css("display", "none");
                                                          }}>view more</h5>} </div>
                                                        </div>}

                                                      </div>
                                                    })
                                                  }
                                                </div>

                                              </div>

                                            })}
                                          </ul>

                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                </div>
                              </div>}


                              {
                                this.props.conversationDetail !== undefined && this.props.conversationDetail.analysis.connect !== undefined &&
                                <div className="card">
                                  <div className="card-header" id="channel">
                                    <h2 className="mb-0">
                                      <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseChannel4" aria-expanded="false" aria-controls="collapseChannel">
                                        <i className="icon-phone"></i> Connect
                                          <span className="accordian-dropdown-icon">
                                          <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                          <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />

                                        </span>
                                      </button>
                                    </h2>
                                  </div>
                                  <div id="collapseChannel4" className="collapse" aria-labelledby="channel" data-parent="#filterAccordian">
                                    <div className="card-body">
                                      <div className="channel-options">
                                        <div className="conversationType customer pad0">

                                          <div className="contentWrapper">
                                            <div className="start-list-wrapp" key={Math.random()}>
                                              <div className="list-head">
                                                <h5 className="list-title">Connect Analysis</h5>
                                              </div>
                                              <div className="list-body">
                                                <ul class="custom-tabs">
                                                  {this.props.conversationDetail.analysis.connect !== undefined && this.props.conversationDetail.analysis.connect.ivr && <li class={this.props.conversationDetail.analysis.connect.ivr.value === 1 ? "greenTag custom-tab" : 'redTag custom-tab'}> <a href="#" class="custom-tab-link">IVR</a></li>}
                                                  {this.props.conversationDetail.analysis.connect !== undefined && this.props.conversationDetail.analysis.connect.gatekeeper && <li class={this.props.conversationDetail.analysis.connect.gatekeeper.value === 1 ? "greenTag custom-tab" : 'redTag custom-tab'}> <a href="#" class="custom-tab-link">GateKeeper</a></li>}
                                                  {this.props.conversationDetail.analysis.connect !== undefined && this.props.conversationDetail.analysis.connect.contact && <li class={this.props.conversationDetail.analysis.connect.contact.value === 1 ? "greenTag custom-tab" : 'redTag custom-tab'}> <a href="#" class="custom-tab-link">Contact</a></li>}
                                                </ul>
                                                {/* <div className="list-content-count list-content-wrap">
                                                  {
                                                    this.props.conversationDetail.analysis.connect !== undefined && this.props.conversationDetail.analysis.connect.ivr && <span className={this.props.conversationDetail.analysis.connect.ivr.value === 1 ? "greenTag" : 'redTag'}>IVR</span>
                                                  }
                                                  {
                                                    this.props.conversationDetail.analysis.connect !== undefined && this.props.conversationDetail.analysis.connect.gatekeeper && <span className={this.props.conversationDetail.analysis.connect.gatekeeper.value === 1 ? "greenTag" : 'redTag'}>GateKeeper</span>
                                                  }
                                                  {
                                                    this.props.conversationDetail.analysis.connect !== undefined && this.props.conversationDetail.analysis.connect.contact && <span className={this.props.conversationDetail.analysis.connect.contact.value === 1 ? "greenTag" : 'redTag'}>Contact</span>
                                                  }

                                                </div> */}
                                              </div>

                                            </div>


                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>


                                </div>


                              }

                            </div>
                          </div>

                        </Scrollbar>

                      </div>
                    </div>
                  </div>}

                </div>
                <div className="col2Side2 background_bg">
                  <div className="sec1" id="left_panel">
                    {
                      this.props.conversationDetail && this.props.conversationDetail.channel_id === "online_meeting_tools" ? <VideoPlayer ref={this.child} video={this.props.conversationDetail && this.props.conversationDetail.resource.download_url} time={this.state.CurrentTime} />
                        : this.props.conversationDetail && this.props.conversationDetail.channel_id === "telephony" ?
                          <VideoPlayer video={this.props.conversationDetail && this.props.conversationDetail.resource.download_url} ref={this.child} time={this.state.CurrentTime} />
                          : ''
                    }
                    <div className="converstionTimelineContainer grid4">

                      <div className="conversationTimelineWrap">
                        <div className="conversationTimelineWrapHead">
                          <h4 className="mb-2">Conversation Timeline</h4>
                        </div>
                        <div className="analysis-legend">
                          {this.state.flagTimeline.map((data, index) => {
                            return data.label !== 'contact_mention' && <span style={{ color: data.style }} className="tag" title={data.label} key={index}>{data.label}<svg height="18px" style={{ fill: data.style }} viewBox="-94 0 448 448" width="18px" xmlns="http://www.w3.org/2000/svg"><path d="m260.039062 120-228.039062-99.769531v199.539062zm0 0" /><path d="m0 0h16.007812v448h-16.007812zm0 0" /></svg></span>
                          })}
                        </div>
                        <div className="conversationTimelineWrapBody mt50">
                          <ul className="timelineList">
                            <li className="mainTimeline">
                              <div className="timelineWrap">
                                <div className="timelineContainer legend-time">
                                  <div className="timelineOuter">
                                    <div className="timelineInner">

                                      {
                                        timeline.length > 0 && timeline.map((span, index, arr) => {

                                          if (index === 0) {
                                            margin = (parseFloat(span.from) / totalValue) * 100
                                          } else {
                                            //margin = ((parseFloat(span.from) - parseFloat(arr[index - 1].to)) / this.props.conversationDetail.duration) * 100
                                            // console.log(margin,'margin')
                                            margin = ((parseFloat(span.from) - parseFloat(arr[index - 1].to)) / totalValue) * 100
                                          }
                                          if (arr.length > 1) {

                                            width = ((parseFloat(span.to) - parseFloat(span.from)) / totalValue) * 100
                                          } else {
                                            width = ((parseFloat(span.to) - parseFloat(span.from)) / totalValue) * 100

                                          }

                                          return <span data-toggle={count[span.from] !== 1 ? "tooltip" : undefined} data-placement={count[span.from] !== 1 ? "bottom" : undefined} title={count[span.from] !== 1 ? span.type : undefined} data-count={count[span.from] !== 1 ? count[span.from] : undefined}

                                            className={count[span.from] !== 1 ? "legend Black" : "time legend "}

                                            onClick={this.props.conversationDetail && this.props.conversationDetail.channel_id !== "web_chat" ? this.getAudioTrack : undefined} id={span.from} style={{ width: width + "%", marginLeft: margin + "%" }} key={index}>
                                            <svg height="23px" style={{ fill: span.style, marginRight: "-23px" }} viewBox="-94 0 448 448" width="23px" xmlns="http://www.w3.org/2000/svg"><path d="m260.039062 120-228.039062-99.769531v199.539062zm0 0" /><path d="m0 0h16.007812v448h-16.007812zm0 0" /></svg></span>
                                        })
                                      }

                                    </div>
                                  </div>
                                  <div className="overallTime">
                                    {/* <span>{moment(newTime).format('hh:mm A')}</span> */}
                                  </div>
                                </div>
                              </div>
                            </li>
                            {
                              this.props.conversationDetail && this.props.conversationDetail.channel_id === 'web_chat' ?
                                spek.map((data, index) => {
                                  let cssText = data.name.split(" ")
                                  return data.timeline.length > 0 && <li className="mainTimeline" key={index}>
                                    <div className={"timelineWrap "}>
                                      <div className={"reps-participant"}>
                                        <span className="re">{data.name}</span>
                                        {/* <span data-toggle="tooltip" data-placement="bottom" title={data.name} >{data.label === 'rep' ? 'R' : data.label === 'prospect' ? 'C' : ''}</span> */}
                                      </div>
                                      <div className="timelineContainer">
                                        <div className="timelineOuter">
                                          <div className={"timelineInner " + data.type}>
                                            {
                                              data.timeline.map((span, index, arr) => {
                                                if (index === 0) {
                                                  margin = (parseFloat(span.from) / (totalValue)) * 100
                                                } else {
                                                  //margin = ((parseFloat(span.from) - parseFloat(arr[index - 1].to)) / this.props.conversationDetail.duration) * 100
                                                  margin = ((parseFloat(span.from) - parseFloat(arr[index - 1].to)) / totalValue) * 100
                                                }
                                                if (arr.length > 1) {

                                                  width = ((parseFloat(span.to) - parseFloat(span.from)) / (totalValue)) * 100

                                                } else {
                                                  width = ((parseFloat(span.to) - parseFloat(span.from)) / (totalValue)) * 100

                                                }
                                                return <span className={"audio "} onClick={this.props.conversationDetail && this.props.conversationDetail.channel_id !== "web_chat" ? this.getAudioTrack : undefined} id={span.from} style={{ width: width + "%", marginLeft: margin + "%" }} key={index}></span>
                                              })
                                            }
                                          </div>
                                        </div>
                                        <div className="overallTime">
                                          <span>TTLR {data.ttl}%</span>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                })
                                : this.props.conversationDetail && this.props.conversationDetail.timeline.speakers.map((data, index) => {
                                  let cssText = data.name.split(" ")
                                  return data.timeline.length > 0 && <li className="mainTimeline" key={index}>
                                    <div className={"timelineWrap "}>
                                      <div className={"reps-participant"}>
                                        <span className="re">{data.name}</span>
                                        {/* <span data-toggle="tooltip" data-placement="bottom" title={data.name} >{data.label === 'rep' ? 'R' : data.label === 'prospect' ? 'C' : ''}</span> */}
                                      </div>
                                      <div className="timelineContainer">
                                        <div className="timelineOuter">
                                          <div className={"timelineInner " + cssText[0] + "_" + cssText[1]}>
                                            {
                                              data.timeline.map((span, index, arr) => {
                                                if (index === 0) {
                                                  margin = (parseFloat(span.from) / (totalValue)) * 100
                                                } else {
                                                  //margin = ((parseFloat(span.from) - parseFloat(arr[index - 1].to)) / this.props.conversationDetail.duration) * 100
                                                  margin = ((parseFloat(span.from) - parseFloat(arr[index - 1].to)) / totalValue) * 100
                                                }
                                                if (arr.length > 1) {

                                                  width = ((parseFloat(span.to) - parseFloat(span.from)) / (totalValue)) * 100

                                                } else {
                                                  width = ((parseFloat(span.to) - parseFloat(span.from)) / (totalValue)) * 100

                                                }
                                                return <span className={"audio "} onClick={this.props.conversationDetail && this.props.conversationDetail.channel_id !== "web_chat" ? this.getAudioTrack : undefined} data-seq={this.props.conversationDetail && this.props.conversationDetail.channel_id !== "web_chat" && span.seq} onDoubleClick={this.handleDoubleClickScroll} id={span.from} style={{ width: width + "%", marginLeft: margin + "%" }} key={index}></span>
                                              })
                                            }
                                          </div>
                                        </div>
                                        <div className="overallTime">
                                          <span>TTLR {data.ttl}%</span>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                })
                            }

                            {
                              interaction.length > 0 && interaction.map((data, index) => {
                                return data[0] === 'dead_air' && <li className="mainTimeline dead-air" key={index}>
                                  <div className="timelineWrap">
                                    <div className={"reps-participant"}>
                                      <span className="re">Dead Air</span>
                                      {/* <span data-toggle="tooltip" data-placement="bottom" title={data.name} >{data.label === 'rep' ? 'R' : data.label === 'prospect' ? 'C' : ''}</span> */}
                                    </div>
                                    <div className="timelineContainer">
                                      <div className="timelineOuter">
                                        <div className="timelineInner">
                                          {
                                            data[0] === 'dead_air' && data[1].timeline.timeline.length > 0 && data[1].timeline.timeline.map((span, index, arr) => {
                                              if (index === 0) {
                                                margin = (parseFloat(span.from) / (totalValue)) * 100
                                              } else {
                                                // margin = ((parseFloat(span.from) - parseFloat(arr[index - 1].to)) / (this.props.conversationDetail.duration+2)) * 100
                                                margin = ((parseFloat(span.from) - parseFloat(arr[index - 1].to)) / totalValue) * 100
                                              }
                                              if (arr.length > 1) {

                                                width = ((parseFloat(span.to) - parseFloat(span.from)) / (totalValue)) * 100
                                                // console.log(width,'width')
                                              } else {
                                                width = ((parseFloat(span.to) - parseFloat(span.from)) / (totalValue)) * 100

                                              }
                                              //  tempcount += margin + width;
                                              return <span className="audio" onClick={this.props.conversationDetail && this.props.conversationDetail.channel_id !== "web_chat" ? this.getAudioTrack : undefined} id={span.from} style={{ width: width + "%", marginLeft: margin + "%" }} key={index}></span>
                                            })
                                          }
                                          {
                                            // console.log(tempcount)
                                          }
                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                </li>

                              })
                            }

                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {
                    this.state.showTranscript && <div className="transcript-bar animated slideInRight bar-in-search" id="transcript-wrapper">
                      <div className="commentsContainer">
                        <div className="transcriptWrap">
                          <div className="transcriptWrapHead text-center mb40">
                            <h4>Transcript</h4>
                            <div className="wrapperTop">
                              <i className={this.state.showComment ? "icon-chat open" : "icon-chat"} data-toggle="tooltip" data-placement="bottom" title="Show Feedback" id="comment-level" onClick={this.showCommentBar} ></i>
                              <span onClick={() => { this.setState(() => ({ transcriptInput: true })) }}><img src="/static/images/search.png" alt="searchImg" /></span>
                              {this.state.transcriptInput && <div className="searchBox_a">
                                <input type="text" onChange={this.onChangeTextSearchTranscript} id="search-scoop" placeholder="Enter Keywords" autoFocus />
                                <div className="searchCount">
                                  <span className="currentPos"> {this.state.wordCount > 0 ? this.state.wordcounter : 0} </span>
                                  <span> - </span>
                                  <span className="totalFind"> {this.state.wordCount}  </span>
                                </div>
                                <div className="upDown">
                                  <img id="upward" src="/static/images/top-arrow.svg" width="14px" onClick={this.handleWordTraverse} />
                                  <img id="downward" src="/static/images/bottom-arrow.svg" width="14px" onClick={this.handleWordTraverse} />
                                </div>
                                <div className="closeSearch" onClick={() => { this.setState(() => ({ transcriptInput: false, searchInputTranscript: '', wordCount: 0, wordcounter: 0 })) }}>
                                  <i className="icon-close"></i>
                                </div>
                              </div>
                              }
                            </div>
                            {/* <div className="day"><span>{moment(this.props.conversationDetail && this.props.conversationDetail.date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") ? 'Today' : moment(this.props.conversationDetail && this.props.conversationDetail.date).format("YYYY-MM-DD") === moment().subtract(1, 'days').format("YYYY-MM-DD") ? 'Yesterday' :
                              moment(newTime).format('Do MMMM YYYY')}</span></div> */}
                            <div className="close-comment-bar">
                              <span><i className="icon-close" id="transcript-bar" onClick={this.closeCommentBar}></i></span>
                            </div>
                          </div>
                          <Scrollbar>
                            <div className={"transcriptWrapBody newChatBody"}>
                              <ul className="transcriptChat">
                                {
                                  this.props.conversationDetail && this.props.conversationDetail.channel_id === 'web_chat' ?
                                    newTrans.map((data, index) => {

                                      let speaker = this.props.conversationDetail.participants.filter((part) => {
                                        return part.id === data.id && part.first_name
                                      })
                                      // console.log(speaker[0].first_name + " "+speaker[0].last_name)
                                      let speaker_label = data.speaker_label.split(" ")
                                      // console.log(speaker,speaker_label)
                                      let newtime = data.datetime.replace("Z", "")
                                      return data.message.length !== 0 && (/\S/g).test(data.message) ?
                                        <li className="client" key={index}>
                                          <div className="msgWrap">
                                            <div className={"userIcon " + data.type}>
                                              <span>{this.props.conversationDetail.channel_id === 'telephony' || this.props.conversationDetail.channel_id === 'online_meeting_tools' ? speaker_label[0][0].toUpperCase() + speaker_label[1] : data.speaker_label === 'prospect' ? "C" : "R"}</span>
                                            </div>
                                            <div className="msgNode">
                                              {
                                                <div>
                                                  <h4>{this.props.conversationDetail.channel_id === 'telephony' || this.props.conversationDetail.channel_id === 'online_meeting_tools' ? speaker_label[0] + " " + speaker_label[1] : speaker[0].first_name + " " + speaker[0].last_name}</h4>
                                                </div>
                                              }
                                              <div className="msg">
                                                {<span>
                                                  {
                                                    searchInputTranscript !== '' ?
                                                      <div dangerouslySetInnerHTML={this.boldString(data.message, searchInputTranscript)}></div>
                                                      : <div><pre>{data.message.length === 0 ? '' : data.message}</pre></div>
                                                  }
                                                </span>}
                                              </div>
                                           
                                              <div className="msgTime">
                                                {/* <span className="time">{moment(newtime).format("hh:mm A")} </span> */}
                                                <span className="time">{timezoneDatePrint(data.datetime, this.props.user.timezone, 'hh:mm A', 'time')} </span>
                                              
                                                <button className="msg-ref" onClick={this.handleReferenceComment} data-message={data.message} id={index}><i className="icon-chat"></i></button>
                                              </div>
                                            </div>
                                          </div>
                                        </li> : ""
                                    }) : this.props.conversationDetail && this.props.conversationDetail.transcripts.map((data, index) => {
                                      let speaker = this.props.conversationDetail.participants.filter((part) => {
                                        return part.id === data.id && part.first_name
                                      })
                                      // console.log(speaker[0].first_name + " "+speaker[0].last_name)
                                      let speaker_label = data.speaker_label.split(" ")
                                      // console.log(speaker,speaker_label)
                                      let newtime = data.datetime.replace("Z", "")
                                      return data.message.length !== 0 && (/\S/g).test(data.message) ?
                                        <li className="client" key={index}>
                                          <div className="msgWrap">
                                            <div className={this.props.conversationDetail.channel_id === 'telephony' || this.props.conversationDetail.channel_id === 'online_meeting_tools' ? "userIcon " + speaker_label[0] + "_" + speaker_label[1] : "userIcon"}>

                                              <span>{this.props.conversationDetail.channel_id === 'telephony' || this.props.conversationDetail.channel_id === 'online_meeting_tools' ? speaker_label[0][0].toUpperCase() + speaker_label[1] : data.speaker_label === 'prospect' ? "C" : "R"}</span>
                                            </div>
                                            <div className="msgNode">
                                              {
                                                <div>
                                                  <h4>{this.props.conversationDetail.channel_id === 'telephony' || this.props.conversationDetail.channel_id === 'online_meeting_tools' ? speaker_label[0] + " " + speaker_label[1] : speaker[0].first_name + " " + speaker[0].last_name}</h4>
                                                </div>
                                              }
                                              <div className="msg">
                                                {<span>
                                                  {
                                                    searchInputTranscript !== '' ?
                                                      <div dangerouslySetInnerHTML={this.boldString(data.message, searchInputTranscript)}></div>
                                                      : <div><pre>{data.message.length === 0 ? '' : data.message}</pre></div>
                                                  }
                                                </span>}
                                              </div>
                                              <div className="msgTime">
                                              <span className="time">{timezoneDatePrint(data.datetime, this.props.user.timezone, 'hh:mm A', 'time')} </span>
                                                {/* <span className="time">{moment(newtime).format("hh:mm A")} </span> */}
                                                <button className="msg-ref" onClick={this.handleReferenceComment} data-message={data.message} id={index}><i className="icon-chat"></i></button>
                                              </div>
                                            </div>
                                          </div>
                                        </li> : ""
                                    })
                                }
                              </ul>
                            </div>
                          </Scrollbar>
                        </div>
                        {this.state.showTransMessage && <div className="commentBox mt20">
                          {(this.state.referenceSeq) && <div className="msgNode replyComment">
                            <p className="msg msgReplyOf">
                              <span className="replyOf">{this.state.transcriptMessageText}</span>
                              <i className="icon-close" id="transcriptMessageText" onClick={this.closeReply}></i>
                            </p>
                          </div>}
                          <div className="form-group">
                            {<MentionsInput
                              value={this.state.transcriptVisibleText}
                              onChange={this.setTranscriptComment}
                              onKeyPress={this.checkEnter}
                              allowSpaceInQuery
                              placeholder={"Add Feedback"}
                              className="commentInput"
                            >
                              <Mention
                                data={this.transcriptRenderData}
                                appendSpaceOnAdd
                                renderSuggestion={(suggestion, search, highlightedDisplay) => (
                                  <div className="user">{highlightedDisplay}</div>
                                )}
                                displayTransform={(id, display) => `@${display}`}
                              />
                            </MentionsInput>}
                            <button className="sendBtn" onClick={this.postComment} >Send</button>
                          </div>
                        </div>}
                      </div>
                    </div>
                  }
                  {this.state.showComment && <div className="comment-bar animated slideInRight bar-in-search" id="comment-level-box">
                    <div className="commentsContainer">
                      <div className="commentWrap">
                        <div className="commentWrapHead text-center mb40">
                          <h4>Feedback</h4>
                          <div className="wrapperTop">
                            <span onClick={() => { this.setState(() => ({ commentInput: true })) }}><img src="/static/images/search.png" alt="searchImg" /></span>
                            {this.state.commentInput && <div className="searchBox_a">
                              <input type="text" onChange={this.onChangeTextSearchComment} id="search-scoop" placeholder="write here" autoFocus />
                              <div className="searchCount">
                                <span className="currentPos"> {this.state.commentCount > 0 ? this.state.commentcounter : 0} </span>
                                <span> - </span>
                                <span className="totalFind"> {this.state.commentCount}  </span>
                              </div>

                              <div className="upDown">
                                <img id="upward" src="/static/images/top-arrow.svg" width="14px" onClick={this.handleCommentTraverse} />
                                <img id="downward" src="/static/images/bottom-arrow.svg" width="14px" onClick={this.handleCommentTraverse} />
                              </div>

                              <div className="closeSearch" onClick={() => { this.setState(() => ({ commentInput: false, searchInputComment: '', commentCount: 0, commentcounter: 0 })) }}>
                                <i className="icon-close"></i>
                              </div>
                            </div>}
                          </div>
                          {/* <div className="day"><span>Today</span></div> */}
                          <div className="close-comment-bar">
                            <span><i className="icon-close" id="comment-bar" onClick={this.closeCommentBar}></i></span>
                          </div>
                        </div>
                        <div className="commentWrapBody newChatBody">
                          <Scrollbar id="comment-scroll">
                            <ul className="transcriptChat pad0">
                              {<React.Fragment>
                                {this.props.conversationDetail && this.props.conversationDetail.feedback && this.props.conversationDetail.feedback.map((comment, index) => {

                                  let time = comment.datetime.replace("Z", "")
                                  return <li id={comment.id} key={index}
                                  // className={this.props.user.emailid === comment.user ? "user" : "client"} 
                                  >
                                    <div className="msgWrap">
                                      <div className="userIcon">
                                        <span>{comment.commented_by.first_name.substring(0, 1).toUpperCase()}</span>
                                      </div>
                                      <div className="msgNode">
                                        <div className="set-flex justify-space-btwn"><h4>{comment.commented_by.first_name}</h4>
                                          {comment.commented_by.emailid !== this.props.user.emailid && <div className="dropdown">
                                            <button className="more-btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false"><img src="/static/images/more.svg" /></button>

                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" x-placement="bottom-start">
                                              <button className="dropdown-item" data-type="non-thread" data-status="agree" data-id={comment.id} onClick={this.handleFeedbackStatus} >Agree {comment.stages !== undefined && comment.stages[comment.stages.length - 1] !== undefined && comment.stages[comment.stages.length - 1].stage.has_agreed === 1 && <img src="/static/images/tick.png" />}</button>
                                              <button className="dropdown-item" data-type="non-thread" data-status="disagree" data-id={comment.id} onClick={this.handleFeedbackStatus} >Disagree {comment.stages !== undefined && comment.stages[comment.stages.length - 1] !== undefined && comment.stages[comment.stages.length - 1].stage.has_agreed === 0 && <img src="/static/images/tick.png" />}</button>
                                              <button className="dropdown-item" data-type="non-thread" data-status="act" data-id={comment.id} onClick={this.handleFeedbackStatus} >Acted {comment.stages !== undefined && comment.stages[comment.stages.length - 1] !== undefined && comment.stages[comment.stages.length - 1].stage.has_acted === 1 && <img src="/static/images/tick.png" />}</button>
                                            </div>

                                          </div>}

                                        </div>
                                        {comment.seq ? <React.Fragment><p className="msg msgReplyOf">
                                          <span className="replyOf">{this.props.conversationDetail && this.props.conversationDetail.transcripts[comment.seq] !== undefined && this.props.conversationDetail.transcripts[comment.seq].message}</span>
                                          <span><pre>{comment.message}</pre></span>
                                        </p>


                                        </React.Fragment>
                                          :
                                          <React.Fragment>

                                            <div className="msg"><span>
                                              {
                                                searchInputComment !== '' ?
                                                  <div dangerouslySetInnerHTML={this.boldString(comment.message, searchInputComment)}></div>
                                                  : <div><pre>{comment.message}</pre></div>
                                              }
                                            </span>
                                            </div></React.Fragment>
                                        }
                                        <div className="msgTime"><div className="timenReplyBtn">
                                          <span className="time">{moment(time).fromNow()}</span>
                                          <button id={comment.id} className="replyBtn" value={comment.message} onClick={this.replyComment}>
                                            <img src="/static/images/reply.svg" /></button>
                                          {comment.thread && comment.thread.length > 0 && <span className="viewReply">
                                            <button className="viewReplyBtn" onClick={() => this.setState({ showReplies: true, feedbackMessage: { msg: comment.message, by: comment.commented_by.first_name, time: time, id: comment.id, stages: comment.stages, parentMsg: comment.seq ? this.props.conversationDetail && this.props.conversationDetail.transcripts[comment.seq] !== undefined && this.props.conversationDetail.transcripts[comment.seq].message : undefined, emailid: comment.commented_by.emailid }, type: 'thread', replies: comment.thread, feedback_id: comment.id })}> ({comment.thread.length}) </button>
                                          </span>}
                                          <span className="feed-stat">{comment.stages !== undefined && comment.stages[comment.stages.length - 1] !== undefined && comment.stages[comment.stages.length - 1].stage.has_agreed === 1 ? "Agree" : comment.stages !== undefined && comment.stages[comment.stages.length - 1] !== undefined && comment.stages[comment.stages.length - 1].stage.has_agreed === 0 ? "Disagree" : comment.stages !== undefined && comment.stages[comment.stages.length - 1] !== undefined && comment.stages[comment.stages.length - 1].stage.has_acted === 1 && "Acted"}</span>
                                        </div>

                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                })}
                              </React.Fragment>}
                            </ul>
                          </Scrollbar>
                        </div>
                        {<div className="commentBox mt20">
                          {(this.state.reply) && <div className="msgNode replyComment">
                            <p className="msg msgReplyOf">
                              <span className="replyOf">{this.state.messageText}</span>
                              <i className="icon-close" onClick={this.closeReply}></i>
                            </p>
                          </div>}
                          <div className="form-group">
                            {<MentionsInput
                              value={this.state.visibleText}
                              onChange={this.setComment}
                              onKeyPress={this.checkEnter}
                              allowSpaceInQuery
                              placeholder={"Add Feedback"}
                              className="commentInput"
                            >
                              <Mention
                                data={this.renderData}
                                appendSpaceOnAdd
                                renderSuggestion={(suggestion, search, highlightedDisplay) => (
                                  <div className="user">{highlightedDisplay}</div>
                                )}
                                displayTransform={(id, display) => `@${display}`}
                              />
                            </MentionsInput>}
                            <button className="sendBtn" onClick={this.postComment} >Send</button>
                          </div>
                        </div>}
                        {this.state.showReplies && <div className="replyBox">
                          <div className="replyBoxHead">
                            <div className="back-btn" onClick={() => this.setState({ showReplies: false })}><i className="icon-arrow-lhs"></i> Back</div>
                            {/* <h2>{this.props.user.firstname}’s {this.state.replies.length} Replies</h2> */}
                          </div>
                          <div className="replyBoxBody mt25">
                            <div className="repliesNode newChatBody">
                              <ul>
                                <li>
                                  <div className="msgWrap">
                                    <div className="userIcon">
                                      <span>{this.state.feedbackMessage.by.substring(0, 1).toUpperCase()}</span>
                                    </div>

                                    <div className="msgNode">
                                      <div className="set-flex justify-space-btwn">
                                        <h4>{this.state.feedbackMessage.by}</h4>
                                      </div>
                                      {this.state.feedbackMessage.parentMsg ? <p className="msg msgReplyOf">
                                        <span className="replyOf">{this.state.feedbackMessage.parentMsg}</span>
                                        <span><pre>{this.state.feedbackMessage.msg}</pre></span>
                                      </p> : <p className="msg msgReplyOf">
                                          <span className="replyOf"><pre>{this.state.feedbackMessage.msg}</pre></span>
                                        </p>}

                                      <div className="msgTime"><span className="time">{moment(this.state.feedbackMessage.time).fromNow()}</span>
                                        <span className="feed-stat">{this.state.feedbackMessage.stages !== undefined && this.state.feedbackMessage.stages[this.state.feedbackMessage.stages.length - 1] !== undefined && this.state.feedbackMessage.stages[this.state.feedbackMessage.stages.length - 1].stage.has_agreed === 1 ? "Agree" : this.state.feedbackMessage.stages !== undefined && this.state.feedbackMessage.stages[this.state.feedbackMessage.stages.length - 1] !== undefined && this.state.feedbackMessage.stages[this.state.feedbackMessage.stages.length - 1].stage.has_agreed === 0 ? "Disagree" : this.state.feedbackMessage.stages !== undefined && this.state.feedbackMessage.stages[this.state.feedbackMessage.stages.length - 1] !== undefined && this.state.feedbackMessage.stages[this.state.feedbackMessage.stages.length - 1].stage.has_acted === 1 && "Acted"}</span>
                                      </div>
                                    </div>
                                    <div className="set-flex justify-space-btwn">
                                      {this.state.feedbackMessage.emailid !== this.props.user.emailid && <div className="dropdown">
                                        <button className="more-btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false"><img src="/static/images/more.svg" /></button>

                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" x-placement="bottom-start">
                                          <button className="dropdown-item" data-type="non-thread" data-status="agree" data-id={this.state.feedbackMessage.id} onClick={this.handleFeedbackStatus} >Agree {this.state.feedbackMessage.stages !== undefined && this.state.feedbackMessage.stages[this.state.feedbackMessage.stages.length - 1] !== undefined && this.state.feedbackMessage.stages[this.state.feedbackMessage.stages.length - 1].stage.has_agreed === 1 && <img src="/static/images/tick.png" />} </button>
                                          <button className="dropdown-item" data-type="non-thread" data-status="disagree" data-id={this.state.feedbackMessage.id} onClick={this.handleFeedbackStatus} >Disagree {this.state.feedbackMessage.stages !== undefined && this.state.feedbackMessage.stages[this.state.feedbackMessage.stages.length - 1] !== undefined && this.state.feedbackMessage.stages[this.state.feedbackMessage.stages.length - 1].stage.has_agreed === 0 && <img src="/static/images/tick.png" />}</button>
                                          <button className="dropdown-item" data-type="non-thread" data-status="act" data-id={this.state.feedbackMessage.id} onClick={this.handleFeedbackStatus}>Acted {this.state.feedbackMessage.stages !== undefined && this.state.feedbackMessage.stages[this.state.feedbackMessage.stages.length - 1] !== undefined && this.state.feedbackMessage.stages[this.state.feedbackMessage.stages.length - 1].stage.has_acted === 1 && <img src="/static/images/tick.png" />}</button>
                                        </div>
                                      </div>}
                                    </div>
                                  </div>
                                </li>
                                <Scrollbar>
                                  {
                                    // console.log(this.state.replies && this.state.replies)
                                    this.state.replies && this.state.replies.map((reply, index) => {
                                      let time = reply.datetime.replace("Z", "")
                                      return <li className="intend-l-38" key={index}>
                                        <div className="msgWrap">
                                          <div className="userIcon">
                                            <span>{reply.commented_by.first_name.substring(0, 1).toUpperCase()}</span>
                                          </div>
                                          <div className="msgNode">
                                            <div className="set-flex justify-space-btwn">

                                              <h4>{reply.commented_by.first_name}</h4>
                                              {reply.commented_by.emailid !== this.props.user.emailid && <div className="dropdown">
                                                <button className="more-btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false"><img src="/static/images/more.svg" /></button>

                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" x-placement="bottom-start">
                                                  <button className="dropdown-item" data-type="thread" data-status="agree" data-id={this.state.feedbackMessage.id} onClick={this.handleFeedbackStatus} data-subid={reply.id} >Agree {reply.stages !== undefined && reply.stages[reply.stages.length - 1] !== undefined && reply.stages[reply.stages.length - 1].stage.has_agreed === 1 && <img src="/static/images/tick.png" />}</button>
                                                  <button className="dropdown-item" data-type="thread" data-status="disagree" data-id={this.state.feedbackMessage.id} onClick={this.handleFeedbackStatus} data-subid={reply.id} >Disagree {reply.stages !== undefined && reply.stages[reply.stages.length - 1] !== undefined && reply.stages[reply.stages.length - 1].stage.has_agreed === 0 && <img src="/static/images/tick.png" />}</button>
                                                  <button className="dropdown-item" data-type="thread" data-status="act" data-id={this.state.feedbackMessage.id} onClick={this.handleFeedbackStatus} data-subid={reply.id}>Acted {reply.stages !== undefined && reply.stages[reply.stages.length - 1] !== undefined && reply.stages[reply.stages.length - 1].stage.has_acted === 1 && <img src="/static/images/tick.png" />}</button>
                                                </div>
                                              </div>}
                                            </div>
                                            <p className="msg">
                                              <span><pre>{reply.message}</pre></span>
                                            </p>
                                            <div className="msgTime"><span className="time">{moment(time).fromNow()}</span>
                                              {/* <img src="/static/images/reply.svg" /> */}
                                              <span className="feed-stat">{reply.stages !== undefined && reply.stages[reply.stages.length - 1] !== undefined && reply.stages[reply.stages.length - 1].stage.has_agreed === 1 ? "Agree" : reply.stages !== undefined && reply.stages[reply.stages.length - 1] !== undefined && reply.stages[reply.stages.length - 1].stage.has_agreed === 0 ? "Disagree" : reply.stages !== undefined && reply.stages[reply.stages.length - 1] !== undefined && reply.stages[reply.stages.length - 1].stage.has_acted === 1 && "Acted"}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    })
                                  }
                                </Scrollbar>
                              </ul>
                            </div>
                          </div>
                          <div className="commentBox mt20">
                            {<div className="msgNode replyComment">
                              {/* <p className="msg msgReplyOf">
                              <span className="replyOf">{this.state.messageText}</span>
                              <i className="icon-close" onClick={this.closeReply}></i>
                            </p> */}
                            </div>}
                            <div className="form-group">
                              {<MentionsInput
                                value={this.state.visibleText}
                                onChange={this.setComment}
                                onKeyPress={this.checkEnter}
                                allowSpaceInQuery
                                placeholder={"Add Feedback"}
                                className="commentInput"
                              >
                                <Mention
                                  data={this.renderData}
                                  appendSpaceOnAdd
                                  renderSuggestion={(suggestion, search, highlightedDisplay) => (
                                    <div className="user">{highlightedDisplay}</div>
                                  )}
                                  displayTransform={(id, display) => `@${display}`}
                                />
                              </MentionsInput>}
                              <button className="sendBtn" onClick={this.postComment} >Send</button>
                            </div>
                          </div>
                        </div>
                        }
                      </div>
                    </div>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal" id="searchCloud">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body">
                <div className="modal-box">
                  <div className="modal-title">
                    <h2>Summary</h2>
                  </div>
                  <div className="head-section mb-2">

                  </div>
                  <div className="body-section mb-4 summary-cloudword">
                    <HighchartsReact highcharts={Highcharts} options={this.state.options} />

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <BookMarkConversation convId={this.state.conversationId && this.state.conversationId} collectionList={this.props.collectionList && this.props.collectionList} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    conversationDetail: state.conversationReducer.conversationDetail,
    starred: state.collectionReducer.starredConversation,
    userHierarchy: state.conversationReducer.hierarchy,
    collectionList: state.conversationReducer.manualCollection
  }
}

const mapActionToProps = {
  loadConversationDetail: conversationAction.loadConversationDetail,
  star: conversationAction.starConversation,
  loadStarred: collectionAction.loadStarred,
  postComment: conversationAction.postComment,
  loadHierarchy: conversationAction.loadHierarchy,
  remove: conversationAction.destroy,
  readCollection: conversationAction.manualCollectionList,
}

export default withRouter(connect(mapStateToProps, mapActionToProps)(ConversationDetail));
