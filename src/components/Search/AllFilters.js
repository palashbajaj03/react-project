import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Scrollbar from 'react-scrollbars-custom';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { searchAction } from '../../actions';
import uuid from 'uuid'
import { timezoneDateCalculator } from '../../constants';


const AllFilters = (props) => {
    let [channelName, updateChannelName] = useState('All Channels')
    let [deterministic, updateDeterministic] = useState(true)
    let [currentDate, updateCurrentDate] = useState('Anytime')
    let [calenderToggle, updateCalenderToggle] = useState(false)
    let [date_to_range, updateDTR] = useState([])
    let [dateRange, updateRange] = useState([])
    let [lastSelectedRep, updatelastSelectedRep] = useState('Select Reps')
    let [repId, updateRepId] = useState([])
    let [repIds, updateRepIds] = useState([])
    let [mobileMention, updateMobileMention] = useState([])
    let [emailMention, updateEmailMention] = useState([])
    let [opportunity, updateOpportunity] = useState([])
    let [connectChecked, connectCheckedUpdate] = useState([])
    let [connectArray, UpdateconnectArray] = useState([])
    let [bantChecked, bantCheckedUpdate] = useState([])
    let [bantArray, UpdateBantArray] = useState([])
    let [bantSelecteId, updateBantSelectedId] = useState([])
    let [stageChecked, updatedStageChecked] = useState([])
    let [stateArray, updateStageArray] = useState([])
    let [speakerChecked, updateSpeakerChecked] = useState([])
    let [speakerArray, updateSpeakerArray] = useState([])
    let [deadAirChecked, updateDeadAirChecked] = useState([])
    let [deadAirArray, updateDeadAirArray] = useState([])
    let [NOQChecked, updateNOQChecked] = useState([])
    let [NOQArray, UpdateNOQArray] = useState([])
    let [durationChecked, updateDurationChecked] = useState([])
    let [durationArray, updateDurationArray] = useState([])
    let [monologueChecked, updateMonologueChecked] = useState([])
    let [monologueArray, UpdateMonologueArray] = useState([])
    let [interactionSwitchesChecked, UpdateinteractionSwitchesChecked] = useState([])
    let [interactionSwitchesArray, updateinteractionSwitchesArray] = useState([])
    let [sentimentChecked, updatedSentimentChecked] = useState([])
    let [sentimentArray, updateSentimentArray] = useState([])
    let [connectToggle, updateConnectToggle] = useState('AND')
    let [bantToggle, updateBantToggle] = useState('AND')
    let [nextSteps, updateNextSteps] = useState([])
    let [feedback, updateFeedback] = useState([])
    let [crm, updateCrm] = useState([])
    let [topicSelectedID, updateTopicSelectedID] = useState([])
    let [subTopics, updateSubTopics] = useState([])
    let [allSubTopics, updateAllSubTopics] = useState([])
    let [subTopicSelectedID, setSubTopicSelectedID] = useState([])
    let [subTopicList, updateSubTopicList] = useState([])
    let [searchKey, updateSearchKey] = useState('')
    let [filterData, setFilter] = useState([])
    let [conectObject, updateConnectObject] = useState({ condition: "AND" })
    let [bantObject, updateBantObject] = useState({ condition: "AND" })
    let [NOQrequestObj, updateNOQrequestObj] = useState([])
    let [durationRequestObj, updateDurationRequestObj] = useState([])
    let [monoRequestObject, updateMonoRequestObject] = useState([])
    let [VAL, updateVAL] = useState(false)
    let [filters, updateFilters] = useState({})
    let [allSelectedCheckBox, updateAllSelectedCheckBox] = useState([])
    let [searchToggle, updateSearchToggle] = useState(true)

    useEffect(() => {
        const { client_id, emailid } = props.user
        props.loadSearchFilter(client_id, emailid)
    }, [])

    useEffect(() => {
        // if (props.collection) {
        const { client_id, emailid } = props.user
        const arr = props.searchFilter !== undefined && Object.keys(props.searchFilter).length > 0 && props.searchFilter.channels.map((data) => data.id)
        if (props.filter === undefined) {
            props.searchFilter !== undefined && arr.length > 0 && props.loadRepChannel(arr, client_id, emailid)
        }
        if (props.backFilters !== undefined && props.backFilters.temp_search_channel !== undefined && props.backFilters.temp_search_channel.length > 0) {
            let temp = [{ deterministic: props.backFilters.temp_search_channel[0].deterministic, id: props.backFilters.temp_search_channel[0].value, label: props.backFilters.temp_search_channel[0].value }]
            props.searchFilter !== undefined && props.getValues('Load_CHANNEL', temp, '', '')
        }
        else {
            props.searchFilter !== undefined && props.getValues('Load_CHANNEL', props.searchFilter && props.searchFilter.channels, '', '')
        }
        // }
    }, [props.searchFilter])

    useEffect(() => { // For correct updation of topic
        subTopicList.length > 0 && props.filter === undefined && props.getValues('TOPICS', subTopicList, '', '')
    }, [subTopicList])

    useEffect(() => { // For date picker
        VAL && props.getValues('DATE', date_to_range, '', '')
        updateVAL(true)
    }, [date_to_range, dateRange])

    useEffect(() => {
        let FILTERS = props.backFilters !== undefined ? props.backFilters : props.filter !== undefined ? props.filter : undefined
        updateFilters(FILTERS)
        if (searchToggle) {
            FILTERS !== undefined && updateSearchToggle(false)
            if (FILTERS !== undefined && FILTERS.temp_search_channel !== undefined && FILTERS.temp_search_channel.length > 1 && FILTERS.temp_search_channel[0].value.length > 1) {
                let label = 'All Channels'
                updateChannelName(label)
                updateDeterministic(true)
            }
            else if (FILTERS !== undefined && FILTERS.temp_search_channel !== undefined && FILTERS.temp_search_channel.length > 0 && FILTERS.temp_search_channel[0].value.length === 1) {
                let label = titleCase(FILTERS.temp_search_channel[0].value[0].label)
                let deterministic = FILTERS.temp_search_channel[0].deterministic
                updateChannelName(label)
                updateDeterministic(deterministic)
            }
            if (FILTERS !== undefined && FILTERS.temp_finaldate_range !== undefined && FILTERS.temp_finaldate_range.length > 0) {
                if (FILTERS.temp_finaldate_range[0].string.toString().includes('Anytime')) {
                    let label = 'Anytime'
                    updateCurrentDate(label)
                    updateCalenderToggle(false)
                }
                else if (FILTERS.temp_finaldate_range[0].string.toString().includes('Yesterday')) {
                    let label = 'Yesterday'
                    updateCurrentDate(label)
                    updateCalenderToggle(false)
                }
                else if (FILTERS.temp_finaldate_range[0].string.toString().includes('7 Days')) {
                    let label = 'Last 7 Days'
                    updateCurrentDate(label)
                    updateCalenderToggle(false)
                }
                else if (FILTERS.temp_finaldate_range[0].string.toString().includes('30 Days')) {
                    let label = 'Last 30 Days'
                    updateCurrentDate(label)
                    updateCalenderToggle(false)
                }
                else if (FILTERS.temp_finaldate_range[0].string.toString().includes('Last Month')) {
                    let label = 'Last Month'
                    updateCurrentDate(label)
                    updateCalenderToggle(false)
                }
                else if (FILTERS.temp_finaldate_range[0].string.toString().includes('This Month')) {
                    let label = 'This Month'
                    updateCurrentDate(label)
                    updateCalenderToggle(false)
                }
                else if (FILTERS.temp_finaldate_range[0].string.toString().includes('Custom')) {
                    let label = 'Custom Range'
                    updateCurrentDate(label)
                    updateCalenderToggle(false)
                }
            }
            if (FILTERS !== undefined && FILTERS.repId !== undefined && FILTERS.repId.length > 0) {
                let repname = FILTERS.repId[FILTERS.repId.length - 1].repName
                let allReps = FILTERS.repId
                updatelastSelectedRep(repname)
                updateRepId(allReps)
                FILTERS.repId && FILTERS.repId.map((data) => {
                    // document.getElementById(data.repID).disabled = true
                })
            }
            if (FILTERS !== undefined && FILTERS.temp_searchspeaker !== undefined && FILTERS.temp_searchspeaker.length > 0) {
                let label = []
                FILTERS.temp_searchspeaker.map(data => {
                    label = label.concat(data.value)
                })
                updateSpeakerChecked(label)
            }
            if (FILTERS !== undefined && FILTERS.topics !== undefined && FILTERS.topics.length > 0) {
                let a = [] // ID's of selected topics
                let b = [] // Complete objects of the topics selected
                let b2 = []
                let c = [] // complete list of the subtopics of the topics selected
                let c2 = []
                let d = [] // List of selected subtopics
                let e = [] // Final Object
                let f = [] // Select All topic names
                FILTERS.topics !== undefined && FILTERS.topics.map(data => {
                    a = a.concat(data.id)
                    FILTERS.topics.map(data => {
                        props.searchFilter !== undefined && props.searchFilter.conversation.topics.map(dat =>
                            data.id === dat.id && b.push(dat)
                        )
                    })
                    b2 = b.length > 0 && b.map(e => e['id']).map((e, i, final) => final.indexOf(e) === i && i).filter(e => b[e]).map(e => b[e]);
                    b2.length > 0 && b2.map(data =>
                        data.value.map(dat => c.push(dat))
                    )
                    const distinct = (value, index, self) => {
                        return self.indexOf(value) === index
                    }
                    c2 = c.filter(distinct)
                    e = FILTERS.topics
                })
                e.map(data => {
                    props.searchFilter !== undefined && props.searchFilter.conversation.topics.map(dat => {
                        (data.name === dat.name && data.value.length === dat.value.length) && f.push(data.name)
                    })
                })
                e.map(data => {
                    props.searchFilter !== undefined && props.searchFilter.conversation.topics.map(dat => {
                        (data.name === dat.name && data.value.length !== dat.value.length) && data.value.map(da => (d.push(da)))
                    })
                })
                updateTopicSelectedID(a)
                updateSubTopics(b2)
                updateAllSubTopics(c2)
                setSubTopicSelectedID(d)
                updateSubTopicList(e)
                updateAllSelectedCheckBox(f)
            }
            if (FILTERS !== undefined && FILTERS.temp_deadAir !== undefined && FILTERS.temp_deadAir.length > 0) {
                let label = []
                FILTERS.temp_deadAir.map(data => {
                    label = label.concat(data.value)
                })
                updateDeadAirChecked(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_deadairRange !== undefined && FILTERS.temp_deadairRange.length > 0) {
                let label = []
                FILTERS.temp_deadairRange.map(data => {
                    label = label.concat(data.interactivity_tricles + '-')
                })
                UpdateinteractionSwitchesChecked(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_no_of_questions_userLog !== undefined && FILTERS.temp_no_of_questions_userLog.length > 0) {
                let label = []
                FILTERS.temp_no_of_questions_userLog.map(data => {
                    if (data.no_questions_max === '+') {
                        let str = '10+-'
                        label = label.concat(str)
                    }
                    else {
                        let str = data.no_questions_min + "-" + data.no_questions_max + "-"
                        label = label.concat(str)
                    }
                })

                updateNOQChecked(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_durationLog !== undefined && FILTERS.temp_durationLog.length > 0) {
                let label = []
                FILTERS.temp_durationLog.map(data => {
                    let str = data.duration_min + "-" + data.duration_max
                    label = label.concat(str)
                })
                console.log(label)
                updateDurationChecked(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_monologue_conv !== undefined && FILTERS.temp_monologue_conv.length > 0) {
                let label = []
                FILTERS.temp_monologue_conv.map(data => {
                    if (data.monologue_max === '+') {
                        let str = '10+--'
                        label = label.concat(str)
                    }
                    else {
                        let str = data.monologue_min + "-" + data.monologue_max + "--"
                        label = label.concat(str)
                    }
                })
                updateMonologueChecked(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_sentiment_polarityLog !== undefined && FILTERS.temp_sentiment_polarityLog.length > 0) {
                let label = []
                FILTERS.temp_sentiment_polarityLog.map(data => {
                    let str = data.sentiment
                    label = label.concat(str)
                })
                updatedSentimentChecked(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_mobilemention !== undefined && FILTERS.temp_mobilemention.length > 0) {
                let label = FILTERS.temp_mobilemention
                updateMobileMention(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_emailmention !== undefined && FILTERS.temp_emailmention.length > 0) {
                let label = FILTERS.temp_emailmention
                updateEmailMention(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_opportunity !== undefined && FILTERS.temp_opportunity.length > 0) {
                let label = FILTERS.temp_opportunity[0]
                updateOpportunity(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_journey !== undefined && FILTERS.temp_journey.length > 0) {
                let label = []
                FILTERS.temp_journey.map(data => {
                    let str = data.stageValue
                    label = label.concat(str)
                })
                updatedStageChecked(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_bant_authority !== undefined && FILTERS.temp_bant_authority.length > 0) {
                let label = []
                FILTERS.temp_bant_authority.map(data => {
                    let str = data.bantValue
                    label = label.concat(str)
                })
                bantCheckedUpdate(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_next_step !== undefined && FILTERS.temp_next_step.length > 0) {
                let label = FILTERS.temp_next_step
                updateNextSteps(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_feedback !== undefined && FILTERS.temp_feedback.length > 0) {
                let label = FILTERS.temp_feedback
                updateFeedback(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_contact !== undefined && FILTERS.temp_contact.length > 0) {
                let label = []
                FILTERS.temp_contact.map(data => {
                    let str = data.connectValue
                    label = label.concat(str)
                })
                connectCheckedUpdate(label)
            }
            if (FILTERS !== undefined && FILTERS.temp_crm !== undefined && FILTERS.temp_crm.length > 0) {
                let label = FILTERS.temp_crm
                updateCrm(label)
            }
        }
    }, [props.backFilters, props.filter])

    const resetFilter = _ => {
        repId.length > 0 && repId.map(data => {
            document.getElementById(data.repID).disabled = false
        })
        updateChannelName('All Channels')
        updateDeterministic(true)
        updateCurrentDate('Anytime')
        updateCalenderToggle(false)
        updateDTR([])
        updateRange([])
        updatelastSelectedRep('Select Reps')
        updateRepId([])
        updateRepIds([])
        updateMobileMention([])
        updateEmailMention([])
        updateOpportunity([])
        connectCheckedUpdate([])
        UpdateconnectArray([])
        bantCheckedUpdate([])
        UpdateBantArray([])
        updateBantSelectedId([])
        updatedStageChecked([])
        updateStageArray([])
        updateSpeakerChecked([])
        updateSpeakerArray([])
        updateDeadAirChecked([])
        updateDeadAirArray([])
        updateNOQChecked([])
        UpdateNOQArray([])
        updateDurationChecked([])
        updateDurationArray([])
        updateMonologueChecked([])
        UpdateMonologueArray([])
        UpdateinteractionSwitchesChecked([])
        updateinteractionSwitchesArray([])
        updatedSentimentChecked([])
        updateSentimentArray([])
        updateConnectToggle('OR')
        updateBantToggle('OR')
        updateNextSteps([])
        updateFeedback([])
        updateCrm([])
        updateTopicSelectedID([])
        updateSubTopics([])
        updateAllSubTopics([])
        setSubTopicSelectedID([])
        updateSubTopicList([])
        updateSearchKey('')
        setFilter([])
        updateConnectObject({ condition: "OR" })
        updateBantObject({ condition: "OR" })
        updateNOQrequestObj([])
        updateDurationRequestObj([])
        updateMonoRequestObject([])
        updateAllSelectedCheckBox([])
        props.getValues('reset', true, '', '')
        props.resetSearch()
    }

    const channelFilter = e => {
        const { client_id, emailid } = props.user
        if (e.target.id === 'AllChannel') {
            const arr = props.channels && props.channels.map((data) => data.id)
            props.loadRepChannel(arr, client_id, emailid)
        } else {
            props.loadRepChannel([e.target.id], client_id, emailid)
        }
        let name = e.target.value
        let deterministic = e.target.getAttribute('data-deterministic');
        if (name === "All Channels") {
            updateChannelName(name)
            updateDeterministic(true)
            let value = []
            props.searchFilter && props.searchFilter.channels.map((data) => {
                value.push({
                    id: data.id, label: name, deterministic: data.deterministic
                })
            })
            let temp_search_channel = [{ type: "channel", string: "Channel: " + name, value: value }]
            props.getValues('CHANNEL', temp_search_channel, '', '')
        } else {
            let temp_search_channel = [{ type: "channel", string: "Channel: " + name, value: e.target.id, deterministic: deterministic }]
            updateChannelName(name)
            props.searchFilter && props.searchFilter.channels.map(data => {
                data.label === e.target.value && updateDeterministic(data.deterministic)
            })
            props.getValues('CHANNEL', temp_search_channel, '', '')
        }
    }

    const onChangeRadio = (e) => {
        const val = e.target.id
        updateChannelName(val)
    }

    const handleTopics = e => {
        let id = e.target.id
        let value = e.target.value
        let data = props.searchFilter && props.searchFilter.conversation.topics.filter(data => {
            if (id === data.id) {
                return data
            }
        })
        if (!e.target.checked) {
            let index = topicSelectedID && topicSelectedID.indexOf(id)
            let topicsId = topicSelectedID
            let subtopicId = subTopics
            let SELECTALL = allSelectedCheckBox
            let i = SELECTALL.indexOf(value)
            SELECTALL.splice(i, 1)
            updateAllSelectedCheckBox(SELECTALL)
            let data = props.searchFilter && props.searchFilter.conversation.topics.filter(d => {
                if (d.name === value) {
                    return d
                }
            })
            data[0].value.map(d1 => {
                subTopicSelectedID.map(d2 => {
                    if (d1 === d2) {
                        let s = subTopicSelectedID.indexOf(d1)
                        subTopicSelectedID.splice(s, 1)
                        setSubTopicSelectedID(subTopicSelectedID)
                    }
                })
            })
            if (index !== '' && index > -1) {
                topicsId.splice(index, 1)
                updateTopicSelectedID([...topicsId])
            }
            let index1 = subTopics.map(function (item) { return item.id; }).indexOf(id)
            if (index1 !== '' && index1 > -1) {
                subtopicId.splice(index1, 1)
                updateSubTopics([...subtopicId])
                updateAllSubTopics([])
                let STids = []
                subtopicId.map(data => data.value.map(dat => STids.push(dat)))
                updateAllSubTopics(STids)
            }
            let valueIndex = subTopicList.length > 0 && subTopicList.map((data, index) => { if (data.name === value) { return true } else return false })
            if (valueIndex.length > 0 && valueIndex.includes(true)) {
                let topiclist = subTopicList
                let i = valueIndex.indexOf(true)
                topiclist.splice(i, 1)
                updateSubTopicList([...topiclist])
            }
        }
        else if (e.target.checked) {
            updateTopicSelectedID(topicSelectedID.concat(id))
            updateSubTopics(subTopics.concat(data))
            updateAllSubTopics(allSubTopics.concat(data[0].value))
            // setSubTopicSelectedID(subTopicSelectedID.concat(data[0].value))
            updateSubTopicList(subTopicList.concat(data))
            updateAllSelectedCheckBox(allSelectedCheckBox.concat(value))
        }
        props.getValues('TOPICS', subTopicList, '', '')
    }

    const handleSubTopics = e => {
        let topic = e.target.id
        let subtopic = e.target.value
        let id = e.target.getAttribute('data-id')
        if (!e.target.checked) {
            if (subtopic === 'All') {
                let ALLTOPICS = props.searchFilter !== undefined && props.searchFilter.conversation.topics
                let FINALOBJ = subTopicList
                let SELECTALLKEYS = allSelectedCheckBox
                let CHECKBOXTICK = []
                FINALOBJ.map((data, index) => {
                    if (data.name === topic) {
                        FINALOBJ.splice(index, 1)
                        updateSubTopicList([...FINALOBJ])
                        let i = SELECTALLKEYS.indexOf(topic)
                        SELECTALLKEYS.splice(i, 1)
                        updateAllSelectedCheckBox([...SELECTALLKEYS])
                        FINALOBJ.map(dat => {
                            ALLTOPICS.map(da => {
                                da.name === dat.name && dat.value.map(d => CHECKBOXTICK.push(d))
                            })
                        })
                        setSubTopicSelectedID([...CHECKBOXTICK])
                    }
                })
            }
            else {
                let topicsId = subTopicSelectedID
                let i = subTopicSelectedID.indexOf(subtopic)
                subTopicSelectedID.splice(i, 1)
                setSubTopicSelectedID(subTopicSelectedID)
                let index = topicsId.indexOf(subtopic)
                if (index !== '' && index > -1) {
                    topicsId.splice(index, 1)
                    setSubTopicSelectedID([...topicsId])
                }
                let subtopicId = subTopicList
                let index1 = subtopicId.map(function (item) { return item.name; }).indexOf(topic)
                let index2 = subtopicId[index1].value.map(function (item) { return item; }).indexOf(subtopic)
                if (index1 > -1) {
                    if (subtopicId[index1].value.length > 1) {
                        subtopicId[index1].value.splice(index2, 1)
                        updateSubTopicList([...subtopicId])
                    }
                    else if (subtopicId[index1].value.length === 1) {
                        subtopicId.splice(index1, 1)
                        updateSubTopicList([...subtopicId])
                    }
                }
            }
        }
        else if (e.target.checked) {
            if (subtopic === 'All') {
                let ALLTOPICS = props.searchFilter !== undefined && props.searchFilter.conversation.topics
                let SELECTALLKEYS = allSelectedCheckBox
                SELECTALLKEYS.push(topic)
                updateAllSelectedCheckBox(SELECTALLKEYS)
                let FINALOBJ = subTopicList
                let existCheck = FINALOBJ.map(check => {
                    if (check.name === topic) {
                        return true
                    }
                    else { return false }
                })
                if (existCheck.indexOf(true) > -1) {
                    FINALOBJ.map((dat, ind) => {
                        if (dat.name === topic) {
                            let temp = ALLTOPICS.map((da, i) => da.name === topic ? i : '')
                            temp.map(d => {
                                if (d !== '') {
                                    FINALOBJ.splice(ind, 1)
                                    FINALOBJ.splice(ind, 0, ALLTOPICS[d])
                                    updateSubTopicList([...FINALOBJ])
                                    let newVal = subTopicSelectedID.concat(ALLTOPICS[d].value)
                                    const distinct = (value, index, self) => {
                                        return self.indexOf(value) === index
                                    }
                                    let a = newVal.filter(distinct)
                                    setSubTopicSelectedID([...a])
                                }
                            })
                        }
                    })
                }
                else {
                    ALLTOPICS.map(da => da.name === topic && FINALOBJ.push(da))
                    updateSubTopicList([...FINALOBJ])
                    ALLTOPICS.map(da => da.name === topic && setSubTopicSelectedID(subTopicSelectedID.concat(da.value)))
                }
            }
            else {
                if (allSelectedCheckBox.includes(topic) && !subTopicSelectedID.includes(subtopic)) {
                    let allSelected = allSelectedCheckBox
                    let i = allSelectedCheckBox.indexOf(topic)
                    allSelected.splice(i, 1)
                    updateAllSelectedCheckBox([...allSelected])
                    setSubTopicSelectedID(subTopicSelectedID.concat(subtopic))
                    let check = subTopicList.map(data => {
                        if (data.name === topic) {
                            return true
                        }
                        else { return false }
                    })
                    if (check.indexOf(true) > -1) {
                        subTopicList.map((data, index) => {
                            if (data.name === topic) {
                                subTopicList.splice(index, 1)
                                subTopicList.push({ name: topic, id, value: [subtopic] })
                                return updateSubTopicList(subTopicList)
                            }
                        })
                    }
                }
                else {
                    setSubTopicSelectedID(subTopicSelectedID.concat(subtopic))
                    let sub = subTopicList.map(data => { if (data.name === topic) { return true } else { return false } })
                    if (sub.includes(true)) {
                        subTopicList.map((data, index) => {
                            data.name === topic && subTopicList[index].value.push(subtopic)
                            return updateSubTopicList(subTopicList)
                        })
                    }
                    else {
                        updateSubTopicList(subTopicList.concat({ name: topic, value: [subtopic], id }))
                    }
                }
            }
        }
        props.getValues('TOPICS', subTopicList, '', '')
    }

    const titleCase = (str) => {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    const handleDateFilter = (e) => {
        let current_id = e.target.id

        if (current_id === 'Custom Range') {
            updateCurrentDate(current_id)
            updateCalenderToggle(true)
        } else {
            updateCalenderToggle(false)
            updateCurrentDate(current_id)
            let time = timezoneDateCalculator(current_id, props.user.timezone)
            updateDTR([time])
        }

        // let date_to = moment().subtract(1, 'days').format("YYYY-MM-DD") + "T23:59:59Z";

        // if (e.target.id === 'Anytime') {
        //     const day = e.target.id
        //     updateCurrentDate(day)
        //     updateCalenderToggle(false)
        //     updateDTR([{ type: 'date', string: 'Date: Anytime', from: '', to: '' }])
        // }
        // if (e.target.id === 'Yesterday') {
        //     let date_from = moment().subtract(1, 'days').format("YYYY-MM-DD") + "T00:00:00Z";
        //     let date_t = moment().subtract(1, 'days').format("YYYY-MM-DD") + "T23:59:59Z";
        //     const day = e.target.id
        //     updateCurrentDate(day)
        //     updateCalenderToggle(false)
        //     updateDTR([{ type: 'date', string: 'Date: Yesterday', from: date_from, to: date_to }])
        // }
        // if (e.target.id === 'Last 7 Days') {
        //     const day = e.target.id
        //     let date_from = moment().subtract(7, 'days').format("YYYY-MM-DD") + "T00:00:00Z";
        //     updateCalenderToggle(false)
        //     updateCurrentDate(day)
        //     updateDTR([{ type: 'date', string: "Date: Last 7 Days", from: date_from, to: date_to }])
        // }
        // if (e.target.id === 'Last 30 Days') {
        //     let date_from = moment().subtract(30, 'days').format("YYYY-MM-DD") + "T00:00:00Z";
        //     const day = e.target.id
        //     updateCalenderToggle(false)
        //     updateCurrentDate(day)
        //     updateDTR([{ type: 'date', string: 'Date: Last 30 Days', from: date_from, to: date_to }])
        // }
        // if (e.target.id === 'Last Month') {
        //     let date_fro = moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD") + "T00:00:00Z";
        //     let date_t = moment().subtract(1, 'months').endOf('month').format("YYYY-MM-DD") + "T23:59:59Z";
        //     const day = e.target.id
        //     updateCalenderToggle(false)
        //     updateCurrentDate(day)
        //     updateDTR([{ type: 'date', string: 'Date: Last Month', from: date_fro, to: date_t }])
        // }
        // if (e.target.id === 'This Month') {
        //     let date_fro = moment().startOf('month').format("YYYY-MM-DD") + "T00:00:00Z";
        //     let date_t = moment().format("YYYY-MM-DD") + "T23:59:59Z";
        //     const day = e.target.id
        //     let temp_finaldate = [{ type: 'date', string: "Date: " + e.target.id, from: date_fro, to: date_t }]
        //     updateCalenderToggle(false)
        //     updateCurrentDate(day)
        //     updateDTR([{ type: 'date', string: 'Date: This Month', from: date_fro, to: date_t }])
        // }
        // if (e.target.id === 'Custom Range') {
        //     const day = e.target.id
        //     updateCurrentDate(day)
        //     updateCalenderToggle(true)
        // }
        // let currentoption = e.target.id
        // updateCurrentDate(currentoption)
    }

    const onChangeDateRange = (date) => {

        let time = timezoneDateCalculator('Custom Range', props.user.timezone, date[0], date[1])

        // updateDTR([time])
        // updateRange([time])
        let search_conversation_date_to = moment(date[1]).format("YYYY-MM-DD") + "T23:59:59Z"
        let search_conversation_date_from = moment(date[0]).format("YYYY-MM-DD") + "T00:00:00Z"
        // console.log(search_conversation_date_from, search_conversation_date_to)
        updateDTR([{ type: 'date', string: 'Custom Range: ' + moment(search_conversation_date_from).format("DD/MM/YYYY") + ' - ' + moment(search_conversation_date_to).subtract(1, 'days').format("DD/MM/YYYY"), from: time.from, to: time.to }])
        updateRange([{ type: 'date', string: 'Custom Range: ' + moment(search_conversation_date_from).format("DD/MM/YYYY") + ' - ' + moment(search_conversation_date_to).subtract(1, 'days').format("DD/MM/YYYY"), from: moment(date[0]).format("MMM D YYYY"), to: moment(date[1]).format("MMM D YYYY") }])
    }

    const repChannelIdHandle = (e) => {
        e.preventDefault()
        let repName = e.target.getAttribute('data-name');
        let repID = e.target.getAttribute('data-rep');
        let temp = repId.concat({ repName, repID })
        updateRepId(temp)
        updatelastSelectedRep(repName)
        props.getValues('REPID', temp, '', '')
        document.getElementById(repID).disabled = true
    }

    const handleConversationChange = e => {
        let name = e.target.name
        let value = e.target.id
        if (name === 'connect') {
            if (!e.target.checked) {
                let index = connectChecked && connectChecked.indexOf(value)
                let connectId = connectChecked
                let connectArrId = connectArray
                if (index !== '' && index > -1) {
                    connectId.splice(index, 1)
                    connectArrId.splice(index, 1)
                    connectCheckedUpdate([...connectId])
                    UpdateconnectArray([...connectArrId])
                    delete conectObject[value]
                    props.getValues('CONNECT', connectArrId, conectObject, '')
                }
            }
            else {
                let cond = connectToggle
                let options = {
                    ...conectObject,
                    [value]: 1,
                    condition: cond
                };
                updateConnectObject({
                    ...conectObject,
                    ...options
                })
                let connectIds = connectChecked.concat(value)
                let connectArrIds = connectArray.concat({ type: "CONNECT", connectValue: value, string: "Connect: " + value, requestObj: 1 })
                connectCheckedUpdate(connectIds)
                UpdateconnectArray(connectArrIds)
                props.getValues('CONNECT', connectArrIds, options, '')
            }
        } else if (name === 'Bant') {
            let IDBANT = e.target.getAttribute('data-bantId');
            if (!e.target.checked) {
                let index = bantChecked && bantChecked.indexOf(IDBANT)
                let bantId = bantChecked
                let bantArrId = bantArray
                let arr = bantSelecteId
                let idIndex = arr.indexOf(IDBANT)
                arr.splice(idIndex, 1)
                updateBantSelectedId([...arr])
                if (index !== '' && index > -1) {
                    let cond = bantToggle
                    bantId.splice(index, 1)
                    bantArrId.splice(index, 1)
                    bantCheckedUpdate([...bantId])
                    UpdateBantArray([...bantArrId])
                    let options = {
                        ...bantObject,
                        ids: bantSelecteId,
                        condition: cond
                    }
                    // delete bantObject[value]
                    props.getValues('BANT', bantArrId, options, '')
                }
            }
            else {
                let cond = bantToggle
                let bantIds = bantChecked.concat(IDBANT)
                let bantArrIds = bantArray.concat({ type: "BANT", bantValue: IDBANT, string: "Bant: " + value, requestObj: 1 })
                let arr = bantSelecteId
                arr.push(IDBANT)
                updateBantSelectedId(arr)
                let options = {
                    ...bantObject,
                    ids: bantSelecteId,
                    condition: cond
                }
                updateBantObject({
                    ...bantObject,
                    ...options
                })
                bantCheckedUpdate(bantIds)
                UpdateBantArray(bantArrIds)
                console.log(bantArrIds, options)
                props.getValues('BANT', bantArrIds, options, '')
            }
            console.log(IDBANT, bantChecked)
        } else if (name === 'stage') {
            if (!e.target.checked) {
                let value = e.target.id.replace('-', '')
                let index = stageChecked && stageChecked.indexOf(value)
                let stageId = stageChecked
                let stageArrId = stateArray
                if (index !== '' && index > -1) {
                    stageId.splice(index, 1)
                    stageArrId.splice(index, 1)
                    updatedStageChecked([...stageId])
                    updateStageArray([...stageArrId])
                    props.getValues('BJO', stageArrId, stageId, '')
                }
            }
            else {
                let value = e.target.id.replace('-', '')
                let stageIds = stageChecked.concat(value)
                let stageArrIds = stateArray.concat({ type: "STAGE", stageValue: value, string: "Buying Stage Journey: " + value, requestObj: 1 })
                updatedStageChecked(stageIds)
                updateStageArray(stageArrIds)
                props.getValues('BJO', stageArrIds, stageIds, '')
            }
        } else if (name === 'speakers') {
            if (!e.target.checked) {
                let index = speakerChecked && speakerChecked.indexOf(value)
                let speakerId = speakerChecked
                let speakerArrId = speakerArray
                if (index !== '' && index > -1) {
                    speakerId.splice(index, 1)
                    speakerArrId.splice(index, 1)
                    updateSpeakerChecked([...speakerId])
                    updateSpeakerArray([...speakerArrId])
                    props.getValues('SPEAKERS', speakerArrId, speakerId, '')
                }
            }
            else {
                let speakerIds = speakerChecked.concat(value)
                let speakerArrIds = speakerArray.concat({ type: "speaker", string: "Speaker: " + value, value: value })
                updateSpeakerChecked(speakerIds)
                updateSpeakerArray(speakerArrIds)
                props.getValues('SPEAKERS', speakerArrIds, speakerIds, '')
            }
        } else if (name === 'dead_air') {
            if (!e.target.checked) {
                let index = deadAirChecked && deadAirChecked.indexOf(value)
                let deadAirId = deadAirChecked
                let deadAirArrId = deadAirArray
                if (index !== '' && index > -1) {
                    deadAirId.splice(index, 1)
                    deadAirArrId.splice(index, 1)
                    updateDeadAirChecked([...deadAirId])
                    updateDeadAirArray([...deadAirArrId])
                    props.getValues('DEAD_AIR', deadAirArrId, deadAirId, '')
                }
            }
            else {
                let deadAirIds = deadAirChecked.concat(value)
                let deadAirArrIds = deadAirArray.concat({ type: "DEAD_AIR", string: "Dead Air: " + value, value: value })
                updateDeadAirChecked(deadAirIds)
                updateDeadAirArray(deadAirArrIds)
                props.getValues('DEAD_AIR', deadAirArrIds, deadAirIds, '')
            }

        } else if (name === 'NOQ') {
            if (!e.target.checked) {
                let index = NOQChecked && NOQChecked.indexOf(value)
                let NOQId = NOQChecked
                let NOQArrId = NOQArray
                let rq = NOQrequestObj
                if (index !== '' && index > -1) {
                    NOQId.splice(index, 1)
                    NOQArrId.splice(index, 1)
                    rq.splice(index, 1)
                    updateNOQChecked([...NOQId])
                    UpdateNOQArray([...NOQArrId])
                    updateNOQrequestObj([...rq])
                    props.getValues('NOQ', NOQArrId, rq, '')
                }
            }
            else {
                let rq = []
                let val = value.split('-')
                let NOQIds = NOQChecked.concat(value)
                let NOQArrIds = []
                updateNOQChecked(NOQIds)
                let NOQvalue = value.split('-')
                if (value === "10+-") {
                    rq = NOQrequestObj.concat({ min: '10', max: '10+' })
                    updateNOQrequestObj(rq)
                    NOQArrIds = NOQArray.concat({ type: "NOQ", string: 'No of questions: 10-10+', no_questions_min: '10', no_questions_max: '+' })
                    UpdateNOQArray(NOQArrIds)
                    props.getValues('NOQ', NOQArrIds, rq, '')
                }
                else {
                    rq = NOQrequestObj.concat({ min: val[0], max: val[1] })
                    updateNOQrequestObj(rq)
                    NOQArrIds = NOQArray.concat({ type: "NOQ", string: 'No of questions: ' + NOQvalue[0] + "-" + NOQvalue[1], no_questions_min: NOQvalue[0], no_questions_max: NOQvalue[1] })
                    UpdateNOQArray(NOQArrIds)
                    props.getValues('NOQ', NOQArrIds, rq, '')
                }
            }
        } else if (name === 'duration') {
            let value = e.target.id
            let durationValue = value.split('-')
            if (!e.target.checked) {
                let index = durationChecked && durationChecked.indexOf(value)
                let durationId = durationChecked
                let durationArrId = durationArray
                let rq1 = durationRequestObj
                if (index !== '' && index > -1) {
                    durationId.splice(index, 1)
                    durationArrId.splice(index, 1)
                    rq1.splice(index, 1)
                    console.log(durationId)
                    updateDurationChecked([...durationId])
                    updateDurationArray([...durationArrId])
                    updateDurationRequestObj([...rq1])
                    props.getValues('DURATION', durationArrId, rq1, '')
                }
            }
            else {
                let rq1 = []
                let durationIds = durationChecked.concat(value)
                let durationArrIds = []
                console.log(durationIds)
                updateDurationChecked(durationIds)
                if (value === "30-+") {
                    rq1 = durationRequestObj.concat({ min: '30', max: '+' })
                    updateDurationRequestObj(rq1)
                    durationArrIds = durationArray.concat({ type: 'duration', string: 'Duration: 30-30+', duration_min: '30', duration_max: '+' })
                    updateDurationArray(durationArrIds)
                }
                else {
                    rq1 = durationRequestObj.concat({ min: durationValue[0], max: durationValue[1] })
                    updateDurationRequestObj(rq1)
                    durationArrIds = durationArray.concat({ type: 'duration', string: 'Duration: ' + durationValue[0] + '-' + durationValue[1], duration_min: durationValue[0], duration_max: durationValue[1] })
                    updateDurationArray(durationArrIds)
                }
                props.getValues('DURATION', durationArrIds, rq1, '')
            }
        } else if (name === 'monologue') {
            if (!e.target.checked) {
                let index = monologueChecked && monologueChecked.indexOf(value)
                let monologueId = monologueChecked
                let monologueArrId = monologueArray
                let rq2 = monoRequestObject
                if (index !== '' && index > -1) {
                    monologueId.splice(index, 1)
                    monologueArrId.splice(index, 1)
                    rq2.splice(index, 1)
                    updateMonologueChecked([...monologueId])
                    UpdateMonologueArray([...monologueArrId])
                    updateMonoRequestObject([...rq2])
                    props.getValues('MONOLOGUE', monologueArrId, rq2, '')
                }
            }
            else {
                let rq2 = []
                let monologueValue = value.split('-')
                let monologueIds = monologueChecked.concat(value)
                let monologueArrIds = []
                updateMonologueChecked(monologueIds)
                if (value === "10+--") {
                    rq2 = monoRequestObject.concat({ min: '10', max: '10+' })
                    updateMonoRequestObject(rq2)
                    monologueArrIds = monologueArray.concat({ type: "monologue_conv", string: 'Monologue Conversation: 10-10+', monologue_min: '10', monologue_max: '+' })
                    UpdateMonologueArray(monologueArrIds)
                } else {
                    rq2 = monoRequestObject.concat({ min: monologueValue[0], max: monologueValue[1] })
                    updateMonoRequestObject(rq2)
                    monologueArrIds = monologueArray.concat({ type: "monologue_conv", string: 'Monologue Conversation: ' + monologueValue[0] + '-' + monologueValue[1], monologue_min: monologueValue[0], monologue_max: monologueValue[1] })
                    UpdateMonologueArray(monologueArrIds)
                }
                props.getValues('MONOLOGUE', monologueArrIds, rq2, '')
            }
        } else if (name === 'interaction_switches') {
            if (!e.target.checked) {
                let index = interactionSwitchesChecked && interactionSwitchesChecked.indexOf(value)
                let interactionSwitchesId = interactionSwitchesChecked
                let interactionSwitchesArrId = interactionSwitchesArray
                if (index !== '' && index > -1) {
                    interactionSwitchesId.splice(index, 1)
                    interactionSwitchesArrId.splice(index, 1)
                    UpdateinteractionSwitchesChecked([...interactionSwitchesId])
                    updateinteractionSwitchesArray([...interactionSwitchesArrId])
                    props.getValues('INTERACTIVITY', interactionSwitchesArrId, interactionSwitchesId, '')
                }
            }
            else {
                let val = value.split("-")
                let interactionSwitchesIds = interactionSwitchesChecked.concat(value)
                let interactionSwitchesArrIds = interactionSwitchesArray.concat({ type: "interactivity_tricles", interactivity_tricles: val[0], string: "interactivity Class: " + val[0] })
                UpdateinteractionSwitchesChecked(interactionSwitchesIds)
                updateinteractionSwitchesArray(interactionSwitchesArrIds)
                props.getValues('INTERACTIVITY', interactionSwitchesArrIds, interactionSwitchesIds, '')
            }
        } else if (name === 'sentiments') {
            if (!e.target.checked) {
                let index = sentimentChecked && sentimentChecked.indexOf(value)
                let sentimentsId = sentimentChecked
                let sentimentArrId = sentimentArray
                if (index !== '' && index > -1) {
                    sentimentsId.splice(index, 1)
                    sentimentArrId.splice(index, 1)
                    updatedSentimentChecked([...sentimentsId])
                    updateSentimentArray([...sentimentArrId])
                    props.getValues('SENTIMENT', sentimentArrId, sentimentsId, '')
                }
            }
            else {
                let sentimentsIds = sentimentChecked.concat(value)
                let sentimentsArrIds = sentimentArray.concat({ type: 'sentiment_polarity', string: 'Customer Sentiment: ' + value, sentiment: value })
                updatedSentimentChecked(sentimentsIds)
                updateSentimentArray(sentimentsArrIds)
                props.getValues('SENTIMENT', sentimentsArrIds, sentimentsIds, '')
            }
        } else if (name === "mobile_mention") {
            let val = e.target.value
            if (val === "any") {
                let temp_mobilemention = [{ type: e.target.name, mobilemention: "", mmVal: val, string: "Mobile Mentions: " + e.target.value }]
                updateMobileMention(temp_mobilemention)
                props.getValues('MOBILE_MENTION', temp_mobilemention, '', '')
            }
            else if (val === 'yes') {
                let temp_mobilemention = [{ type: e.target.name, mobilemention: 1, mmVal: val, string: "Mobile Mentions: " + e.target.value }]
                updateMobileMention(temp_mobilemention)
                props.getValues('MOBILE_MENTION', temp_mobilemention, '', '')
            }
            else if (val === 'No') {
                let temp_mobilemention = [{ type: e.target.name, mobilemention: 0, mmVal: val, string: "Mobile Mentions: " + e.target.value }]
                updateMobileMention(temp_mobilemention)
                props.getValues('MOBILE_MENTION', temp_mobilemention, '', '')
            }
        }
        else if (name === "email-mention") {
            let val = e.target.value
            if (val === "any") {
                let temp_emailmention = [{ type: e.target.name, emailmention: '', emVal: val, string: "Email Mention: " + e.target.value }]
                updateEmailMention(temp_emailmention)
                props.getValues('EMAIL_MENTION', temp_emailmention, '', '')
            }
            else if (val === 'yes') {
                let temp_emailmention = [{ type: e.target.name, emailmention: 1, emVal: val, string: "Email Mention: " + e.target.value }]
                updateEmailMention(temp_emailmention)
                props.getValues('EMAIL_MENTION', temp_emailmention, '', '')
            }
            else if (val === "No") {
                let temp_emailmention = [{ type: e.target.name, emailmention: 0, emVal: val, string: "Email Mention: " + e.target.value }]
                updateEmailMention(temp_emailmention)
                props.getValues('EMAIL_MENTION', temp_emailmention, '', '')
            }
        }
        else if (name === 'opportunity') {
            let val = e.target.value
            if (val === 'any') {
                let temp_emailmention = [{ type: e.target.name, opportunity: "", oppVal: val, string: "Opportunity: " + e.target.value }]
                updateOpportunity(temp_emailmention)
                props.getValues('OPPORTUNITY', temp_emailmention, '', '')
            }
            else if (val === 'yes') {
                let temp_emailmention = [{ type: e.target.name, opportunity: 1, oppVal: val, string: "Opportunity: " + e.target.value }]
                updateOpportunity(temp_emailmention)
                props.getValues('OPPORTUNITY', temp_emailmention, '', '')
            }
            else if (val === 'No') {
                let temp_emailmention = [{ type: e.target.name, opportunity: 0, oppVal: val, string: "Opportunity: " + e.target.value }]
                updateOpportunity(temp_emailmention)
                props.getValues('OPPORTUNITY', temp_emailmention, '', '')
            }
        } else if (name === "next-steps") {
            let val = e.target.value
            if (val === 'any') {
                let next_step = [{ type: "next_steps", next_steps: "", NSVal: val, string: "Next Steps: " + e.target.value }]
                updateNextSteps(next_step)
                props.getValues('NEXT_STEPS', next_step, '', '')
            }
            else if (val === 'yes') {
                let next_step = [{ type: "next_steps", next_steps: 1, NSVal: val, string: "Next Steps: " + e.target.value }]
                updateNextSteps(next_step)
                props.getValues('NEXT_STEPS', next_step, '', '')
            }
            else if (val === 'no') {
                let next_step = [{ type: "next_steps", next_steps: 0, NSVal: val, string: "Next Steps: " + e.target.value }]
                updateNextSteps(next_step)
                props.getValues('NEXT_STEPS', next_step, '', '')
            }
        }
        else if (name === "feedback") {
            let val = e.target.value
            if (val === 'any') {
                let feed = [{ type: "feedback", feedback: "", feedVal: val, string: "Feedback: " + e.target.value }]
                updateFeedback(feed)
                props.getValues('FEEDBACK', feed, '', '')
            }
            else if (val === 'yes') {
                let feed = [{ type: "feedback", feedback: 1, feedVal: val, string: "Feedback: " + e.target.value }]
                updateFeedback(feed)
                props.getValues('FEEDBACK', feed, '', '')
            }
            else if (val === 'no') {
                let feed = [{ type: "feedback", feedback: 0, feedVal: val, string: "Feedback: " + e.target.value }]
                updateFeedback(feed)
                props.getValues('FEEDBACK', feed, '', '')
            }
        }
        else if (name === "crm") {
            let val = e.target.value
            if (val === 'any') {
                let crm = [{ type: "CRM", CRM: "", crmVal: val, string: "CRM: " + e.target.value }]
                updateCrm(crm)
                props.getValues('CRM', crm, '', '')
            }
            else if (val === 'yes') {
                let crm = [{ type: "CRM", CRM: 1, crmVal: val, string: "CRM: " + e.target.value }]
                updateCrm(crm)
                props.getValues('CRM', crm, '', '')
            }
            else if (val === 'no') {
                let crm = [{ type: "CRM", CRM: 0, crmVal: val, string: "CRM: " + e.target.value }]
                updateCrm(crm)
                props.getValues('CRM', crm, '', '')
            }
        }
    }

    useEffect(() => {
        switch (props.removePills[0]) {
            case 'CHANNEL':
                updateChannelName('')
                break;
            case 'DATE':
                updateDTR([])
                updateCurrentDate()
                break;
            case 'SPEAKER':
                let remove = props.removePills[1]
                let index = speakerChecked.indexOf(remove)
                let speakerId = speakerChecked
                let speakerArrId = speakerArray
                if (index !== '' && index > -1) {
                    speakerId.splice(index, 1)
                    speakerArrId.splice(index, 1)
                    updateSpeakerChecked([...speakerId])
                    updateSpeakerArray([...speakerArrId])
                    props.getValues('SPEAKERS', speakerArrId, speakerId, '')
                }
                break;
            case 'REPS':
                updateRepId(props.removePills[1])
                updatelastSelectedRep('Select Reps')
                break;
            case 'TOPIC':
                let T = []
                let t = []
                props.topics.map((data) => {
                    T.push(data.id)
                    updateTopicSelectedID(T)
                    props.searchFilter && props.searchFilter.conversation.topics.map(dat => {
                        if (data.name === dat.name) {
                            t.push(dat)
                            updateSubTopics(t)
                        }
                    })
                })
                if (props.topics.length === 0) {
                    updateTopicSelectedID([])
                    updateSubTopics([])
                    updateAllSelectedCheckBox([])
                }
                let ST = []
                props.topics.map((data) => {
                    data.value.map(dat => {
                        ST.push(dat)
                    })
                })
                setSubTopicSelectedID(ST)
                break;
            case 'DEADAIR':
                let DAvalue = props.removePills[1]
                let DAindex = deadAirChecked && deadAirChecked.indexOf(DAvalue)
                let deadAirId = deadAirChecked
                let deadAirArrId = deadAirArray
                if (DAindex !== '' && DAindex > -1) {
                    deadAirId.splice(DAindex, 1)
                    let temp = deadAirArrId.filter(data => data.value !== DAvalue)
                    updateDeadAirChecked([...deadAirId])
                    updateDeadAirArray([...temp])
                    props.getValues('DEAD_AIR', temp, deadAirId, '')
                }
                break;
            case 'INTERACTIVITY':
                let ITvalue = props.removePills[1] + "-"
                let ITindex = interactionSwitchesChecked && interactionSwitchesChecked.indexOf(ITvalue)
                let interactionSwitchesId = interactionSwitchesChecked
                let interactionSwitchesArrId = interactionSwitchesArray
                if (ITindex !== '' && ITindex > -1) {
                    interactionSwitchesId.splice(ITindex, 1)
                    let temp1 = interactionSwitchesArrId.filter(data => data.interactivity_tricles !== props.removePills[1])
                    UpdateinteractionSwitchesChecked([...interactionSwitchesId])
                    updateinteractionSwitchesArray([...temp1])
                    props.getValues('INTERACTIVITY', temp1, interactionSwitchesId, '')
                }
                break;
            case 'NOQ':
                let NOQvalue = props.removePills[1] + '-'
                if (NOQvalue === '10-10+-') { NOQvalue = '10+-' }
                let NOQindex = NOQChecked && NOQChecked.indexOf(NOQvalue)
                let NOQId = NOQChecked
                let NOQArrId = NOQArray
                if (NOQindex !== '' && NOQindex > -1) {
                    NOQId.splice(NOQindex, 1)
                    let temp2 = NOQArrId.filter(data => (data.no_questions_min + '-' + data.no_questions_max) !== props.removePills[1])
                    updateNOQChecked([...NOQId])
                    UpdateNOQArray([...temp2])
                    props.getValues('NOQ', temp2, NOQId, '')
                }
                break;
            case 'DURATION':
                let Dvalue = props.removePills[1]
                if (Dvalue === '25-25+') { Dvalue = '25+' }
                let Dindex = durationChecked && durationChecked.indexOf(Dvalue)
                let durationId = durationChecked
                let durationArrId = durationArray
                if (Dindex !== '' && Dindex > -1) {
                    durationId.splice(Dindex, 1)
                    let temp3 = durationArrId.filter(data => (data.duration_min + '-' + data.duration_max) !== props.removePills[1])
                    updateDurationChecked([...durationId])
                    updateDurationArray([...temp3])
                    props.getValues('DURATION', temp3, durationId, '')
                }
                break;
            case 'MONO':
                let Mvalue = props.removePills[1] + '--'
                if (Mvalue === '10+---') { Mvalue = '10+--' }
                let Mindex = monologueChecked && monologueChecked.indexOf(Mvalue)
                let monologueId = monologueChecked
                let monologueArrId = monologueArray
                if (Mindex !== '' && Mindex > -1) {
                    monologueId.splice(Mindex, 1)
                    let temp4 = monologueArrId.filter(data => (data.monologue_min + '-' + data.monologue_max) !== props.removePills[1])
                    updateMonologueChecked([...monologueId])
                    UpdateMonologueArray([...temp4])
                    props.getValues('MONOLOGUE', temp4, monologueId, '')
                }
                break;
            case 'SENTIMENT':
                let Svalue = props.removePills[1]
                let Sindex = sentimentChecked && sentimentChecked.indexOf(Svalue)
                let sentimentsId = sentimentChecked
                let sentimentArrId = sentimentArray
                if (Sindex !== '' && Sindex > -1) {
                    sentimentsId.splice(Sindex, 1)
                    let temp5 = sentimentArrId.filter(data => data.sentiment !== props.removePills[1])
                    updatedSentimentChecked([...sentimentsId])
                    updateSentimentArray([...temp5])
                    props.getValues('SENTIMENT', temp5, sentimentsId, '')
                }
                break;
            case 'EMAILMENTION':
                updateEmailMention([])
                break;
            case 'MOBILEMENTION':
                updateMobileMention([])
                break;
            case 'OPPORTUNITY':
                updateOpportunity([])
                updatedStageChecked([])
                props.getValues('BJO', [], [], '')
                break;
            case 'BJO':
                let BJOvalue = props.removePills[1]
                let BJOindex = stageChecked && stageChecked.indexOf(BJOvalue)
                let stageId = stageChecked
                let stageArrId = stateArray
                if (BJOindex !== '' && BJOindex > -1) {
                    let temp7 = stageArrId.filter(data => data.stageValue !== BJOvalue)
                    stageId.splice(BJOindex, 1)
                    stageArrId.splice(BJOindex, 1)
                    updatedStageChecked([...stageId])
                    updateStageArray([...temp7])
                    props.getValues('BJO', temp7, stageId, '')
                }
                break;
            case 'BANT':
                let BANTvalue = props.removePills[1]
                let BANTindex = bantChecked && bantChecked.indexOf(BANTvalue)
                let bantId = bantChecked
                let bantArrId = bantArray
                if (BANTindex !== '' && BANTindex > -1) {
                    bantId.splice(BANTindex, 1)
                    let temp6 = bantArrId.filter(data => data.bantValue !== BANTvalue)
                    bantCheckedUpdate([...bantId])
                    UpdateBantArray([...temp6])
                    bantObject.ids.splice(BANTindex, 1)
                    props.getValues('BANT', temp6, bantObject, '')
                }
                break;
            case 'NEXTSTEPS':
                updateNextSteps([])
            case 'FEEDBACK':
                updateFeedback([])
                break;
            case 'CONNECT':
                let CONNECTvalue = props.removePills[1]
                let CONNECTindex = connectChecked && connectChecked.indexOf(CONNECTvalue)
                let connectId = connectChecked
                let connectArrId = connectArray
                if (CONNECTindex !== '' && CONNECTindex > -1) {
                    connectId.splice(CONNECTindex, 1)
                    let temp7 = connectArrId.filter(data => data.connectValue !== CONNECTvalue)
                    connectCheckedUpdate([...connectId])
                    UpdateconnectArray([...temp7])
                    delete conectObject[CONNECTvalue]
                    props.getValues('CONNECT', temp7, conectObject, '')
                }
                break;
            case 'CRM':
                updateCrm([])
                break;
        }
    }, [props.removePills, props.topics, props.bool])

    const searchInput = e => {
        const { value, name } = e.target
        updateSearchKey(value)
        let data = []
        if (name === "topic") {
            data = props.searchFilter && props.searchFilter.conversation.topics.filter(data => {
                if (((data.name).toLowerCase()).includes((value).toLowerCase())) {
                    return data.name
                }
            })
        }
        if (name === "subtopic") {
            data = subTopics && subTopics.map(dataa => {
                return dataa.value.filter(dat => {
                    if (((dat).toLowerCase()).includes((value).toLowerCase())) {
                        return dat
                    }
                })
            })
        }
        setFilter(data)
        window.jQuery('.dropdown').on('hide.bs.dropdown', function () {
            updateSearchKey('');
            setFilter([])
        })
    }

    const toggleCondition = e => {
        let toggleName = e.target.id
        if (e.target.checked) {
            if (toggleName === 'connect') {
                let labelAND = 'OR'
                updateConnectToggle(labelAND)
                let options = {
                    ...conectObject,
                    condition: labelAND
                };
                updateConnectObject({
                    ...conectObject,
                    ...options
                })
                props.getValues('CONNECT', connectArray, options, '')
            }
            if (toggleName === 'bant') {
                let labelOR = 'OR'
                updateBantToggle(labelOR)
                let options = {
                    ...bantObject,
                    condition: labelOR
                }
                updateBantObject({
                    ...bantObject,
                    ...options
                })
                props.getValues('BANT', bantArray, options, '')
            }
        }
        else if (!e.target.checked) {
            if (toggleName === 'connect') {
                let labelAND = 'AND'
                updateConnectToggle(labelAND)
                let options = {
                    ...conectObject,
                    condition: labelAND
                };
                updateConnectObject({
                    ...conectObject,
                    ...options
                })
                props.getValues('CONNECT', connectArray, options, '')
            }
            if (toggleName === 'bant') {
                let labelOR = 'AND'
                updateBantToggle(labelOR)
                let options = {
                    ...bantObject,
                    condition: labelOR
                }
                updateBantObject({
                    ...bantObject,
                    ...options
                })
                props.getValues('BANT', bantArray, options, '')
            }
        }
    }
    // console.log(props.searchFilter && Object.entries(props.searchFilter.conversation.connect).sort((a,b)=>b[0].localeCompare(a[0])).map((data)=>{ console.log(data[0])}) )
    return (
        <React.Fragment>
            <div className={props.collection ? "filter-wrap animated fadeInLeft" : ""} >
                <div className="filter-head">
                    <div className="back-btn">
                        {props.back && <a href="#" onClick={() => { props.close() }}><i className="icon-arrow-lhs"></i> Back</a>}
                    </div>
                    <div className="reset-filter-btn" >
                        <button value="reset" onClick={resetFilter}>Reset Filters</button>
                    </div>
                </div>
                <Scrollbar>
                    <div className="filter-content">
                        <div className="accordion" id="filterAccordian">
                            <div className="card">
                                <div className="card-header" id="channel">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseChannel" aria-expanded="false" aria-controls="collapseChannel">
                                            Channel: {channelName}
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
                                            <ul className="options" onChange={channelFilter}>
                                                <li>
                                                    <div className="radioContainer">
                                                        <input type="radio" id="AllChannel" name="filter" value="All Channels" className="radio-btn" onChange={onChangeRadio} checked={channelName === 'All Channels'} />
                                                        <span className="virtual-radio"></span>
                                                        <span className="radio-text">All Channels</span>
                                                    </div>
                                                </li>
                                                {
                                                    props.searchFilter && props.searchFilter.channels.map((data, index) => {
                                                        return <li key={index}>
                                                            <div className="radioContainer">
                                                                <input type="radio" id={data.id} data-deterministic={data.deterministic} name="filter" value={data.label} className="radio-btn" onChange={onChangeRadio} checked={channelName === data.label}
                                                                />
                                                                <span className="virtual-radio"></span>
                                                                <span className="radio-text">{data.label}</span>
                                                            </div>
                                                        </li>
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header" id="Date">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseDate" aria-expanded="false" aria-controls="collapseDate">
                                            Date: {currentDate}
                                            <span className="accordian-dropdown-icon">
                                                <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                                <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />
                                            </span>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseDate" className="collapse" aria-labelledby="Date" data-parent="#filterAccordian">
                                    <div className="card-body">
                                        <div className="date-options">
                                            <ul className="options" onChange={handleDateFilter}>
                                                {
                                                    props.searchFilter && props.date.map((data, index) => {
                                                        return <li key={Math.random()}>
                                                            <div className="radioContainer">
                                                                <input type="radio" id={data.id} name="followup" value={data.value} className="radio-btn" checked={currentDate === data.id} />
                                                                <span className="virtual-radio"></span>
                                                                <span className="radio-text">{data.id}</span>
                                                            </div>
                                                        </li>
                                                    })
                                                }
                                                {
                                                    calenderToggle && <React.Fragment>
                                                        <div className="date-custom-range date-search-range">
                                                            {/* {console.log(dateRange[0].from)} */}
                                                            {
                                                               dateRange!== undefined && dateRange.length >0 &&
                                                                <div className="cal-custom-range">
                                                                    <span className="first-span">
                                                                        <span className="date-range">Start Date</span>
                                                                        {dateRange[0].from}
                                                                    </span>
                                                                    <span className="toColor">TO</span>
                                                                    <span className="last-span">
                                                                        <span className="date-range">End Date</span>
                                                                        {dateRange[0].to}
                                                                    </span>
                                                                </div>
                                                            }
                                                            <DateRangePicker
                                                                isOpen={true} //default open state
                                                                maxDate={new Date()} // cannot select more than today
                                                                onChange={onChangeDateRange} //API call here
                                                                onCalendarClose={() => {
                                                                    var datePicker = document.getElementsByClassName('react-daterange-picker__calendar--closed')[0];
                                                                    datePicker.classList.remove('react-daterange-picker__calendar--closed')
                                                                    datePicker.classList.add('react-daterange-picker__calendar--open')
                                                                    updateCalenderToggle(true)
                                                                }}
                                                                className="displaynoneinput"
                                                            />
                                                        </div>
                                                    </React.Fragment>
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                channelName !== 'All Channels' && props.speakers && deterministic && <div className="card">
                                    <div className="card-header" id="stats">
                                        <h2 className="mb-0">
                                            <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseSpeakers" aria-expanded="false" aria-controls="collapsestats">
                                                Speakers
                                            <span className="accordian-dropdown-icon">
                                                    <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                                    <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />
                                                </span>
                                            </button>
                                        </h2>
                                    </div>
                                    <div id="collapseSpeakers" className="collapse" aria-labelledby="stats" data-parent="#filterAccordian">
                                        <div className="card-body">
                                            {
                                                <ul onChange={handleConversationChange}>
                                                    {
                                                        props.speakers && props.speakers.map((data) => {
                                                            return <li key={uuid()}>
                                                                <div className="custom-control custom-checkbox">
                                                                    <input type="checkbox" name='speakers' checked={speakerChecked.includes(data.id)} className="custom-control-input default-checkbox" id={data.id} />
                                                                    <label className="custom-control-label default-font" for={data.id}>{data.id === 'prospect' ? 'Customers' : data.value}</label>
                                                                </div>
                                                            </li>
                                                        })
                                                    }
                                                </ul>
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="card">
                                <div className="card-header" id="stats">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseReps" aria-expanded="false" aria-controls="collapsestats">
                                            Reps
                                                <span className="accordian-dropdown-icon">
                                                <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                                <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />
                                            </span>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseReps" className="collapse" aria-labelledby="stats" data-parent="#filterAccordian">
                                    <div className="card-body">
                                        <div className="select-box">
                                            <div className="dropdown">
                                                <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                    {lastSelectedRep}
                                                </button>
                                                <div className="dropdown-menu pad0">
                                                    {
                                                        props.repChannelId && props.repChannelId.map((data, index) => {
                                                            return <button id={data.rep_id} key={index} className="dropdown-item set-anchor" href="#"
                                                                data-name={data.name}
                                                                data-rep={data.rep_id}
                                                                onClick={repChannelIdHandle}
                                                            >{data.name}</button>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header" id="stats">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTopics" aria-expanded="false" aria-controls="collapsestats">
                                            Topics
                                                <span className="accordian-dropdown-icon">
                                                <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                                <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />
                                            </span>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseTopics" className="collapse" aria-labelledby="stats" data-parent="#filterAccordian">
                                    <div className="card-body">
                                        <div className="select-box topic-selector">
                                            <div className="dropdown">
                                                <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                    Select Topic(s)
                                                </button>
                                                <div className="dropdown-menu set-relative top-neg-10 transform-3d-0">
                                                    <ul>
                                                        {
                                                            props.searchFilter && props.searchFilter.conversation.topics.length > 10 &&
                                                            <span className="searchList">
                                                                <i className="icon-search"></i><input type="text" name="topic" placeholder="Search Topic" onChange={searchInput} value={searchKey} />
                                                            </span>
                                                        }
                                                        {
                                                            searchKey === '' ? props.searchFilter && props.searchFilter.conversation.topics.map((data) => {
                                                                return <li key={uuid()}>
                                                                    <div className="form-group dropDownText checkboxContainer">
                                                                        <input name="isGoing" type="checkbox" id={data.id} value={data.name} onChange={handleTopics} checked={topicSelectedID.includes(data.id)} />
                                                                        <span className="checkBoxText">{data.name}</span>
                                                                        <span className="virtualBox"></span>
                                                                    </div>
                                                                </li>
                                                            }) : filterData.map((data) => {
                                                                return <li key={uuid()}>
                                                                    <div className="form-group dropDownText checkboxContainer">
                                                                        <input name="isGoing" type="checkbox" id={data.id} value={data.name} onChange={handleTopics} checked={topicSelectedID.includes(data.id)} />
                                                                        <span className="checkBoxText">{data.name}</span>
                                                                        <span className="virtualBox"></span>
                                                                    </div>
                                                                </li>
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            subTopics.length > 0 && <div className="select-box topic-selector">
                                                <div className="dropdown">
                                                    <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                        Select Sub Topic(s)
                                                </button>
                                                    <div className="dropdown-menu set-relative top-neg-10 transform-3d-0">
                                                        <ul className="sub-topic-list">
                                                            {
                                                                allSubTopics.length > 10 &&
                                                                <span className="searchList">
                                                                    <i className="icon-search"></i><input type="text" name="subtopic" placeholder="Search Subtopic" onChange={searchInput} value={searchKey} />
                                                                </span>
                                                            }
                                                            {
                                                                searchKey === '' ? subTopics.length > 0 && subTopics.map((data, index) => {
                                                                    return <React.Fragment key={index}>
                                                                        <h4 className="sub-topic-title">{data.name}</h4>
                                                                        <li>
                                                                            <div className="form-group dropDownText checkboxContainer">
                                                                                <input name="isGoing" type="checkbox" id={data.name} value='All' onChange={handleSubTopics} checked={allSelectedCheckBox.includes(data.name)} data-id='All' />
                                                                                <span className="checkBoxText">Select All</span>
                                                                                <span className="virtualBox"></span>
                                                                            </div>
                                                                        </li>
                                                                        {
                                                                            data.value.map((dat) => {
                                                                                return <li key={uuid()}>
                                                                                    <div className="form-group dropDownText checkboxContainer">
                                                                                        <input name="isGoing" type="checkbox" id={data.name} value={dat} onChange={handleSubTopics} checked={subTopicSelectedID.includes(dat)} data-id={data.id} />
                                                                                        <span className="checkBoxText">{dat}</span>
                                                                                        <span className="virtualBox"></span>
                                                                                    </div>
                                                                                </li>
                                                                            })
                                                                        }
                                                                    </React.Fragment>
                                                                }) : filterData.map((data, index) => (
                                                                    data.length > 0 && <React.Fragment key={index}>
                                                                        <h4 className="sub-topic-title">{props.searchFilter.conversation.topics[index].name}</h4>
                                                                        {
                                                                            data.map((dat, ind) => {
                                                                                return <li key={uuid()}>
                                                                                    <div className="form-group dropDownText checkboxContainer">
                                                                                        <input name="isGoing" type="checkbox" id={props.searchFilter.conversation.topics[index].name} value={dat} onChange={handleSubTopics} checked={subTopicSelectedID.includes(dat)} data-id={data.id} />
                                                                                        <span className="checkBoxText">{dat}</span>
                                                                                        <span className="virtualBox"></span>
                                                                                    </div>
                                                                                </li>
                                                                            })
                                                                        }
                                                                    </React.Fragment>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header" id="stats">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseInteractivity" aria-expanded="false" aria-controls="collapsestats">
                                            Engagement
                                                <span className="accordian-dropdown-icon">
                                                <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                                <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />
                                            </span>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseInteractivity" className="collapse" aria-labelledby="stats" data-parent="#filterAccordian">
                                    <div className="card-body">
                                        <ul onChange={handleConversationChange}>
                                            <h4 className="search-sidebar-title">Dead Air Class</h4>
                                            {
                                                props.searchFilter && props.searchFilter.conversation.interactivity.dead_air.class.map((data) => {
                                                    return <li key={uuid()}>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" name='dead_air' checked={deadAirChecked.includes(data)} className="custom-control-input default-checkbox" id={data} />
                                                            <label className="custom-control-label default-font" for={data}>{titleCase(data)}</label>
                                                        </div>
                                                    </li>
                                                })
                                            }
                                            <hr />
                                            <h4 className="search-sidebar-title">Interactivity</h4>
                                            {
                                                props.searchFilter && props.searchFilter.conversation.interactivity.interaction_switches.class.map((data) => {
                                                    return <li key={uuid()}>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" name='interaction_switches' checked={interactionSwitchesChecked.includes(data + '-')} className="custom-control-input default-checkbox" id={data + '-'} />
                                                            <label className="custom-control-label default-font" for={data + "-"}>{titleCase(data)}</label>
                                                        </div>
                                                    </li>

                                                })
                                            }
                                            <hr />
                                            <h4 className="search-sidebar-title">Number of Question</h4>
                                            {
                                                props.searchFilter && props.searchFilter.conversation.interactivity.no_of_questions.range.map((data) => {
                                                    return <li key={uuid()}>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" checked={NOQChecked.includes(data + "-")} name='NOQ' className="custom-control-input default-checkbox" id={data + "-"} />
                                                            <label className="custom-control-label default-font" for={data + "-"}>{data}</label>
                                                        </div>
                                                    </li>
                                                })
                                            }
                                            <hr />
                                            <h4 className="search-sidebar-title">Duration</h4>
                                            {
                                                props.searchFilter && props.searchFilter.conversation.interactivity.duration.range.map((data, index) => {
                                                    return <li key={uuid()}>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" name="duration" checked={durationChecked.includes(data.key)} className="custom-control-input default-checkbox" id={data.key} />
                                                            <label className="custom-control-label default-font" for={data.key}>{data.label}</label>
                                                        </div>
                                                    </li>
                                                })
                                            }
                                            <hr />
                                            <h4 className="search-sidebar-title">Monologues</h4>
                                            {
                                                props.searchFilter && props.searchFilter.conversation.interactivity.monologue.range.map((data) => {
                                                    return <li key={uuid()}>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" name="monologue" checked={monologueChecked.includes(data + "--")} className="custom-control-input default-checkbox" id={data + "--"} />
                                                            <label className="custom-control-label default-font" for={data + "--"}>{data}</label>
                                                        </div>
                                                    </li>
                                                })
                                            }
                                            <hr />
                                            <h4 className="search-sidebar-title">Sentiment</h4>
                                            {
                                                props.searchFilter && props.searchFilter.conversation.interactivity.sentiment.map((data) => {
                                                    return <li key={uuid()}>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" name="sentiments" checked={sentimentChecked.includes(data)} className="custom-control-input default-checkbox" id={data} />
                                                            <label className="custom-control-label default-font" for={data}>{titleCase(data)}</label>
                                                        </div>
                                                    </li>
                                                })
                                            }
                                            <hr />
                                            <li>
                                                <h4 className="search-sidebar-title">Mobile Mentions</h4>
                                                <div className="triplet">
                                                    {
                                                        props.searchFilter && props.searchFilter.conversation.interactivity.mobile_mention.map((data, index) => {
                                                            return <div className="radioContainer" key={index}>
                                                                <input type="radio" name="mobile_mention" value={data} className="radio-btn" checked={mobileMention.length > 0 && data === mobileMention[0].mmVal} />
                                                                <span className="virtual-radio"></span>
                                                                <span className="radio-text">{titleCase(data)}</span>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            </li>
                                            <hr />
                                            <li>
                                                <h4 className="search-sidebar-title">Email Mentions</h4>
                                                <div className="triplet">
                                                    {
                                                        props.searchFilter && props.searchFilter.conversation.interactivity.email_mention.map((data, index) => {
                                                            return <div className="radioContainer" key={index}>
                                                                <input type="radio" name="email-mention" value={data} className="radio-btn" checked={emailMention.length > 0 && data === emailMention[0].emVal} />
                                                                <span className="virtual-radio"></span>
                                                                <span className="radio-text">{titleCase(data)}</span>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header" id="stats">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapsesignals" aria-expanded="false" aria-controls="collapsestats">
                                            Signals
                                                <span className="accordian-dropdown-icon">
                                                <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                                <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />
                                            </span>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapsesignals" className="collapse" aria-labelledby="stats" data-parent="#filterAccordian">
                                    <div className="card-body">
                                        <ul onChange={handleConversationChange}>
                                            <h4 className="search-sidebar-title">Opportunity</h4>
                                            <div className="triplet">
                                                {
                                                    props.searchFilter && props.searchFilter.conversation.signals.opportunity.values.map((data, index) => {
                                                        return <div className="radioContainer" key={index}>
                                                            <input type="radio" name="opportunity" value={data} className="radio-btn" checked={opportunity.length > 0 && (data === opportunity[0].oppVal || data === opportunity.oppVal)} />
                                                            <span className="virtual-radio"></span>
                                                            <span className="radio-text">{titleCase(data)}</span>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                            {
                                                opportunity.length > 0 && opportunity[0].oppVal === 'yes' &&
                                                <React.Fragment>
                                                    <h4 className="search-sidebar-title">Buying Journey Stage</h4>
                                                    {
                                                        props.searchFilter && props.searchFilter.conversation.signals.opportunity.buying_journey_state.map((data) => {
                                                            return <li key={uuid()}>
                                                                <div className="custom-control custom-checkbox">
                                                                    <input type="checkbox" name="stage" checked={stageChecked.includes(data)} className="custom-control-input default-checkbox" id={data + '-'} />
                                                                    <label className="custom-control-label default-font" for={data + '-'}>{titleCase(data)}</label>
                                                                </div>
                                                            </li>
                                                        })
                                                    }
                                                </React.Fragment>
                                            }
                                            <hr />
                                            <h4 className="search-sidebar-title"> BANT</h4>
                                            <div className="custom-switch-check">
                                                <label className="switch-check" for="bant">
                                                    <div className="yes">AND</div>
                                                    <div className="no">OR</div>
                                                    <input type="checkbox" id="bant" name="BANT" onChange={toggleCondition} />
                                                    <div className="slider-check round"></div>
                                                </label>
                                            </div>
                                            <li>
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" name="Bant" checked={bantChecked.includes(props.searchFilter && props.searchFilter.conversation.signals.bant.budget)} className="custom-control-input default-checkbox" id="budget" data-bantId={props.searchFilter && props.searchFilter.conversation.signals.bant.budget} />
                                                    <label className="custom-control-label default-font" for="budget">Budget</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" name="Bant" checked={bantChecked.includes(props.searchFilter && props.searchFilter.conversation.signals.bant.authority)} className="custom-control-input default-checkbox" id="authority" data-bantId={props.searchFilter && props.searchFilter.conversation.signals.bant.authority} />
                                                    <label className="custom-control-label default-font" for="authority">Authority</label>
                                                </div>
                                            </li>
                                            {
                                                props.searchFilter && Object.entries(props.searchFilter.conversation.signals.bant).map((data, index) => {

                                                    return data[0] !== "authority" && data[0] !== "budget" && <li key={uuid()}>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" name="Bant" checked={bantChecked.includes(data[1])} className="custom-control-input default-checkbox" id={data[0]} data-bantId={data[1]} />
                                                            <label className="custom-control-label default-font" for={data[0]}>{data[0].charAt(0).toUpperCase() + data[0].slice(1)}</label>
                                                        </div>
                                                    </li>
                                                })
                                            }

                                            <hr />
                                            <li>
                                                <h4 className="search-sidebar-title"> Next Steps</h4>
                                                <div className="triplet">
                                                    {
                                                        props.searchFilter && props.searchFilter.conversation.signals.next_steps.map((data, index) => {
                                                            return <div className="radioContainer" key={index}>
                                                                <input type="radio" name="next-steps" value={data} className="radio-btn" checked={nextSteps.length > 0 && nextSteps[0].NSVal === data} />
                                                                <span className="virtual-radio"></span>
                                                                <span className="radio-text">{titleCase(data)}</span>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header" id="stats">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapsefeedback" aria-expanded="false" aria-controls="collapsestats">
                                            Feedback
                                                <span className="accordian-dropdown-icon">
                                                <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                                <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />
                                            </span>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapsefeedback" className="collapse" aria-labelledby="stats" data-parent="#filterAccordian">
                                    <div className="card-body">
                                        <ul onChange={handleConversationChange}>
                                            <li>
                                                <div className="triplet">
                                                    {
                                                        props.searchFilter && props.searchFilter.conversation.feedback.map((data, index) => {
                                                            return <div className="radioContainer" key={index}>
                                                                <input type="radio" name="feedback" value={data} className="radio-btn" checked={feedback.length > 0 && feedback[0].feedVal === data} />
                                                                <span className="virtual-radio"></span>
                                                                <span className="radio-text">{titleCase(data)}</span>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header" id="stats">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseconnect" aria-expanded="false" aria-controls="collapsestats">
                                            Connect
                                                <span className="accordian-dropdown-icon">
                                                <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                                <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />
                                            </span>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseconnect" className="collapse" aria-labelledby="stats" data-parent="#filterAccordian">
                                    <div className="card-body">
                                        <div className="custom-switch-check">
                                            <label className="switch-check" for="connect">
                                                <div className="yes">AND</div>
                                                <div className="no">OR</div>
                                                <input type="checkbox" id="connect" name="CONNECT" onChange={toggleCondition} />
                                                <div className="slider-check round"></div>
                                            </label>
                                        </div>
                                        <ul onChange={handleConversationChange}>
                                            {
                                                props.searchFilter && Object.entries(props.searchFilter.conversation.connect).sort((a, b) => b[0].localeCompare(a[0])).map((data) => {
                                                    return <li key={uuid()}>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" name="connect" className="custom-control-input default-checkbox" id={data[0]} checked={connectChecked.includes(data[0])} />
                                                            <label className="custom-control-label default-font" for={data[0]}>{data[0] === 'ivr' ? "IVR" : titleCase(data[0])}</label>
                                                        </div>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header" id="stats">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapsecrm" aria-expanded="false" aria-controls="collapsestats">
                                            CRM
                                                <span className="accordian-dropdown-icon">
                                                <img src="/static/images/dropdown.png" className="dropDown" alt="dropdown-icon" />
                                                <img src="/static/images/dropup.png" className="dropUp" alt="dropup-icon" />
                                            </span>
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapsecrm" className="collapse" aria-labelledby="stats" data-parent="#filterAccordian">
                                    <div className="card-body">
                                        <h5 className="search-sidebar-title">Existing Customer</h5>
                                        <ul onChange={handleConversationChange}>
                                            <div className="triplet">
                                                {
                                                    props.searchFilter && props.searchFilter.conversation.crm.existing_customer.map((data, index) => {
                                                        return <div className="radioContainer" key={index}>
                                                            <input type="radio" name="crm" value={data} className="radio-btn" checked={crm.length > 0 && crm[0].crmVal === data} />
                                                            <span className="virtual-radio"></span>
                                                            <span className="radio-text">{titleCase(data)}</span>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Scrollbar>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    return {
        user: state.authentication.user,
        speakers: state.searchReducer.speakers,
        date: state.searchReducer.date,
        repChannelId: state.searchReducer.repChannelId,
        searchFilter: state.searchReducer.searchFilter
    }
}

const mapActionToProps = {
    loadSearchFilter: searchAction.searchFilter,
    loadRepChannel: searchAction.rep_by_channel_id,
    resetSearch: searchAction.resetSearch,
    retainFilters: searchAction.retainFilter,
    cancelApiRequest: searchAction.cancelApiRequest
}

export default connect(mapStateToProps, mapActionToProps)(AllFilters);