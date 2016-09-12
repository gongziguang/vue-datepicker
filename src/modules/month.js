import moment from 'moment'
import 'moment-range'

export default class Month {
  constructor (month, year) {
    this.start = moment([year, month])
    this.end = this.start.clone().endOf('month')
    this.month = month
    this.year = year
  }
  // 每个月的第一天是星期几
  getWeekStart () {
    return this.start.weekday()
  }
  getDays () {
    // 每个月天数
    return moment.range(this.start, this.end).toArray('days')
  }
  // 每个月周数
  getWeeks () {
    return this.end.week() - this.start.week() + 1
  }
  getFormatted () {
    return this.start.format('MMMM YYYY')
  }
}
