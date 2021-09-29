/* Info: This file is for the Date Picker Component. */
/* Created on {28-01-20} By {Pratul Majumdar}*/
/* Last Modified on {29-01-20} By {Pratul Majumdar}*/
import React from 'react'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import moment from 'moment';
import { searchAction } from '../../actions/searchAction';
import { connect } from 'react-redux';

class DatePicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lastdays: 'Last 7 days',
            date_from: moment().subtract(7, 'days').format("YYYY-MM-DD") + "T00:00:00Z",
            date_to: moment().subtract(1, 'days').format("YYYY-MM-DD") + "T23:59:59Z",
            date: [],
        }
    }

    componentDidMount() {
        this.props && this.props.setDatePicker(this.state.date_from, this.state.date_to)
    }

    onChange = (date) => {
        let date_to = moment(date[1]).format("YYYY-MM-DD") + "T23:59:59Z"
        let date_from = moment(date[0]).format("YYYY-MM-DD") + "T00:00:00Z";
        this.setState(() => ({
            date_from: date_from,
            date_to: date_to,
            date_to_range: moment(date[1]).format("MMM D YYYY"),
            date_from_range: moment(date[0]).format("MMM D YYYY")
        }), _ => {
            this.props.setDatePicker(date_from, date_to)
        })
    }

    onDropDownFilter = (e) => {
        const days = e.target.id
        let date_to = moment().subtract(1, 'days').format("YYYY-MM-DD") + "T23:59:59Z"
        if (e.target.id === 'Yesterday') {
            let date_from = moment().subtract(1, 'days').format("YYYY-MM-DD") + "T00:00:00Z";
            let date_to = moment().subtract(1, 'days').format("YYYY-MM-DD") + "T23:59:59Z"
            this.setState(() => ({
                lastdays: 'Yesterday'
            }), _ => {
                this.props.setDatePicker(date_from, date_to)
            })
            return true
        }
        if (e.target.id === 'Last Month') {
            var date_fro = moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD") + "T00:00:00Z";
            var date_t = moment().subtract(1, 'months').endOf('month').format("YYYY-MM-DD") + "T23:59:59Z"
            this.setState(() => ({
                lastdays: 'Last Month'
            }), _ => {
                this.props.setDatePicker(date_fro, date_t)
            })
            return true
        }
        if (e.target.id === 'custom_range') {
            this.setState(() => ({
                calendarToggle: !this.state.calendarToggle,
                lastdays: 'Custom Range'
            }))
            return true
        }
        let date_from = moment().subtract(days, 'days').format("YYYY-MM-DD") + "T00:00:00Z";
        this.setState(() => ({
            lastdays: 'Last ' + days + ' days'
        }), _ => {
            this.props.setDatePicker(date_from, date_to)
        })
    }

    calenderCustomRangeApply = () => {
        this.setState(() => ({
            calendarToggle: false
        }))
        var datePicker = document.getElementsByClassName('react-daterange-picker__calendar--open')[0];
        datePicker.classList.remove('react-daterange-picker__calendar--open')
        datePicker.classList.add('react-daterange-picker__calendar--closed')
    }

    calenderCustomRangeCancel = () => {
        this.setState(() => ({
            calendarToggle: false
        }))
        var datePicker = document.getElementsByClassName('react-daterange-picker__calendar--open')[0];
        datePicker.classList.remove('react-daterange-picker__calendar--open')
        datePicker.classList.add('react-daterange-picker__calendar--closed')
    }

    render() {
        console.log(this.props)
        return (
            <div className="Rep-wise-footer">
                <div className="btn-group">
                    <button type="button" className="btn selectdropdwon dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.state.lastdays}
                    </button>
                    <div className="dropdown-menu graph-dropdown" onClick={this.onDropDownFilter} style={{ width: "100%" }}>
                        <button className="dropdown-item" id="Yesterday">Yesterday</button>
                        <button className="dropdown-item" id="7">Last 7 days</button>
                        <button className="dropdown-item" id="14">Last 14 days</button>
                        <button className="dropdown-item" id="28">Last 28 days</button>
                        <button className="dropdown-item" id="Last Month">Last Month</button>
                        <button className="dropdown-item custom-range-item" id="custom_range">Custom Range</button>
                    </div>
                </div>
                {
                    this.state.calendarToggle && <React.Fragment> <div className="date-custom-range">
                        {this.state.date_from_range && this.state.date_to_range &&
                            <div className="cal-custom-range"> <span>{this.state.date_from_range}</span>  -  <span>{this.state.date_to_range}</span></div>
                        }
                        <DateRangePicker
                            isOpen={true} //default open state
                            maxDate={new Date()} // cannot select more than today
                            onChange={this.onChange} //API call here
                            onCalendarClose={() => {
                                var datePicker = document.getElementsByClassName('react-daterange-picker__calendar--closed')[0];
                                datePicker.classList.remove('react-daterange-picker__calendar--closed')
                                datePicker.classList.add('react-daterange-picker__calendar--open')
                                this.setState(() => ({
                                    calendarToggle: true,
                                }))
                            }}
                            className="displaynoneinput"
                        />
                        <div className="date-buttons"><button onClick={this.calenderCustomRangeApply}> Apply </button> <button onClick={this.calenderCustomRangeCancel}> Cancel</button> </div>
                    </div>
                    </React.Fragment>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        dateRange: state.searchReducer.dateRange
    }
}

const mapActionToProps = {
    setDatePicker: searchAction.setDatePicker
}

export default connect(mapStateToProps, mapActionToProps)(DatePicker);