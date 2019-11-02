import firebase from 'firebase';
import "firebase/messaging";

var config = {
  apiKey: "AIzaSyCvQvc4tuK4mfVf6T-z-Z009Ge1Az5jO1U",
  authDomain: "siep-pwa-notifications.firebaseapp.com",
  databaseURL: "https://siep-pwa-notifications.firebaseio.com",
  projectId: "siep-pwa-notifications",
  storageBucket: "",
  messagingSenderId: "5437792275",
  appId: "1:5437792275:web:9be492a214e98dcd",
  vapidKey:"BLkOZoyceC3_b8G_v4azTPA6kDGH3QTnM3hMorvZT7PovLJlPcqq8YP-xjbTj90ciKSPyC1EVGm3dOf0dfxgpzw"
};

// const messaging = firebase.messaging();

// navigator.serviceWorker.register('/static/firebase-messaging-sw.js')
//   .then((registration) => {
//     messaging.useServiceWorker(registration)
//   }).catch(err => {
//     console.log(err)
//   })

export const initializeFirebase = () => {
  firebase.initializeApp(config);
}

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    messaging.requestPermission().then(function(){
      console.log("Notification permission granted.");
      // get the token in the form of promise
      messaging.getToken().then((token)=>{
        console.log(token)
        return token;
      });
    }).catch(function(error){
      console.log("Ocurrió un error al intentar conceder los permisos para notificaciones.", error);
    });
  } catch (error) {
    console.error(error);
  }
}