import axios from 'axios'
import router from '../../../router'

const persona = {
    state: {
      authToken:null,
      authApi: {},
      apiGetUserDataRunning: false,
      porcentaje_perfil: 0,
    },
    getters: {
      // persona: state => {
      //   return state.authApi.persona;
      // }
    },
    mutations: {
        update_nombre_completo(state,payload) {
            state.nombre_completo = payload
        },
        retrieveAlumnos(state,payload){
            state.alumnos = payload;
        }
    },
    actions: {
        apiFindPersona: function({state},payload) {
          const curl = axios.create({
            baseURL: process.env.SIEP_API_GW_INGRESS
          });
          // Header con token
          curl.defaults.headers.common['Authorization'] = `Bearer ${store.state.user.authToken}`;
    
          var response = curl.get('/api/public/app_familiares/v1/personas',{
            params: payload
          });
    
          return response;
        },
        apiCreatePersona: function({commit,dispatch,state},createPersona) {
    
          const curl = axios.create({
            baseURL: process.env.SIEP_API_GW_INGRESS
          });
          // Header con token
          curl.defaults.headers.common['Authorization'] = `Bearer ${store.state.user.authToken}`;
    
          // createPersona.familiar = createPersona.isFamiliar;

          if(!createPersona.documento_tipo){
            createPersona.documento_tipo = "0";
            createPersona.calle_nro = 0;
            createPersona.calle_nombre = "calle";
            createPersona.email = "email@email.com";
            createPersona.fecha_nac = "1900/01/01";
            createPersona.telefono_nro = 2901;
          }


          curl.post('/api/public/app_familiares/v1/personas',createPersona)
            .then(function (response) {
              // handle success
              if(response.data.persona)
              {
                if(createPersona.familiar)
                { 
                    createPersona.persona_id = response.data.persona.id;
                    dispatch('apiGetUserData');
                    // dispatch("apiCreateFamiliar",createPersona).then(function(){
                    // });
                } else {
                    createPersona.persona_id = response.data.persona.id;
                    createPersona.familiar_id = store.state.user.authApi.persona_id;
                    dispatch("apiGetFamiliar",createPersona);
                }
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
                message: response.data.error
              };
              store.dispatch('toggleAlertMessage',alerta);
              console.log(error);
            });
    
        },
        apiUpdatePersona: function({commit,dispatch,state},payload) {
    
          const curl = axios.create({
            baseURL: process.env.SIEP_API_GW_INGRESS
          });
          // Header con token
          console.log("apiUpdatePersona: ",payload);
          curl.defaults.headers.common['Authorization'] = `Bearer ${store.state.user.authToken}`;
          curl.post('/api/public/app_familiares/v1/personas/'+store.state.user.authApi.persona.id,payload)
              .then(function (response) {
                // handle success
                if(response.data.updated)
                {
                  if(payload.familiar)
                  {
                    dispatch('apiGetUserData');
                  } else {
                    // Si es familiar crea el familiar
                    if(payload.familiar){
                      payload.persona_id = store.state.user.authApi.persona.id;
                      dispatch("apiCreateFamiliar",payload);
                    }else{
    
                    }
                    router.push({
                      path: '/inscripciones/finalizar'
                    });
                  }
                } else {
                  let alerta = {
                    show: true,
                    class: "error",
                    message: response.data.error
                  };
                  store.dispatch('toggleAlertMessage',alerta);
                }
              })
              .catch(function (error) {
                // handle error
                let alerta = {
                  show: true,
                  class: "error",
                  message: response.data.error
                };
                store.dispatch('toggleAlertMessage',alerta);
                console.log(error);
              });
        },
        apiFindDni: function({state},payload){

            const curl = axios.create({
                baseURL: process.env.SIEP_API_GW_INGRESS
            });
            // Header con token
            curl.defaults.headers.common['Authorization'] = `Bearer ${store.state.user.authToken}`;
        
            var response = curl.get('/api/public/app_familiares/v1/personas',{
                params: {documento_nro:payload}
            });
        
            return response;
        }
      }
}

export default persona

