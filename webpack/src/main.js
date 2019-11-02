// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.



import Vue from 'vue'
import App from './App'

const { detect } = require('detect-browser');
const browser = detect();

// Chequeo el navegador para constatar que pueda tener soporte
switch (browser && browser.name) {
  case 'chrome':
  case 'firefox':
  case 'edge':
  case 'safari':
  case 'webkit':
    console.log('Navegador Soportado');
    break;
  default:
    alert('Su navegador no soporta este sitio, para mejorar su experiencia utilice Google Chrome o actualice su navegador');
}

// Google Maps
import * as VueGoogleMaps from "vue2-google-maps";

// Vuetify
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import _ from 'lodash';

// Material Designs Icons
import "vue-material-design-icons/styles.css"

// Source
import router from './router'
import store from './store'

// ScrollTo
import VueScrollTo from 'vue-scrollto';

Vue.use(VueScrollTo, {
     container: "body",
     duration: 500,
     easing: "ease",
     offset: 0,
     force: true,
     cancelable: true,
     onStart: false,
     onDone: false,
     onCancel: false,
     x: false,
     y: true
 })

Vue.use(Vuetify);
Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBFPUFES_l4Gn4QKty9nwXTdeM-Ew-Hxb8",
    libraries: "places" // necessary for places input
  }
});

// Vue Analytics
import VueAnalytics from 'vue-analytics';

const isProd = process.env.NODE_ENV === 'production';

Vue.use(VueAnalytics,{
  id:'UA-138532724-1',
  router,
  autoTracking:{
    exception: true
  },
  debug:{
    enabled: !isProd,
    sendHitTask: isProd
  }
});

/** 
 *   NOTIFICACIONES PUSH
 **/

import {initializeFirebase,askForPermissioToReceiveNotifications} from './push-notification'
initializeFirebase()
askForPermissioToReceiveNotifications()

/** 
 *  END NOTIFICACIONES PUSH
 **/

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
