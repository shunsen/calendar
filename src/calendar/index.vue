<template>
  <div class="calendar">
    <div class="monthBand">
      <div class="btnOption">
        <div class="section">
          <select name="year" class="year" v-model="curYear" @change="selectYear">
            <option v-for="item in years" :key="item" :label="item+'年'" :value="item"></option>
          </select>
        </div>

        <div class="section">
          <el-button type="primary" size="mini" @click="prevMonth"><i class="el-icon-arrow-left"></i></el-button>
          <select name="month" class="month" v-model="curMonth" @change="selectMonth">
            <option v-for="item in 12" :key="item" :label="item+'月'" :value="item"></option>
          </select>
          <el-button type="primary" size="mini" @click="nextMonth"><i class="el-icon-arrow-right"></i></el-button>
        </div>

        <div class="section">
          <el-button type="primary" size="mini" @click="gotoToday">回到今天</i></el-button>
        </div>

        <div class="section">{{`${curYear}年${curMonth}月`}}</div>
      </div>
      <ul class="head">
        <li v-for="item in weeks" :key="item" :class="[{isWeekend:item==='六'||item==='日'}]">{{item}}</li>
      </ul>

      <ul class="dateRow">
        <li v-for="(item,index) in calendarDate" :class="['date',item.monthType,{isToday:item.id===formatDate(new Date())},{isWeekend:item.isWeekend&&item.monthType==='current'},{selected:item.id===formatDate(targetDate)},{isMark:item.monthType==='current'&&isInMark(item)}]" @click="clickDay(item)">{{item.dateIns.getDate()}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import calendar from './calendar.js'
export default {
  name: 'calendar',
  props: {
    markDate: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      calendarDate: [],
      weeks: ['一', '二', '三', '四', '五', '六', '日',],
      years: [],
      targetDate: null,
      curYear: 0,
      curMonth: 1,
      curDate: 0,
      selectDate: '',
      lastDate: ''
    }
  },
  created () {
    this.$nextTick(() => {
      this.targetDate = new Date();
      this.initYear();
    }, 0);
  },
  watch: {
    targetDate: function (newYear, oldYear) {
      this.curYear = newYear.getFullYear()
      this.curMonth = newYear.getMonth() + 1
      this.curDate = newYear.getDate()
    },
    curYear: function (newYear, oldYear) {
      console.log('从' + oldYear + '年切换到' + newYear + '年');
      this.init()
    },
    curMonth: function (newMonth, oldMonth) {
      console.log('从' + oldMonth + '月份切换到' + newMonth + '月份');
      this.init()
      this.$emit('changeMonth', this.formatDate(this.targetDate))
    },
    curDate: function (newDate, oldDate) {
      console.log('从' + oldDate + '日切换到' + newDate + '日');
      this.init()
    }
  },
  methods: {
    init () {
      this.targetDate = new Date(this.curYear, this.curMonth - 1, this.curDate);
      if (this.lastDate !== this.formatDate(this.targetDate).slice(0, 6)) {
        this.getCalendarDate(this.targetDate)
        this.lastDate = this.formatDate(this.targetDate).slice(0, 6)
      }
    },
    initYear () {
      let midYear = this.targetDate.getFullYear();
      for (let i = -100; i < 100; i++) {
        this.years.push((midYear + i))
      }
    },
    formatDate (date) {
      let [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
      return `${year}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}`
    },
    /**
     * {日期对象实例} targetDate
     */
    getCalendarDate (targetDate) {
      console.log(this.curYear, this.curMonth, this.curDate);
      this.calendarDate = calendar.getDates(targetDate || new Date());
    },
    selectYear (e) {
      let value = e.target.options[e.target.selectedIndex].value
      this.curYear = value
    },
    selectMonth (e) {
      let value = e.target.options[e.target.selectedIndex].value
      this.curMonth = parseInt(value)
    },
    prevMonth () {
      if (this.curMonth === 1) {
        this.curMonth = 12
        this.curYear--
      } else {
        this.curMonth = this.curMonth - 1;
      }
    },
    nextMonth () {
      if (this.curMonth === 12) {
        this.curMonth = 1
        this.curYear++
      } else {
        this.curMonth++
      }
    },
    gotoToday () {
      let today = new Date();
      if (today.getFullYear() !== this.curYear || today.getMonth() + 1 !== this.curMonth) {
        this.targetDate = today
      } else {
        this.curDate = today.getDate();
      }
    },
    clickDay (day) {
      // 标记当前选中的日期
      this.curDate = day.dateIns.getDate();
      // 判断日期类型,是否需要切换月份
      if (day.monthType === 'prev') {
        this.prevMonth();
      }
      if (day.monthType === 'next') {
        this.nextMonth();
      }
      // 执行传进来的调用方法
      this.$emit('choseDay', day.id)
    },
    isInMark (date) {
      return this.markDate.indexOf(date.id) !== -1;
    }
  },
}
</script>


<style lang="scss">
.calendar {
  width: 490px;
  height: 490px;
  .monthBand {
    height: 100%;
    padding: 0px 10px;
    border: 1px solid green;
    border-radius: 5px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    .btnOption {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0px;
      .year,
      .month {
        height: 28px;
        outline: none;
        border-radius: 5px;
        position: relative;
        top: 1px;
      }
    }
    ul {
      margin: 0px;
      padding: 0px;
      list-style: none;
      display: flex;
      color: black;
      li {
        text-align: center;
        padding: 10px 0px;
        flex: 1;
      }

      &.head {
        font-weight: bold;
        border-top: 1px solid rgb(92, 174, 255);
        li {
          &.isWeekend {
            color: red;
          }
        }
      }

      &.dateRow {
        flex-wrap: wrap;
        flex: 1;
        li {
          min-width: 14%;
          box-sizing: border-box;
          border-top: 1px solid #ccc;
          &:hover,
          &.selected {
            position: relative;
            &::before {
              content: '';
              display: block;
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0px;
              left: 0px;
              box-sizing: border-box;
              // border: 4px solid rgb(255, 187, 0);
              border: 4px solid rgb(155, 187, 0);
            }
          }
          &.prev {
            color: #999;
          }
          &.next {
            color: #999;
          }
          &.isToday {
            color: white;
            // background-color: rgb(255, 187, 0);
            // color:yellow;
            background-color:rgb(123, 21, 103)
          }
          &.isWeekend {
            color: red;
          }
          &.isMark {
            position: relative;
            &::after{
              content: "";
              display: block;
              width: 60%;
              height: 5px;
              background-color:skyblue;
              position: absolute;
              bottom:5px;
              left: 20%;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
}
</style>