/* Info: This file is for User Login constants */
/* Created on {3-07-19} By {Pravesh Sharma}*/
/* Modified on {9-07-19} By {Pravesh Sharma}*/
import moment from 'moment-timezone'
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment)

export const userConstants = {
  LOGIN_REQUEST: 'USERS_LOGIN_REQUEST',
  LOGIN_SUCCESS: 'USERS_LOGIN_SUCCESS',
  LOGIN_FAILURE: 'USERS_LOGIN_FAILURE',
  LOGOUT: 'USERS_LOGOUT',
};
export const actionConstants = {
  STATUS: 'success',
  FAILURE: 'failure',
  MESSAGE: 'Token is invalid!'
}
export const sentimentPoints = {
  sentiment_level_max_pos: 1,
  sentiment_level_min_pos: 0.5,
  sentiment_level_max_neut: 0.49999,
  sentiment_level_min_neut: -0.49999,
  sentiment_level_min_neg: -1,
  sentiment_level_max_neg: -0.5,
}

export const timezoneDateCalculator = (type, timezone, date1, date2) => {

  let dateObject;
  let time = moment().tz(timezone)
  let to;
  let date_temp_two = time.subtract(1, 'days').format('YYYY-MM-DDT23:59:59Z');
  to = moment(date_temp_two).utc().format('YYYY-MM-DDTHH:mm:ss') + "Z"
  switch (type) {
    case 'Anytime':

      dateObject = {
        from: "",
        to: moment(to).utc().format('YYYY-MM-DDTHH:mm:ss') + "Z",
        type: 'date',
        string: 'Date: Anytime',
      }
      break;
    case 'Yesterday':
      let temp1 = time.subtract(1, 'days').format('YYYY-MM-DDT00:00:00Z')

      dateObject = {
        from: moment(temp1).utc().format('YYYY-MM-DDTHH:mm:00') + "Z",
        to: moment(to).utc().format('YYYY-MM-DDTHH:mm:ss') + "Z",
        type: 'date',
        string: 'Date: Yesterday',
      }
      break;
    case 'Last 7 Days':
      let temp2 = time.subtract(7, 'days').format('YYYY-MM-DDT00:00:00Z')

      dateObject = {
        from: moment(temp2).utc().format('YYYY-MM-DDTHH:mm:00') + "Z",
        to: moment(to).utc().format('YYYY-MM-DDTHH:mm:ss') + "Z",
        type: 'date', string: "Date: Last 7 Days",
       
      }
      break;
    case 'Last 14 Days':
      let temp4 = time.subtract(14, 'days').format('YYYY-MM-DDT00:00:00Z')

      dateObject = {
        from: moment(temp4).utc().format('YYYY-MM-DDTHH:mm:00') + "Z",
        to: moment(to).utc().format('YYYY-MM-DDTHH:mm:ss') + "Z",
        type: 'date', string: "Last 14 Days",
      }
      break;
      case 'Last 28 Days':
        let temp5 = time.subtract(28, 'days').format('YYYY-MM-DDT00:00:00Z')
  
        dateObject = {
          from: moment(temp5).utc().format('YYYY-MM-DDTHH:mm:00') + "Z",
          to: moment(to).utc().format('YYYY-MM-DDTHH:mm:ss') + "Z",
          type: 'date', string: "Last 28 Days",
        }
        break;
    case 'Last 30 Days':
      let temp3 = time.subtract(30, 'days').format('YYYY-MM-DDT00:00:00Z')

      dateObject = {
        from: moment(temp3).utc().format('YYYY-MM-DDTHH:mm:00') + "Z",
        to: moment(to).utc().format('YYYY-MM-DDTHH:mm:ss') + "Z",
        type: 'date', string: 'Date: Last 30 Days',

      }
      break;
    case 'Last Month':
      let date_fro = time.subtract(1, 'months').startOf('month').format('YYYY-MM-DDT00:00:00Z')
      let date_t = time.endOf('month').format('YYYY-MM-DDT23:59:59Z')
      console.log(date_fro, date_t)
      dateObject = {
        from: moment(date_fro).utc().format('YYYY-MM-DDTHH:mm:00') + "Z",
        to: moment(date_t).utc().format('YYYY-MM-DDTHH:mm:ss') + "Z",
        type: 'date', string: 'Date: Last Month',
      }
      break;
    case 'This Month':
      let date_from = time.startOf('month').format('YYYY-MM-DDT00:00:00Z')

      dateObject = {
        from: moment(date_from).utc().format('YYYY-MM-DDTHH:mm:00') + "Z",
        to: moment(to).utc().format('YYYY-MM-DDTHH:mm:ss') + "Z",
        type: 'date', string: 'Date: This Month',
      }
      break;
    case 'Custom Range':
      let search_conversation_date_to = moment(date2).tz(timezone).format('YYYY-MM-DDTHH:mm:ssZ');
      let search_conversation_date_from = moment(date1).tz(timezone).format('YYYY-MM-DDT00:00:00Z');

      dateObject = {
        from: moment(search_conversation_date_from).utc().format('YYYY-MM-DDTHH:mm:00') + "Z",
        to: moment(search_conversation_date_to).utc().format('YYYY-MM-DDTHH:mm:ss') + "Z",
        type: 'date', string: 'Custom Range: ' + moment(search_conversation_date_from).format("DD/MM/YYYY") + ' - ' + moment(search_conversation_date_to).subtract(1, 'days').format("DD/MM/YYYY"),
      }

      break
  }
  return dateObject
}

export const timezoneDatePrint = (date, timezone, format, type) => {
  let datetime;
  if(type === 'time'){

    datetime = moment(date).tz(timezone).format(format)
  }else{
    datetime = moment.duration(date, "seconds").format("h [hrs] m [mins] s [secs]")
  }

  return datetime
}