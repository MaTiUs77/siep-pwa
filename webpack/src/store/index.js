import Vue from 'vue'
import Vuex from 'vuex'

import menu from './model/menu'
import menu_toolbar from './model/menu_toolbar'

import user from './model/user'
import alert from './model/alert'
import dialog from './model/dialog'
import administracion from './model/administracion'

// Inscripciones
import inscripciones_home from './model/inscripciones/home'
import centros from './model/inscripciones/centros'
import familiar from './model/inscripciones/familiar'
import persona from './model/inscripciones/persona'
import alumno from './model/inscripciones/alumno'
import barrio from './model/inscripciones/barrio'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    menu: menu,
    menu_toolbar: menu_toolbar,
    alert: alert,
    dialog:dialog,
    administracion:administracion,

    user: user,
    home: inscripciones_home,
    centros: centros,
    familiar: familiar,
    persona: persona,
    alumno: alumno,
    barrio: barrio
  }
})

export default store
window.store = store