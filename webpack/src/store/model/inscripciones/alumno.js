import axios from 'axios'
import router from '../../../router'

const alumno = {
    state: {
      authApi: {},
      apiGetUserDataRunning: false,
      alumnos: {}
    },
    getters: {
        alumnos: state => state.alumnos,
    },
    mutations: {
        retrieveAlumnos(state,payload){
            state.alumnos = payload.data;
        }
    },
    actions: {
        apiCreateAlumno: function({commit,dispatch,state},payload){
    
            payload._method = "POST";
      
            const curl = axios.create({
              baseURL: process.env.SIEP_API_GW_INGRESS
            });
            // Header con token
            curl.defaults.headers.common['Authorization'] = `Bearer ${store.state.user.authToken}`;

      
            curl.post('/api/public/app_familiares/v1/alumnos',payload)
              .then(function (response) {
                // handle success
                if(response.data.alumno.id){
                  console.log("Alumno Creado!");
                  payload.alumno_id = response.data.alumno.id;
                  // Posteriormente se crea la relación entre el Alumno y el Familiar
                  dispatch("apiCreateAlumnoFamiliars",payload);
                } else {
                  console.log(response.data);
                }
              })
              .catch(function (error) {
                // handle error
                let alerta = {
                  show: true,
                  class: "error",
                  message: error
                };
                store.dispatch('toggleAlertMessage',alerta);
                console.log(error);
              });
        },
        relateAlumnoFamiliars: function({commit,dispatch,state},alumno){
    
            let familiar = store.getters.familiar;
            const curl = axios.create({
                baseURL: process.env.SIEP_API_GW_INGRESS
            });
            // Header con token
            curl.defaults.headers.common['Authorization'] = `Bearer ${store.state.user.authToken}`;
            var data = {
                'familiar_id': familiar.id,
                'persona_id':alumno.id,
                'alumno_id': 0,
                'centro_id': 0,
                'legajo_fisico_nro':0,
                'pendiente':0
                }
                
            alumno.centro_id = 0;
            alumno.persona_id = alumno.id;
            alumno.legajo_fisico_nro = 0;
            if(alumno.familiar == "0"){
                alumno.familiar = 0;
            } else if (alumno.familiar == "1"){
                alumno.familiar = 1;
            }
            curl.post('/api/public/app_familiares/v1/alumnos',alumno)
            .then(function (response) {
            // handle success
                if(response.data.alumno.id){
                    data.alumno_id = response.data.alumno.id;
                    // Posteriormente se crea la relación entre el Alumno y el Familiar
                    dispatch("apiCreateAlumnoFamiliars",data);
                    router.push({
                    path: '/inscripciones/finalizar'
                    });
                } else {
                    console.log(response.data);
                }
                })
                .catch(function (error) {
                // handle error
                let alerta = {
                    show: true,
                    class: "error",
                    message: error
                };
                store.dispatch('toggleAlertMessage',alerta);
                console.log(error);
            });

            // Ya no hace falta
            // curl.get('/api/public/app_familiares/v1/familiares/persona/'+store.state.user.authApi.persona.id).then(function(familiar){
            // });
    
        },
        apiCreateAlumnoFamiliars: function({commit,dispatch,state},payload){
    
        payload._method = "POST";
        payload.status = "pendiente";
        const curl = axios.create({
            baseURL: process.env.SIEP_API_GW_INGRESS
        });
        // Header con token
        curl.defaults.headers.common['Authorization'] = `Bearer ${store.state.user.authToken}`;
    
        curl.post('/api/public/app_familiares/v1/alumnos_familiars',payload)
            .then(function (response) {
                // handle success
                if(response.data.alumnos_familiars.id){
                    console.log("Relación Alumno-Familiar Creado!");
                } else {
                    console.log(response.data);
                }
            })
            .catch(function (error) {
                // handle error
                let alerta = {
                    show: true,
                    class: "error",
                    message: error
                };
                store.dispatch('toggleAlertMessage',alerta);
                console.log(error);
            });
        },
    }
}

export default alumno