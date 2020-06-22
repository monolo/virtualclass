import Vue from 'vue'
import App from './app/App.vue'
import router from './app/router'
import store from './app/store'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import moment from "moment";

Vue.config.productionTip = false

Vue.filter('dateFormat', (value: string) => {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY hh:mm');
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')