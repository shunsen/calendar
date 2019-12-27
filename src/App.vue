<template>
  <div id="app">
    <h1>日历</h1>
    <calendar @choseDay="selectDay" @changeMonth="changeMonth" :markDate="markDate"></calendar>
  </div>
</template>

<script>

import calendar from './calendar/index.vue'

export default {
  data(){
    return {
      markDate:['20191223','20191224','20191225','20191226','20191227','20191228','20191229','20191230','20191231',]
    }
  },
  methods: {
    selectDay(date){
      console.log('监听日期变化');
      console.log(date);
    },
    changeMonth(date){
      console.log('监听月份变化');
      console.log(date);
    }
  },
  components:{
    calendar
  }
}
</script>