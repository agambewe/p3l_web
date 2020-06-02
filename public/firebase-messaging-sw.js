// importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js');
importScripts('https://cdn.jsdelivr.net/npm/vue/dist/vue.js');
importScripts('https://www.gstatic.com/firebasejs/7.13.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.13.0/firebase-messaging.js');
/*Update this config*/

var config = {
  apiKey: "AIzaSyDjnVkuY6NdV5dIN7WLOdCNOhiein4jcHc",
  authDomain: "fcm-p3l.firebaseapp.com",
  databaseURL: "https://fcm-p3l.firebaseio.com",
  projectId: "fcm-p3l",
  storageBucket: "fcm-p3l.appspot.com",
  messagingSenderId: "820865122912",
  appId: "1:820865122912:web:0b19a5b3966c339e097905",
  measurementId: "G-B1TPHG4P66"
  };
  firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('yeeew ', payload.data);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: 'https://w7.pngwing.com/pngs/778/73/png-transparent-shih-tzu-golden-retriever-puppy-cartoon-golden-retriever-mammal-animals-cat-like-mammal.png',
    image: 'https://w7.pngwing.com/pngs/778/73/png-transparent-shih-tzu-golden-retriever-puppy-cartoon-golden-retriever-mammal-animals-cat-like-mammal.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
    });
// [END background_handler]