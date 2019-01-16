import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import './plugins/vuetify'

import { routes } from './routes';

//Vue.prototype.PURL = 'http://ec2-54-174-106-192.compute-1.amazonaws.com/spectrumedit-php';
Vue.prototype.PURL = 'http://localhost/spectrum-assignments/spectrumedit-php';

Vue.use(VueRouter);

const router = new VueRouter({
  base: '/spectrum-data/',
  routes: routes,
  mode: 'history'
});

Vue.config.productionTip = false;


new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app');
