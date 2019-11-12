<template>
  <v-container>
    <v-flex xs12 class="text-xs-center">
      <v-dialog v-model="user.apiGetUserDataRunning" persistent content content-class="centered-dialog">
        <v-container fill-height>
          <v-layout column justify-center align-center>
            <v-progress-circular
              :size="70"
              :width="7"
              color="orange"
              indeterminate
              v-if="user.apiGetUserDataRunning"
            ></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
      

      <div v-if="!user.loggedIn && !user.apiGetUserDataRunning">
        <p class="subheading">Por favor, inicie sesion para acceder a esta sección.</p>

        <div class="text-xs-center">
          <v-btn round color="primary" small @click="goToLogin">Quiero iniciar sesion</v-btn>
        </div>

      </div>

      <div v-if="user.loggedIn">
        <h3 class="display-2 font-weight-bold" >Bienvenido!</h3>

        <h3 v-if="persona" class="display-1">
          {{persona.nombres }} {{persona.apellidos }}
        </h3>

        <v-divider class="my-3"></v-divider>

        <div v-if="!persona" >
          <p class="subheading">Por favor, ingrese su número de documento en el campo de búsqueda para vincular un perfíl ya creado.</p>
          <v-text-field
          v-model="documento_nro"
          label="Ingrese su número de documento"
          v-on:keyup.enter="startFindPersona"
          ></v-text-field>
          <v-btn color="primary" @click="startFindPersona()" :loading="findPersonaRunning" :block="isMobile"><v-icon left>search</v-icon>Buscar Perfíl</v-btn>

          <!-- Resultados de busqueda -->
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <div v-show="personNotFound">
                <p class="not_found">
                  EL NÚMERO DE DOCUMENTO INGRESADO NO PERTENECE A NINGÚNA PERSONA REGISTRADA
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
                          <h2 class="subheading mb-0">{{ res.nombres }} {{ res.apellidos}}</h2>
                          <h3>DNI: {{ res.documento_nro}}</h3>
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn color="success" @click="goWithSelected(res)" :loading="vinculandoPerfil" :block="isMobile"><v-icon left>person</v-icon>Vincular Perfíl</v-btn>
                      </v-card-actions>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          <p class="subheading">Si no se encontraron resultados, complete sus datos personales para poder continuar.</p>

          <v-flex>
            <v-btn class="mx-0" color="success" :block="isMobile" @click="goToFamiliar('create')">
              <v-icon left>how_to_reg</v-icon>Completar perfíl
            </v-btn>
          </v-flex>
        </div>
        <!-- EN CASO QUE LA PERSONA ESTE DEFINIDA -->
        <div v-else>

          <!-- EDICION DE PERSONA -->
          
          <v-flex>
            <v-btn class="mx-0" color="orange" dark large :block="isMobile" @click="goToFamiliar('update')">
              <v-icon left>edit</v-icon>Editar  mi perfil
            </v-btn>
          </v-flex>

          <v-flex>
            <v-btn class="mx-0" color="primary" large :block="isMobile" @click="goToStudent">
              <v-icon left>how_to_reg</v-icon>Agregar/Ver Estudiantes
            </v-btn>
          </v-flex>
        </div>

      </div>

    </v-flex>
  </v-container>
</template>
<script>
  import router from '../router'

  export default {
    data: ()=>({
      isMobile:false,
      personaUpdated:false,
      resultado:[],
      spinner:true,
      documento_nro:"",
      findPersonaRunning: false,
      personNotFound:false,
      vinculandoPerfil: false,
    }),
    created: function() {
      store.commit('updateTitle',"SIEP | Familiares");
    },
    mounted: function() {
      this.onResize();
    },
    computed: {
      user(){
        return store.state.user
      },
      persona(){
        return store.getters.persona;
      },
      administracion(){
        if(store.state.administracion.administracion.en_mantenimiento === 1){
          router.push('/mantenimiento');
        }
        return store.state.administracion.administracion;
      }
    },
    watch:{
      persona(value){
        if(!this.personaUpdated){
          this.createFamiliar(value);
        }else{
        }
      },
      administracion(){}
    },
    methods:{
      onResize(){
        if(window.innerWidth <= 480){
          this.isMobile = true;
        }else{
          this.isMobile = false;
        }
      },
      goToLogin: function(){
        router.push('/')
      },
      goToFamiliar:function(mode){
        router.push(`/inscripciones/familiar/${mode}`)
      },
      goToStudent:function(){
        router.push('/inscripciones')
      },
      goWithSelected:function(persona){
        this.vinculandoPerfil = true;
        persona = _.pickBy(persona, _.identity);
        if(persona.ciudad.nombre){
          persona.ciudad = persona.ciudad.nombre;
        }
        if(persona.barrio.nombre){
          persona.barrio = persona.barrio.nombre;
        }
        persona.familiar = 1;
        if(persona.sexo === "Masculino" || persona.sexo === "MASCULINO"){
          persona.vinculo = "Padre";
        }else if(persona.sexo === "Femenino" || persona.sexo === "FEMENINO"){
          persona.vinculo = "Madre";
        }
        store.dispatch('apiCreatePersona',persona);
      },
      createFamiliar: function(persona){
        this.personaUpdated = true;
        var pers = persona;
        pers = _.pickBy(pers, _.identity);
        pers.vinculo;
        pers._method = "POST";
        pers.familiar = 1;
        if(pers.ciudad.nombre){
          pers.ciudad = pers.ciudad.nombre;
        }
        if(pers.barrio.nombre){
          pers.barrio = pers.barrio.nombre;          
        }

        pers.alumno = 0;
        if(pers.sexo === "Masculino" || pers.sexo === "MASCULINO"){
          pers.vinculo = "Padre";
        }else if(pers.sexo === "Femenino" || pers.sexo === "FEMENINO"){
          pers.vinculo = "Madre";
        }
        store.dispatch('apiCreatePersona',pers);
      },
      startFindPersona:function(){
        let vm = this;
        vm.findPersonaRunning = true;
        vm.personNotFound = false;
        vm.resultado = [];
        
        store.dispatch('apiFindPersona',{
          documento_nro:this.documento_nro
        })
          .then(function (response) {
            // handle success

            vm.resultado = response.data.data;
            vm.findPersonaRunning = false;
            vm.verifyPersonFinded();
        })
          .catch(function (error) {
            // handle error
            vm.resultado = [];
            vm.findPersonaRunning = false;
          });
      },
      verifyPersonFinded:function(){
        let vm = this;
        if(!vm.resultado.length){
          vm.personNotFound = true;
          setTimeout(() => vm.personNotFound = false, 5000);
        }else{
          vm.personNotFound = false;
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.not_found{
  color: #ff5f00 /*ff8c00*/
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.not_found{
  color: #ff5f00 /*ff8c00*/
}
</style>
