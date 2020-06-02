import Vue from 'vue'
import App from './App'
import Axios from 'axios' 
import store from './store';
import router from './router'
import firebase from 'firebase'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import vuetify from './plugins/vuetify';
import * as VeeValidate from 'vee-validate'
Vue.use(VeeValidate)
window.Vue = Vue;
Vue.prototype.$http = Axios; 
Vue.prototype.$apiUrl = 'http://127.0.0.1:8000/api'; 

Vue.config.productionTip = false 

Vue.use(vuetify);
const options = {
  confirmButtonColor: '#42A5F5',
  cancelButtonColor: '#FF5252',
};

var config = {
  apiKey: "AIzaSyDjnVkuY6NdV5dIN7WLOdCNOhiein4jcHc",
  authDomain: "fcm-p3l.firebaseapp.com",
  databaseURL: "https://fcm-p3l.firebaseio.com",
  projectId: "fcm-p3l",
  storageBucket: "fcm-p3l.appspot.com",
  messagingSenderId: "820865122912",
  appId: "1:820865122912:web:0b19a5b3966c339e097905",
  measurementId: "G-B1TPHG4P66"
}

firebase.initializeApp(config)

Vue.use(VueSweetalert2, options);

new Vue({ 
  render: h => h(App), 
  router,
  store,
  vuetify,
  components: { App } 
}).$mount('#app')