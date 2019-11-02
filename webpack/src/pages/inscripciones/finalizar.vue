<template>

    <v-jumbotron>
        <v-container fluid>
            <v-layout column align-center>
                <blockquote>
                    <v-flex>
                        <h3 class="display-2 text-xs-center text-sm-center text-md-center text-lg-center font-weight-bold" >Registro Completado!</h3>
                        <v-divider class="my-3"></v-divider>

                        <div>
                            <v-flex class="text-xs-center text-sm-center text-md-center text-lg-center">
                                <v-btn class="mx-0" color="success" large @click="goHome">
                                    <v-icon left>home</v-icon>Volver a Inicio
                                </v-btn>
                            </v-flex>
                        </div>

                    </v-flex>
                </blockquote>

            </v-layout>
        </v-container>
    </v-jumbotron>


</template>
<script>

  import router from '../../router'
  export default{
    created: function(){
      store.commit('updateTitle',"Finalizado");
    },
    computed:{
      user(){
        return store.state.user
      }
    },
    methods:{
      goHome:function(){
        router.push('/home')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
