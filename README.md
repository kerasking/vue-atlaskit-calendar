# vue-atlaskit-calendar

## Project setup
```
npm i vue-atlaskit-calendarstall
```
## Demo 
https://habibagadalla.github.io/holidays-russia/

## How to use it   

```javascript
<template>
  <div class="home">
  <calendar 
      :defaultDay="9"
      :defaultYear="2020"
      :defaultDisabled="['2020-12-04', '2020-12-05']"
      @on-select="myFunction"
  />
  </div>
</template>

<script>
import   calendar  from 'vue-atlaskit-calendar'
export default {
  name: 'Home',
  components: {
    calendar
  },
  methods: {
    myFunction(date) {
        console.log('Date is:', date);
    }
  },
}
</script>

```

