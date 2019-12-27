/*
    设置日历面板最大为6行,每行7个日期格,共计42个日期格
*/

export default {
  /**
   *
   * @param {年份} year
   * @param {月份(1-12)} month
   * 根据年月获取某月的天数(28~31)
   */
  getDaysByMonth(year, month) {
    const d = new Date(year, month, 0);
    return d.getDate();
  },

  getDates(date) {
    let dates = [
      ...this.getPrevDateByMonth(date),
      ...this.getMainDateByMonth(date),
      ...this.getNextDateByMonth(date)
    ];
    return dates;
  },

  /**
   *
   * @param {日期实例} date
   * 根据日期获取当月所有日期数据
   */
  getMainDateByMonth(date) {
    // console.log("主要数据");
    let dates = [];
    let year = date.getFullYear();
    let month = date.getMonth();

    let nums = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < nums; i++) {
      let curDate = new Date(year, month, i + 1);
      let weekday = curDate.getDay();
      let newDate = {
        id: `${year}${month + 1 < 10 ? "0" + (month + 1) : month + 1}${
          i + 1 < 10 ? "0" + (i + 1) : i + 1
        }`,
        dateIns: curDate,
        monthType: "current",
        isWeekend: weekday === 6 || weekday === 0
      };
      dates.push(newDate);
    }

    return dates;
  },

  /**
   *
   * @param {日期实例} date
   * 根据日期获取当月面板中上月日期部分数据
   */
  getPrevDateByMonth(date) {
    // console.log("前格数据");
    // 需要先获取一下几个数据
    // 1.上个月要显示的日期格子数
    // 2.上个月的天数(可知其最大日期数(28-31))
    let year = date.getFullYear();
    let month = date.getMonth();

    let firstDayOfCurMonth = new Date(year, month, 1);

    // 前格数为当月1号之前空出来填写上月日期的格子数,默认从周一到周日由左向右排列.
    let preCellNums =
      firstDayOfCurMonth.getDay() === 0 ? 6 : firstDayOfCurMonth.getDay() - 1;

    let datesOfPrevMonth = [];

    let prevMonth = this.getNeighborMonth(month, "prev");
    let yearOfPrevMonth = month === 0 ? year - 1 : year;

    let daysOfPrevMonth = this.getDaysByMonth(year, month);

    for (let i = 0; i < preCellNums; i++) {
      let curDate = new Date(yearOfPrevMonth, prevMonth, daysOfPrevMonth - i);
      let weekday = curDate.getDay();
      datesOfPrevMonth.unshift({
        id: `${yearOfPrevMonth}${
          prevMonth + 1 < 10 ? "0" + (prevMonth + 1) : prevMonth + 1
        }${daysOfPrevMonth - i}`,
        dateIns: curDate,
        monthType: "prev",
        isWeekend: weekday === 6 || weekday === 0
      });
    }

    return datesOfPrevMonth;
  },

  /**
   *
   * @param {日期实例} date
   * 根据日期获取当月面板中下月日期部分数据
   */
  getNextDateByMonth(date) {
    // console.log("后格数据");

    //需要先获取以下几个数据
    //1.下个月要显示的日期格子数(通过获取当月最后一天的星期数可知)
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let daysOfCurMonth = this.getDaysByMonth(year, month + 1);
    // 当月的最后一天
    let lastDateOfCurMonth = new Date(year, month, daysOfCurMonth);

    let showDateNumsOfNextMonth = 7 - lastDateOfCurMonth.getDay();
    let datesOfNextMonth = [];
    let nextMonth = this.getNeighborMonth(month, "next");
    let yearOfNextMonth = month === 11 ? year + 1 : year;

    for (let j = 0; j < showDateNumsOfNextMonth; j++) {
      let curDate = new Date(yearOfNextMonth, nextMonth, j + 1);
      let weekday = curDate.getDay();

      datesOfNextMonth.push({
        id: `${yearOfNextMonth}${
          nextMonth + 1 < 10 ? "0" + (nextMonth + 1) : nextMonth + 1
        }${j + 1 < 10 ? "0" + (j + 1) : j + 1}`,
        dateIns: curDate,
        monthType: "next",
        isWeekend: weekday === 6 || weekday === 0
      });
    }

    return datesOfNextMonth;
  },

  /**
   *
   * @param {日期实例} date
   * 通过当月获取相邻月的月份数
   */
  getNeighborMonth(month, direction) {
    // 12月之后是1月
    if (direction === "next") {
      if (month === 11) {
        return 0;
      } else {
        return month + 1;
      }
    }
    // 1月之前是12月
    if (direction === "prev") {
      if (month === 0) {
        return 11;
      } else {
        return month - 1;
      }
    }
  }
};
