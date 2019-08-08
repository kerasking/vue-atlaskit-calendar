<template>
  <div class="calendar">
    <div class="calendar__header">
      <div class="calendar__arrow" @click="subtractMonth">&#10094;</div>
      <h4 class="calendar__month">{{monthName + ' ' + year}}</h4>
      <div class="calendar__arrow" @click="addMonth">&#10095;</div>
    </div>
    <ul class="calendar__weekdays">
      <li class="calendar__weekdays__title" v-for="(day, i) in days" :key="'day-title'+i">{{day}}</li>
    </ul>
    <ul class="calendar__days">
      <li class="calendar__day" v-for="(blank, i) in firstDayOfMonth" :key="'before'+i">&nbsp;</li>
      <li
        v-for="(day, i) in daysInMonth"
        :key="i"
        :class="dayClass(day)"
        @click.capture.stop="onSelectDate(day)"
      >
        <span>{{day.date}}</span>
      </li>
      <li class="calendar__day" v-for="(blank, i) in lastDayOfMonth" :key="'after' + i ">&nbsp;</li>
    </ul>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "calendar",
  components: {},
  props: {
    defaultDay: { type: Number, default: () => null },
    defaultMonth: { type: Number, default: () => null },
    defaultYear: { type: Number, default: () => null },
    defaultDisabled: { type: Array, default: () => [] }
  },
  data() {
    return {
      today: moment(),
      dateContext: moment(),
      days: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      daysInMonth: {}
    };
  },
  created() {
    var newDate = `${this.initialYear}-${this.initialMonth}-${
      this.initialDate
    }`;
    this.dateContext = moment(new Date(newDate), "YYYY-MM-DD");
    this.daysInMonth = new Array(this.dateContext.daysInMonth())
      .fill()
      .map((date, i) => ({ date: i + 1, clicked: false }));
  },
  watch: {
    daysInMonth(newDate) {
      this.dayClass(newDate);
    }
  },
  computed: {
    year: function() {
      return this.dateContext.format("Y");
    },
    month: function() {
      return this.dateContext.format("M");
    },
    monthName: function() {
      return this.dateContext.format("MMMM");
    },
    currentDate: function() {
      return this.dateContext.get("date");
    },
    firstDayOfMonth: function() {
      var firstDay = moment(this.dateContext).subtract(
        this.currentDate - 1,
        "days"
      );
      return firstDay.weekday();
    },
    lastDayOfMonth: function() {
      var remainingDays = moment(this.dateContext).endOf("month");
      var lastDay = 6 - remainingDays.weekday();
      return lastDay;
    },
    initialDate: function() {
      return this.defaultDay ? this.defaultDay : this.today.get("date");
    },
    initialMonth: function() {
      return this.defaultMonth ? this.defaultMonth : 1+ this.today.month();
    },
    initialYear: function() {
      return this.defaultYear ? this.defaultYear : this.today.get("Y");
    },
    disabledDays: function() {
      var disabledDays;
      if (this.defaultDisabled) {
        disabledDays = this.defaultDisabled.map(date =>
          moment(new Date(date)).format("YYYY-MM-DD")
        );
      }
      return disabledDays;
    }
  },
  methods: {
    dayClass: function(date) {
      var dayClass = "calendar__day ";
      if (date.clicked) dayClass = dayClass + "selected__day";
      if (this.isCurrentDay(date.date)) dayClass = dayClass + "current__day";
      if (this.isDisabled(date.date)) dayClass = dayClass + "disabled__day";
      return dayClass;
    },
    getFullDate: function(date) {
      return moment(new Date(`${this.year}-${this.month}-${date}`)).format(
        "YYYY-MM-DD"
      );
    },
    onSelectDate: function(day) {
      this.daysInMonth.map(date => {
        if (date.date == day.date) {
          day.clicked = !day.clicked;
        } else {
          date.clicked = false;
        }
      });
      this.$emit("on-select", this.getFullDate(day.date));
    },
    addMonth: function() {
      this.daysInMonth.map(date => (date.clicked = false));
      this.dateContext = moment(this.dateContext).add(1, "month");
    },
    subtractMonth: function() {
      this.daysInMonth.map(date => (date.clicked = false));
      this.dateContext = moment(this.dateContext).subtract(1, "month");
    },
    isCurrentDay: function(date) {
      return (
        date == this.initialDate &&
        this.month == this.initialMonth &&
        this.year == this.initialYear
      );
    },
    isDisabled: function(date) {
      return (
        this.disabledDays && this.disabledDays.includes(this.getFullDate(date))
      );
    }
  }
};
</script>

<style scoped>
.calendar {
  display: inline-block;
  font-size: 14px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
    rgba(9, 30, 66, 0.31) 0px 0px 1px;
  padding: 15px;
  width: 300px;
  height: 300px;
  overflow: hidden;
  z-index: 1000;
}
.calendar__header {
  font-weight: bold;
  color: rgb(23, 43, 77);
  display: flex;
  justify-content: space-between;
  padding: 0 0 8px;
}
.calendar__month {
  margin: auto;
}
.calendar__arrow {
  cursor: pointer;
  height: 24px;
  width: 24px;
  color: rgb(165, 173, 186);
  display: inline-block;
  font-weight: 100;
  border-radius: 3px;
}
.calendar__arrow:hover {
  background-color: rgb(244, 245, 247);
}

.calendar__weekdays {
  margin: 0;
  padding: 10px 0;
  padding-bottom: 0;
  color: rgb(107, 119, 140);
  font-size: 11px;
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
}

.calendar__weekdays__title {
  display: inline-block;
  width: 13.6%;
  text-align: center;
}
.calendar__days {
  padding: 10px 0;
  margin: 0;
}

.calendar__day {
  display: inline-block;
  width: 6.6%;
  text-align: center;
  margin-bottom: 5px;
  color: rgb(9, 30, 66);
  cursor: pointer;
  font-size: 14px;
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  border-image: initial;
  border-radius: 3px;
  padding: 4px 9px;
}
.calendar__day:hover {
  background-color: rgb(244, 245, 247);
}
.calendar__day:active {
  background-color: rgb(244, 245, 247);
}
.selected__day {
  background-color: rgb(66, 82, 110);
  color: rgb(255, 255, 255);
}
.current__day {
  color: rgb(0, 82, 204);
  font-weight: bold;
  border-bottom: 2px solid rgb(0, 82, 204);
}
.disabled__day {
  background-color: transparent;
  color: rgb(223, 225, 230);
  cursor: not-allowed;
}
.disabled__day:hover {
  background-color: transparent;
}
</style>
