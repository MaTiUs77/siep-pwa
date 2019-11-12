<template>
  <v-container>
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
      <v-flex xs12 class="text-xs-center">
      <v-text-field
              v-model="documento_nro"
              label="Ingresar documento del Estudiante"
              v-on:keyup.enter="startFindPersona"
      ></v-text-field>
      <v-btn color="primary" @click="startFindPersona" :loading="findPersonaRunning"><v-icon left>search</v-icon>Buscar Estudiante</v-btn>

      <!-- Resultados de busqueda -->
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <div v-show="studentNotFound">
            <p class="not_found">
              EL NÚMERO DE DOCUMENTO INGRESADO NO PERTENECE A NINGÚN ALUMNO REGULAR
            </p>
          </div>
          <v-flex
                v-for="res in resultado"
                :key="res.id"
                xs12 sm12 md3 lg3 xl6 mb-1
              >
            <v-card>
              <v-layout fill-height>
                <v-flex xs12 flexbox>
                  <v-card-text>
                    <div>
                      <h3 class="subheading mb-0">{{ res.nombres }} {{ res.apellidos }}</h3>
                      <h3>DNI: {{ res.documento_nro }}</h3>
                    </div>
                    <v-btn color="success" @click="goWithSelected(res)" :loading="vinculandoPerfil"><v-icon left>person</v-icon>Vincular Estudiante</v-btn>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      

      <v-divider v-if="alumnos.length" />
      <!-- Resultados de Relaciones con Familiar -->
      <v-container fluid grid-list-md v-if="alumnos.length">
        <p class="descriptions">
          AQUI DEBAJO SE LISTAN LOS ESTUDIANTES REGISTRADOS COMO FAMILIAR SUYO
        </p>
        <v-layout row wrap>
        <!-- <v-data-iterator
            :items="alumnos"
            content-tag="v-layout"
            hide-actions
            no-data-text=""
            column 
        > -->
          <v-flex
            v-for="al in alumnos"
            :key="al.id"
            xs12 sm12 md3 lg3 xl6 mb-1
          >
          <v-card>
            <v-layout fill-height>
              <v-flex xs12 flexbox>
              <v-card-text>
                <div>
                  <h3 class="subheading mb-0">{{ al.nombres }} {{ al.apellidos}}</h3>
                  <h3>DNI: {{ al.documento_nro}}</h3>
                  <div>
                    <v-chip v-if="al.status === 'confirmada'" color="green" text-color="white">
                      <v-avatar>
                        <v-icon>check_circle</v-icon>
                      </v-avatar>
                      Confirmada
                    </v-chip>
                    <v-chip v-if="al.status === 'pendiente'" color="default" text-color="black">
                      <v-avatar>
                        <v-icon>schedule</v-icon>
                      </v-avatar>
                      Pendiente
                    </v-chip>
                    <v-chip v-if="al.status === 'revisar'" color="orange" text-color="white">
                      <v-avatar>
                        <v-icon>warning</v-icon>
                      </v-avatar>
                      Dirigirse a Institución
                    </v-chip>
                  </div>
                  <div>
                    <!-- Esto es para más adelante  -->
                    <!-- <v-btn v-if="al.status === 'confirmada'" color="info" fab small dark>
                      <v-icon>visibility</v-icon>
                    </v-btn>
                    <v-btn v-if="al.status === 'confirmada'" color="info" fab small dark>
                      <v-icon>edit</v-icon>
                    </v-btn> -->
                  </div>
                </div>
              </v-card-text>
              </v-flex>
            </v-layout>
          </v-card>
          </v-flex>
        <!-- </v-data-iterator> -->
        </v-layout>
      </v-container>

        <v-container>
          <v-divider />

          <br>
          <p class="descriptions">
            EN CASO DE NO OBTENER RESULTADOS DE BUSQUEDA, PUEDE AGREGAR UN ESTUDIANTE NUEVO
          </p>

          <v-btn color="primary" @click="goNewStudent"><v-icon left>person_add</v-icon> Agregar Estudiante</v-btn>
        </v-container>


      </v-flex>
    </v-container>
</template>

<script>
  import router from '../../router'
  import axios from 'axios'

  export default {
    components:{},
    data: ()=>({
      apigw: process.env.SIEP_API_GW_INGRESS,
      documento_nro:"",
      findPersonaRunning: false,
      studentNotFound:false,
      spinner:true,
      vinculandoPerfil: false,
      resultado:[],
      form:{}
    }),
    created: function(){
      store.commit('updateTitle',"Inscripciones");
      store.dispatch('apiGetAlumnosForFamiliar');
    },
    mounted:function(){
    },
    computed:{
      user(){
        return store.state.user
      },
      alumno(){
        return store.state.alumno
      },
      alumnos(){
        return store.getters.alumnos
      },
      familiar(){
        return store.getters.familiar
      }
      // SE HARÁ EN FUTURAS ACTUALIZACIONES
      // administracion(){
      //   if(store.state.administracion.administracion.en_mantenimiento === 1){
      //     router.push('/mantenimiento');
      //   }
      //   return store.state.administracion.administracion;
      // }
    },
    watch:{
      alumnos(){if(this.spinner){this.spinner = false;}},
      familiar(){}
      // SE HARÁ EN FUTURAS ACTUALIZACIONES
      // administracion(){}
    },
    methods:{
      startFindPersona:function(){
        let vm = this;
        vm.studentNotFound = false;
        vm.findPersonaRunning = true;
        vm.resultado = [];
        store.dispatch('apiFindPersona',{
          documento_nro:this.documento_nro,
          alumno:1
        })
          .then(function (response) {
            // handle success
            vm.resultado = response.data.data;
            vm.findPersonaRunning = false;
            vm.verifyStudentFinded();

        })
          .catch(function (error) {
            // handle error
            vm.resultado = [];
            vm.findPersonaRunning = false;
            vm.studentNotFound = false;
          });
      },
      goNewStudent:function(){
        router.push('/inscripciones/alumno');
      },
      goBack:function(){
        router.go(-1);
      },
      goWithSelected:function(alumno){
        this.vinculandoPerfil = true;
        store.dispatch('relateAlumnoFamiliars',alumno);
      },
      verifyStudentFinded:function(){
        let vm = this;
        if(!vm.resultado.length){
          vm.studentNotFound = true;
          setTimeout(() => vm.studentNotFound = false, 5000);
        }else{
          vm.studentNotFound = false;
        }
      }
    }
  }
</script>

<style>
  .dialog.centered-dialog,
  .v-dialog.centered-dialog
  {
    /* background: #282c2dad; */
    box-shadow: none;
    border-radius: 6px;
    width: auto;
    color: whitesmoke;
  }

  .not_found{
    color: #ff5f00 /*ff8c00*/
  }
  .descriptions{
    color: rgb(70, 78, 78);
  }
</style>
