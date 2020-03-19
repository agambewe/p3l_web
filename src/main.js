import Vue from 'vue' 
import App from './App'
import Axios from 'axios' 
import router from './router' 
import vuetify from './plugins/vuetify';
import * as VeeValidate from 'vee-validate'
Vue.use(VeeValidate)
Vue.prototype.$http = Axios; 
Vue.prototype.$apiUrl = 'http://127.0.0.1:8000/api'; 

Vue.config.productionTip = false 

Vue.use(vuetify);

new Vue({ 
  render: h => h(App), 
  router, 
  vuetify, 
  components: { App } 
}).$mount('#app')

export default function (Vue, { head }) {
  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Iceland'
  })
}
