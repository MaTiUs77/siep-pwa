<template>
    <v-container fluid text-xs-center>
      <!-- Dialog -->
      <vuetify-dialog :dialogProps='dialogProps'/>
      <!-- /Dialog -->
      
      <div v-if="!user.loggedIn && !user.apiGetUserDataRunning">
              <p class="subheading">Por favor, inicie sesion para acceder a esta sección.</p>

              <div class="text-xs-center">
                <v-btn round color="primary" small @click="goToLogin">Quiero iniciar sesion</v-btn>
              </div>

            </div>
      <!-- Formulario de Contacto-->
      <v-flex v-if="user.loggedIn">
        <!-- Comentario -->
        <v-textarea
                v-model="form.message"
                :label="text_message"
                hint="Responderemos su consulta lo antes posible a su casilla de correo"
                color="primary"
                counter="100"
        ></v-textarea>

        <v-btn color="light-green lighten-1" @click="createMessage" :loading="sending">Enviar Consulta</v-btn>
      </v-flex>
    </v-container>
</template>

<script>
  import axios from 'axios'
  import router from '../router'
  import VuetifyDialog from '../components/VuetifyDialog.vue'


  export default {
    components:{ VuetifyDialog },
    data: ()=>({
      alert:{},
      sending:false,
      form:{},
      text_message: "Redacte un Mensaje",
      dialogProps:{
        show:false,
        title:"IMPORTANTE",
        message:"Solo se recibirán consultas relacionadas con el uso de la aplicación. Para otras consultas, por favor contactese con la institución educativa correspondiente."
      }
    }),
    computed:{
      user(){
        return store.state.user
      }
    },
    created: function(){
      store.commit('updateTitle','SIEP | Contactenos');
      setTimeout(() => this.dialogProps.show = true ,1000);
    },
    methods:{
      goToLogin:function(){
        router.push('/')
      },
      createMessage(){
        let vm = this;
        const curl = axios.create({
          baseURL: process.env.SIEP_API_GW_INGRESS
        });
        vm.sending = true;
        // Header con token
        vm.form.origin = 'siep_pwa';
        curl.defaults.headers.common['Authorization'] = `Bearer ${vm.user.authToken}`;
        return curl.post('/api/public/app_familiares/v1/contacto',vm.form)
          .then(function (response) {
            vm.sending = false;
            if(!response.data.error){
              vm.alert = {
                show: true,
                class: "success",
                message: "Mensaje Enviado Exitosamente!"
              };
            }else{
              vm.alert = {
                show: true,
                class: "error",
                message: "Ups!, Ocurrió un error al enviar el mensaje."
              };
              console.log(response.data);
            }
            
            
            store.dispatch('toggleAlertMessage',vm.alert);
            vm.form.message = "";
          })
          .catch(function (error) {
            vm.error = error.message;
            vm.alert = {
                show: true,
                class: "danger",
                message: "Ocurrió un error al enviar el mensaje!"
            };
            // vm.loading_nivel = false;
            console.log(vm.error);
            vm.sending = false;
          });
      }
    }
  }
</script>
