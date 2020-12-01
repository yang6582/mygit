<template>
  <div class="calendarContent">
    <!-- agoDayHide='1517483961' -->
    <!-- futureDayHide="1526054400" -->
    <Calendar ref="Calendar"></Calendar>
    <!-- <Calendar
      ref="Calendar"
      v-on:isToday="clickToday"
      agoDayHide="1530115221"
      v-on:choseDay="clickDay"
      v-on:changeMonth="changeDate"
    ></Calendar>-->
  </div>
</template>

<script>
// import Calendar from '../vue-calendar-component/index';
import Calendar from "vue-calendar-component";
export default {
  data() {
    return {
      // arr2: ['2018/6/23'],
      arr2: [],
      arr: [
        {
          date: "2018/8/1",
          className: "mark1"
        },
        {
          date: "2018/8/13",
          className: "mark2"
        }
      ]
    };
  },
  components: {
    Calendar
  },
  methods: {
    clickDay(data) {
      console.log("选中了", data); //选中某天
    },
    clickToday(data) {
      console.log("跳到了本月今天", data); //跳到了本月
    },
    changeDate(data) {
      console.log("左右点击切换月份", data); //左右点击切换月份
    }
  },
  created() {
    function format(date, index) {
      date = new Date(date);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${index}`;
    }
    setTimeout(() => {
      this.arr = [
        {
          date: format(new Date(), 3),
          className: "mark1"
        },
        {
          date: format(new Date(), 12),
          className: "mark2"
        }
      ];
      this.arr.push({
        date: format(new Date(), 15),
        className: "mark1"
      });
    }, 300);
  }
};
</script>

<!-- Add "scoped " attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  text-align: center;
  width: 90%;
  margin: auto;
}
.div {
  margin: auto;
  width: 220px;
  height: 44px;
  line-height: 44px;
  background: #0fc37c;
  color: #fff;
  font-size: 17px;
  text-align: center;
  margin-top: 20px;
}
.wh_container /deep/ .mark1 {
  background-color: orange;
}
.wh_container /deep/ .mark2 {
  background-color: blue;
}
// .wh_content_item > .wh_isMark {
//   background: orange;
// }
.wh_container /deep/ .wh_content_all {
  /* background-color: red; */
}
.calendarContent /deep/ .wh_content_all {
  background-color: #fff !important;
}
.calendarContent /deep/ .wh_top_changge li {
  color: black !important;
}
.calendarContent /deep/ .wh_jiantou1 {
  border-top: 2px solid black;
  border-left: 2px solid black;
}
.calendarContent /deep/ .wh_jiantou2 {
  border-top: 2px solid black;
  border-right: 2px solid black;
}
.calendarContent /deep/ .wh_content_item {
  color: black;
}
.calendarContent /deep/ .wh_container {
  max-width: none !important;
}
.calendarContent /deep/ .wh_content_item .wh_isToday {
  background: #5ed4d0 !important;
}
.calendarContent /deep/ .wh_content_item .wh_chose_day {
  background: orange !important;
}
.wh_container{

}
</style>