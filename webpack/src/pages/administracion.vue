<template>
    <v-container fluid>
      <v-slide-y-transition mode="out-in">
          <v-layout>
            <v-flex xs12 md6 lg6 xl6>
              <v-card>
                <v-card-title><h3>Configuraciones de Sitio:</h3></v-card-title>
                <v-card-text>
                  <v-switch
                    v-model="form.maintenanceMode"
                    label="Sitio En Mantenimiento"
                    color="red"
                  ></v-switch>
                </v-card-text>
                <v-card-actions>
                  <v-btn icon color="info" @click="goHome">
                    <v-icon>house</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat color="success" @click="save" @loading="working">
                    <v-icon>save</v-icon>
                    Guardar Cambios
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            
          </v-layout>
      </v-slide-y-transition>
    </v-container>
</template>
<script>

  import router from '../router'

  export default {
    created: function(){
      store.commit('updateTitle',"SIEP | Administración");
    },
    data(){
      return{
        apigw: process.env.SIEP_API_GW_INGRESS,
        form:{
          maintenanceMode:false
        },
        

      }
    },
    components :{ },
    name: "administracion",
    computed:{
      dialog(){
        return store.state.dialog.dialog;
      },
      administracion(){
        if(store.state.administracion.administracion.en_mantenimiento === 1){
          this.form.maintenanceMode = true;
        }else{
          this.form.maintenanceMode = false;
        }
        return store.state.administracion.administracion;
      },
      working(){
        return store.state.working.working;
      }
    },
    mounted(){
    },
    watch:{
      dialog(){},
      administracion(){},
      working(){},
    },
    methods:{
      goHome(){ 
        router.push('/');
      },
      save(){

      }
    }
  }
</script>

<style>
</style>