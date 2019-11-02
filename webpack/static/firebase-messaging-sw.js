// import  firebase from 'firebase/app';
// import "firebase/messaging"
importScripts('https://www.gstatic.com/firebasejs/5.10.1/firebase.js');
// importScripts('https://www.gstatic.com/firebasejs/5.10.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/5.10.1/firebase-messaging.js');

var config = {
  apiKey: "AIzaSyCvQvc4tuK4mfVf6T-z-Z009Ge1Az5jO1U",
  authDomain: "siep-pwa-notifications.firebaseapp.com",
  databaseURL: "https://siep-pwa-notifications.firebaseio.com",
  projectId: "siep-pwa-notifications",
  storageBucket: "",
  messagingSenderId: "5437792275",
  appId: "1:5437792275:web:9be492a214e98dcd",
  vapidKey: "BLkOZoyceC3_b8G_v4azTPA6kDGH3QTnM3hMorvZT7PovLJlPcqq8YP-xjbTj90ciKSPyC1EVGm3dOf0dfxgpzw"

};

firebase.initializeApp(config);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/itwonders-web-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});

// messaging
//   .requestPermission()
//   .then(() => firebase.messaging().getToken())
//   .then((token) => {
//       console.log(token) // Receiver Token to use in the notification
//   })
//   .catch(function(err) {
//       console.log("Unable to get permission to notify.", err);
//   });

//   messaging.onMessage(function(payload) {
//   console.log("Message received. ", payload);
//   // ...
//   });