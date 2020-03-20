import Vue from 'vue' 
import App from './App'
import Axios from 'axios' 
import router from './router' 
// import swal from 'sweetalert'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import vuetify from './plugins/vuetify';
import * as VeeValidate from 'vee-validate'
Vue.use(VeeValidate)
Vue.prototype.$http = Axios; 
Vue.prototype.$apiUrl = 'http://127.0.0.1:8000/api'; 

Vue.config.productionTip = false 

Vue.use(vuetify);
const options = {
  confirmButtonColor: '#42A5F5',
  cancelButtonColor: '#FF5252',
};

Vue.use(VueSweetalert2, options);
// Vue.use({
//   // this is the required "install" method for Vue plugins
//   install (Vue) {
//     Vue.swal = swal
//     Vue.prototype.$swal = swal
//   }
// })

new Vue({ 
  render: h => h(App), 
  router,
  vuetify, 
  components: { App } 
}).$mount('#app')

// export default function (Vue, { head }) {
//   head.link.push({
//     rel: 'stylesheet',
//     href: 'https://fonts.googleapis.com/css?family=Iceland'
//   })
// }
