<style>
  .datepicker_container{
    position: relative;
  }
</style>
<template>
  <div class="datepicker_container">
    <input value="{{date_formatted}}" @click="showDatepicker"/>
    <input type="hidden" name={{name}} value="{{date_raw}}"/>
    <datepicker-agentda :date="date" :visible="isVisible" @change="selectDate" @cancel="hideDatepicker"></datepicker-agentda>
  </div>
</template>

<script>
import moment from 'moment'
import DatepickerAgendaComponent from './DatepickerAgenda'
moment.locale('zh-CN')
export default {
  components: {
    'datepicker-agentda': DatepickerAgendaComponent
  },
  props: {
    value: {type: String, required: true},
    format: {type: String, default: 'YYYY-MM-DD'},
    name: {type: String}
  },
  data: function () {
    return {
      isVisible: false,
      date: moment(this.value, 'YYYY-MM-DD')
    }
  },
  methods: {
    selectDate (date) {
      this.date = date
      this.hideDatepicker()
    },
    // 显示datepicker
    showDatepicker () {
      this.isVisible = true
    // 如果点击了非datepicker区域，datepicker关闭
      setTimeout(() => document.addEventListener('click', this.hideDatepicker), 0)
    },
    // 隐藏datepicker
    hideDatepicker () {
      this.isVisible = false
      document.removeEventListener('click', this.hideDatepicker)
    }
  },
  computed: {
    date_formatted: function () {
      return this.date.format(this.format)
    },
    date_raw: function () {
      return this.date.format('YYYY-MM-DD')
    }
  }
}
</script>
