<style lang="scss">
  $header-height: 100px;
  $day-size: 41px;
  .datepicker{
  	position: absolute;
  	top: 100%;
    width: 315px;
  	z-index: 5;
    background-color: #fff;
    box-shadow: 0 14px 45px rgba(0, 0, 0, .25), 0 10px 18px rgba(0, 0, 0, .22)
	}
  .datepicker_header{
    background-color: #0097a7;
    color: #fff;
    padding: 20px;
    height: $header-height;
  }
  .datepicker_year{
    position:relative;
    overflow: hidden;
    height: 16px;
    opacity: 0.7;
    margin-bottom: 10px;
    line-height: 16px;
  }
  .datepicker_date{
    position:relative;
    overflow: hidden;
    font-size: 32px;
    height:32px;
    line-height: 32px;
  }
  .datepicker_week{
    font-size: 12px;
    line-height: 12px;
    color: rgba(0,0,0,0.8);
    padding: 0 14px;
  }
  .datepicker_weekday{
    float: left;
    width: $day-size;
    text-align: center;
  }
  .datepicker_days{
    position: relative;
    margin: 14px 14px 0;
    overflow: hidden;
    height: $day-size*5;
    &.has-6-weeks{
      height: $day-size*6;
    }
  }
  .datepicker_day{
    width: $day-size;
    height: $day-size;
    float: left;
    text-align: center;
    line-height: $day-size;
    cursor: pointer;
    overflow: hidden;
    transition: color 450ms cubic-bezier(0.23,1,0.32,1);
  }
  .datepicker_day_effect{
    position: absolute;
    margin-top: 2px;
    margin-left: -10px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgb(0,151,167);
    transition:all 450ms cubic-bezier(0.23,1,0.32,1);
    transform: scale(0);
  }
  .datepicker_day_text{
    position:relative;
    font-weight:bold;
  }
  .datepicker_day:hover{
    color: #fff;
    .datepicker_day_effect{
      transform: scale(1);
      opacity: 0.6;
    }
  }
  .datepicker_days .selected{
    color: #fff;
    .datepicker_day_effect{
      transform: scale(1);
      opacity: 1;
    }
  }
  .datepicker_controls{
    height: 56px;
    line-height: 56px;
    text-align: center;
    position: relative;
    button{
      border: none;
      background-color: transparent;
      user-select: none; //TODO
      outline: none;
      cursor: pointer;
      width: 56px;
      height: 56px;
    }
    // svg{
    //   width: 24px;
    //   height: 24px;
    //   fill: rgba(0,0,0,0.8);
    //   vertical-align: middle;
    // }
  }
  .datepicker_prev{
    float: left;
    position: relative;
  }
  .datepicker_next{
    float: right;
    position: relative;
  }
  .datepicker_month{
    position: absolute;
    height: 16px;
    line-height: 16px;
    top: 20px;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .datepicker_actions{
    text-align: right;
    padding: 4px;
  }
  .datepicker_actions button{
    border: none;
    background-color: transparent;
    display: inline-block;
    cursor: pointer;
    outline: none;
    color: #00bcd4;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    min-width: 88px;
    text-align: center;
    line-height: 36px;
    -webkit-appearance: none;
    transition: all .3s;
    &:hover{
      background-color: rgba(153,153,153,.5)
    }
  }
  .datepicker-slide-transition{
    opacity: 1;
    transition: all .3s;
    transform: translateY(0);
  }
  .datepicker-slide-leave,.datepicker-slide-enter{
    opacity:0;
    transform: translateY(-15px);
  }
  @import 'animations'
</style>

<template>
  <div class="datepicker" v-if="visible" transition="datepicker-slide" @click.stop>
    <div class="datepicker_header">
      <div class="datepicker_year">
        <span v-for="year in [year]" transition="slideh" :class="dayDirection">{{year}}</span>
      </div>
      <div class="datepicker_date">
        <span v-for="year in [date_formatted]" transition="slideh" :class="dayDirection">{{date_formatted}}</span>
      </div>
    </div>
    <div class="datepicker_controls">
      <div class="datepicker_month">
        <span v-for="month in [month]" transition="slideh" :class="classDirection">{{month.getFormatted()}}</span>
      </div>
      <button class="datepicker_next" @click="nextMonth">Next</button>
      <button class="datepicker_prev" @click="prevMonth">Prev</button>
    </div>
    <div class="datepicker_week">
      <div v-for="day in days" class="datepicker_weekday">
        {{day}}
      </div>
    </div>
    <div class="datepicker_days" :class="classWeek">
      <div v-for="month in [month]" transition="slidev" class="clearfix" :class="classDirection">
        <div class="datepicker_day" :style="{width:(month.getWeekStart()*41)+'px'}"></div>
        <div class="datepicker_day" @click="selectDate(day)" v-for="day in month.getDays()" :class="{selected:isSelected(day)}">
          <span class="datepicker_day_effect"></span>
          <span class="datepicker_day_text">{{day.format('DD')}}</span>
        </div>
      </div>
    </div>
    <div class="datepicker_actions clearfix">
      <button @click="cancel">cancel</button>
      <button @click="submit">OK</button>
    </div>
  </div>
</template>

<script>
import Month from '../../modules/month'
export default {
  props: {
    date: {},
    visible: {type: Boolean, default: true}
  },
  data () {
    return {
      days: ['Sun', 'Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat'],
      month: new Month(this.date.month(), this.date.year()),
      classDirection: 'off',
      dayDirection: 'off'
    }
  },
  methods: {
    isSelected (day) {
      return this.date.unix() === day.unix()
    },
    selectDate (day) {
      this.dayDirection = 'direction-next'
      if (day.isBefore(this.datep)) {
        this.dayDirection = 'direction-prev'
      }
      this.date = day.clone()
    },
    nextMonth () {
      this.classDirection = 'direction-next'
      let month = this.month.month + 1
      let year = this.month.year
      if (month > 11) {
        year += 1
        month = 0
      }
      this.month = new Month(month, year)
    },
    prevMonth () {
      this.classDirection = 'direction-prev'
      let month = this.month.month - 1
      let year = this.month.year
      if (month < 0) {
        year -= 1
        month = 11
      }
      this.month = new Month(month, year)
    },
    submit () {
      this.$dispatch('change', this.date)
    },
    cancel () {
      this.$dispatch('cancel')
    }
  },
  computed: {
    year () {
      return this.date.format('YYYY')
    },
    date_formatted () {
      return this.date.format('dddd DD MMM')
    },
    classWeek () {
      return 'has-' + this.month.getWeeks() + '-weeks'
    }
  },
  watch: {
    visible (val, oldVal) {
      if (val === false) {
        this.classDirection = 'off'
        this.dayDirection = 'off'
      }
    }
  }
}
</script>