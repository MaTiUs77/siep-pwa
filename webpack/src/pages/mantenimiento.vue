<template>
    <v-container fluid>
      <v-slide-y-transition mode="out-in">
          <v-layout column align-center>
            <article>
              <h1>Estarémos de vuelta muy pronto!</h1>
              <div>
                  <p>Disculpe las molestias, estamos trabajando en el sitio en este momento. Si es necesario, puede contactarnos al correo <a href="mailto:#">sinide.tdf@gmail.com</a>, de igual manera, estaremos de nuevo online muy pronto!</p><br>
                  <p style="text-align:left !important;">&mdash; Equipo de SIEP</p>
              </div>
            </article>
          </v-layout>
      </v-slide-y-transition>
    </v-container>
</template>
<script>

  export default {
    created: function(){
      store.commit('updateTitle',"SIEP | En Mantenimiento");
    },
    data(){
      return{
        apigw: process.env.SIEP_API_GW_INGRESS,
      }
    },
    components :{ },
    name: "mantenimiento",
    computed:{
      dialog(){
        return store.state.dialog.dialog;
      }
    },
    mounted(){
    },
    watch:{
      dialog(){}
    },
    methods:{
    }
  }
</script>

<style>
</style>