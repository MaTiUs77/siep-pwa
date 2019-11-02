<template v-bind:style="{ backgroundColor: color}">
    <v-container fluid>
      <v-dialog v-model="spinner" persistent content content-class="centered-dialog">
        <v-container fill-height>
          <v-layout column justify-center align-center>
            <v-progress-circular
              :size="70"
              :width="7"
              color="orange"
              indeterminate
              v-if="spinner"
            ></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
      <v-slide-y-transition mode="out-in">
          <v-layout column align-center>
            
            <v-carousel v-bind:class="{ 'carousel' : !isMobile, 'carousel-mobile' : isMobile}" light active-class hide-delimiters v-bind:hide-controls="isMobile">
              <v-carousel-item
                v-for= "(item,i) in items"
                :key= "i"
                :src= "item.url"
                style="height: 100%"
              > </v-carousel-item>
            </v-carousel>

            <v-divider></v-divider>
            <v-flex pt-2 pb-2>
              <v-card raised>
                <v-card-title>
                  <div>
                    <h4>Familia, mediante esta aplicación podrán:</h4>
                  </div>
                  <div class="caption">
                    - Agregar/Editar sus datos personales y el tipo de vínculo con el estudiante.<br>
                    - Agregar/Ver estudiantes vinculados a ustedes.<br>
                    - Contactarse para consultas referidas al uso de la aplicación.<br>
                    - Consultar datos de todas las instituciones educativas en la provincia.
                  </div>
                </v-card-title>
              </v-card>
            </v-flex>
            
            <v-flex xs12 md12 lg12 xl12 class="text-xs-center">
                <v-btn round color="indigo darken-3" dark @click="goTo('facebook')">Ingresar con facebook</v-btn>
                <v-btn round color="red darken-1" dark @click="goTo('google')">Ingresar con Google</v-btn>
            </v-flex>

          </v-layout>
      </v-slide-y-transition>
    </v-container>
</template>
<script>

  import FacebookIcon from "vue-material-design-icons/facebook.vue"
  import GoogleIcon from "vue-material-design-icons/google.vue"


  import router from '../router'

  export default {
    data(){
      return{
        spinner:true,
        isMobile:false,
        items: [],
        color: '#5C6BC0',
        apigw: process.env.SIEP_API_GW_INGRESS,
      }
    },
    created: function(){
      store.commit('updateTitle',"SIEP | Familiares");
      this.logout();
      
    },
    components :{ FacebookIcon,GoogleIcon },
    name: "login",
    computed:{
      user(){
        return store.state.user
      },
      dialog(){
        console.log("Dialog",store.state.dialog.dialog);
        return store.state.dialog.dialog;
      },
      // SE HARÁ EN FUTURAS ACTUALIZACIONES      
      // administracion(){
      //   if(store.state.administracion.administracion.en_mantenimiento === 1){
      //     router.push('/mantenimiento');
      //   }
      //   return store.state.administracion.administracion;
      // }
    },
    mounted(){
      this.onResize();
      this.carouselImages();
    },
    watch:{
      dialog(){}
      // SE HARÁ EN FUTURAS ACTUALIZACIONES
      // administracion(){}
    },
    methods:{
      onResize(){
        if(window.innerWidth <= 480){
          this.isMobile = true;
        }else{
          this.isMobile = false;
        }
        console.log("Movil:",this.isMobile);
      },
      carouselImages(r) {
        var vm = this;
        let params={};
        if(vm.isMobile){
          params = {
            mobile : 1,
            desktop : 0
          }
        }else{
          params = {
            mobile : 0,
            desktop : 1
          }
        }
        store.dispatch('apiGetCarouselImages',params).then(function(response){
          vm.items = response.data;
          setTimeout(() => vm.spinner = false, 4000);
        })
      },
      goTo : function(social){
        window.location = this.apigw+'/auth/social/'+social+'?app=siep-pwa';
      },
      logout : function(){
        if(this.user.loggedIn){
          store.dispatch('logout');
        }
      }
    }
  }
</script>

<style>
    body {
        background-color: #5C6BC0;
    }

    FacebookIcon {
        font-size: 50px;
    }

    .carousel {
      height: 250px;
    }

    .carousel-mobile {
      height: 180px;
    }

    .v-jumbotron__image { 
      height: 100% !important;
      min-width: 50% !important;
      max-width: 100% !important; 
    }

    .dialog.centered-dialog,
    .v-dialog.centered-dialog
    {
      /* background: #282c2dad; */
      box-shadow: none;
      border-radius: 6px;
      width: auto;
      color: whitesmoke;
    }

</style>