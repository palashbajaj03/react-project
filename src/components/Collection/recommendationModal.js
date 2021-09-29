import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import { collectionAction } from '../../actions';
import { Link } from 'react-router-dom'
import { routingConstants } from '../../constants';
import Scrollbar from 'react-scrollbars-custom';
import {timezoneDatePrint} from '../../constants'

const RecommendationModal = (props) => {
    let [collectionId, setCollectioId] = useState([]);
    let [conversations, updateConversation] = useState([])
    let [selectAll, updateSelectAll] = useState("")
    let [recommendation, updateRecommendation] = useState([])
    let [height, updateHeight] = useState("")

    useEffect(() => {
        return () => {
            window.jQuery('#searchData').on('show.bs.modal', handleRecommendationCancel)
        }
    })
    useEffect(() => {
        let all = props.data && props.data !== undefined && props.data.length > 0 && props.data
        updateRecommendation(all)
        let finalHeight;
        if (props.data && props.data !== undefined && props.data.length > 0) {
            finalHeight = props.data.length === 1 ? '160px' : props.data.length === 2 ? '290px' : '345px'
            updateHeight(finalHeight)
        }
    }, [props.data])

    const getInitials = (string) => {
        var names = string.split(' '),
            initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    }

    const selectConversation = (e) => {
        const id = e.target.id
        if (id === 'selectAll') {
            updateSelectAll(id)
            let temp = []
            recommendation && recommendation !== undefined && recommendation.map((dat) => {
                temp.push(dat.record_id)
            })
            setCollectioId(temp)
            let all = recommendation && recommendation !== undefined && recommendation
            updateConversation(all)
        } else {
            if (selectAll === 'selectAll') {
                updateSelectAll("")
                let select = conversations && conversations !== undefined && conversations.filter((dat) => {
                    return dat.record_id === id && dat
                })
                updateConversation(select)
                let col = collectionId !== undefined && collectionId.filter((data) => { return data === id && data })
                setCollectioId(col)
            } else {
                let select = recommendation && recommendation !== undefined && recommendation.filter((dat) => {
                    return dat.record_id === id && dat
                })
                updateConversation(conversations.concat(select))
                setCollectioId(collectionId.concat(id))
            }
        }
        if (!e.target.checked) {
            if (id === 'selectAll') {
                updateSelectAll("")
                setCollectioId([])
                updateConversation([])
            } else {
                if (selectAll === '') {
                    let string = e.target.id
                    let searchinput = collectionId
                    var index = searchinput && searchinput.indexOf(string);
                    if (index !== '' && index > -1) {
                        searchinput.splice(index, 1)
                        setCollectioId([...searchinput])
                    }
                    let searchinputs = conversations
                    let index1 = searchinputs.map(function (item) { return item.record_id; }).indexOf(string)
                    if (index1 !== '' && index1 > -1) {
                        searchinputs.splice(index, 1)
                        updateConversation([...searchinputs])
                    }
                }
            }
        }
    }
    const handleRecommendationSubmit = () => {
        const { client_id, emailid } = props.user
        let id = props.id
        if (conversations.length > 0) {
            props.addRecommendations(client_id, emailid, conversations, id)
        }
    }

    const handleRecommendationCancel = () => {
        updateSelectAll("")
        setCollectioId([])
        updateConversation([])
    }

    return (
        <div className="modal" id="searchData">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" onClick={handleRecommendationCancel}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="modal-box">
                            <div className="modal-title">
                                <h2>Similar Conversations</h2>
                            </div>
                            <div className="head-section mb-2">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" name="speakers" onChange={selectConversation} checked={selectAll === 'selectAll'} className="custom-control-input default-checkbox" id="selectAll" />
                                    <label className="custom-control-label default-font" for="selectAll">Select All</label>
                                </div>
                            </div>
                            <div className="body-section mb-4">
                                <Scrollbar style={{ height: height }}
                                >
                                    <div>
                                        {
                                            recommendation && recommendation !== undefined && recommendation.map((conversation, index) => {
                                                let reps = conversation.participants.filter((rep) => rep.speaker_label === 'rep')
                                                let prosp = conversation.participants.filter((rep) => rep.speaker_label === 'prospect')
                                                let newTime = conversation.date.replace("Z", "");
                                                return <div key={index} className="set-flex align-items-center">
                                                    <div className="custom-control custom-checkbox" style={{ display: "inline-block" }}>
                                                        <input type="checkbox" id={conversation.record_id} checked={collectionId.includes(conversation.record_id)} onChange={selectConversation} name="speakers" className="custom-control-input default-checkbox" />
                                                        <label className="custom-control-label default-font" for={conversation.record_id}></label>
                                                    </div>
                                                    <Link to={`${routingConstants.CONVERSATION_DETAIL}/${conversation.record_id}`} target="_blank" className="flex-1">   <div className={`start-conversation-row ${conversation.chat_sentiment < -0.5 ? 'color-1' : conversation.chat_sentiment < 0.5 ? 'color-2' : 'color-3'}`}>
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
                                                                {/* <h5 className="call-time">{moment.duration(conversation.duration, "seconds").format("h [hrs] m [mins] s [secs]")}</h5>
                                                            <small className="small-text">{moment(newTime).format('Do MMMM YYYY, hh:mm A')} </small> */}
                                                                <h5 className="call-time">{timezoneDatePrint(conversation.duration, this.props.user.timezone, 'h [hrs] m [mins] s [secs]', 'duration')}</h5>
                                                                <small className="small-text">{timezoneDatePrint(conversation.date, this.props.user.timezone, 'Do MMMM YYYY, hh:mm A', 'time')} </small>
                                                            </div>

                                                        </div>
                                                    </div>  </Link>
                                                </div>

                                            })
                                        }
                                    </div>
                                </Scrollbar>
                            </div>
                            <div className="collectionButtons">
                                <button type="button" className="colorBtn btn btn-secondary" onClick={handleRecommendationSubmit}>ADD</button>
                                <button type="button" id="recommClose" className="btn emptyColorBtn" data-dismiss="modal" onClick={handleRecommendationCancel}>CANCEL</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.authentication.user,
    }
}

const mapActionToProps = {
    addRecommendations: collectionAction.addRecommendations,

}

export default connect(mapStateToProps, mapActionToProps)(RecommendationModal);