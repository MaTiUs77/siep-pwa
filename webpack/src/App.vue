<template>
  <v-app>
    <!-- Sidebar !-->
    <v-navigation-drawer
      persistent
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
      v-if="!maintenanceMode"
    >
      
      <!-- Componente UserSidebar -->
      <user-sidebar />
      <v-divider></v-divider>
      <!-- Componente MenuSidebar -->
      <menu-sidebar />

    </v-navigation-drawer>

    <!-- Menu toolbar !-->
    <v-toolbar app color="orange darken-1" dark >
      <v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="!maintenanceMode"></v-toolbar-side-icon>
      <v-toolbar-title v-text="menu_toolbar.title" ></v-toolbar-title>
    </v-toolbar>

    <!-- Contenido de navegacion !-->
    <v-content>

      <!-- Alert Message -->
      <v-alert
        :value="alert.show"
        :type="alert.class" 
        transition="scale-transition"
      >
        {{ alert.message }}
      </v-alert>
      <!-- /Alert Message -->
      <transition-page>
        <router-view/>
      </transition-page>
    </v-content>

    <!-- Footer -->
    <v-footer
      height="auto"
      color="primary lighten-1"
    >
      <v-flex
        text-xs-center
        white--text
        xs12
      >
        &copy; 2019 — <strong>Subsecretaría de Planeamiento Educativo, Informática y Evaluación</strong>
      </v-flex>
    </v-footer>
  </v-app>
</template>

<script>

  import UserSidebar from './components/user_sidebar.vue'
  import MenuSidebar from './components/menu_sidebar.vue'
  import TransitionPage from './components/TransitionPage.vue'
  
  export default {
    components: { UserSidebar, MenuSidebar, TransitionPage },
    data () {
      return {
        drawer: false,
        toolbar_disabled: true,
        maintenanceMode: false
      }
    },
    computed: {
      menu_toolbar() {
        return store.state.menu_toolbar;
      },
      alert() {
        console.log(store.state.alert.alert);
        return store.state.alert.alert;
      }
      // Para más adelante
      // administracion(){
      //   if(store.state.administracion.administracion.en_mantenimiento === 1){
      //     this.maintenanceMode = true;
      //   }else{
      //     this.maintenanceMode = false;
      //   }
      //   return store.state.administracion.administracion;
      // }
      
    },
    watch:{
      alert(newValue,oldValue) {
        setTimeout(() => newValue.show = false, 5000);
      },
      // Para más adelante
      // administracion(){}
    },
    created(){
      store.dispatch('extractToken');
      // SE HARÁ EN FUTURAS ACTUALIZACIONES
      // store.dispatch('getAdministracionData');
    },
    methods:{
    },
    name: 'App'
  }
</script>
<style>
  article { font-size: 20px; text-align: center; padding: 10px; }
  /*h1 { font-size: 50px; }*/
  body { font: Helvetica, sans-serif; color: #333; }
  /*article { display: block; text-align: left; width: 650px; margin: 0 auto; }*/
  a { color: #dc8100; text-decoration: none; }
  a:hover { color: #333; text-decoration: none; }
</style>

