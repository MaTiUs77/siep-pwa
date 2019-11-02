// Modelo Familiar
import axios from 'axios'
import router from '../../../router'

const familiar = {
  state: {
    vinculo:"",
    nombres: "",
    apellidos: "",
    fecha_nac:"",
    sexo:"",
    tipo_doc:"",
    nro_doc:"",
    nacionalidad:"",
    provincia:"",
    localidad:"",
    direccion:"",
    comentarios:"",
    familiar: {}
  },
  getters: {
    familiar: state => {
      return state.familiar;
    }
  },
  mutations: {
    setStateFamiliar(state,valor){
      state.familiar = valor;
    }
  },
  actions:{
    apiGetFamiliar:function({commit,dispatch,state},payload){
      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${store.state.user.authToken}`;

      curl.get('/api/public/app_familiares/v1/familiares/persona/'+payload.familiar_id).then(function(familiar){
        var data = {
          'familiar_id': payload.familiar_id,
          'persona_id':payload.persona_id,
          'alumno_id': 0,
          'centro_id': 0,
          'legajo_fisico_nro':0,
          'pendiente':0
        }
        // Se crea el alumno
        dispatch("apiCreateAlumno",data);
        
      });
    },
    apiGetAlumnosForFamiliar:function({commit,state}){

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${store.state.user.authToken}`;

      curl.get('/api/public/app_familiares/v1/familiares/persona/'+store.state.user.authApi.persona.id).then(function(familiar){
        if(familiar.data.length > 0){
          familiar = familiar.data[0];
          curl.get('/api/public/app_familiares/v1/alumnos_familiars/alumnos/'+familiar.id).then(function(alumnos){
            commit("retrieveAlumnos",alumnos.data);
            commit("setStateFamiliar",familiar);
          });
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
    apiCreateFamiliar:function({commit,dispatch,state},payload){

      if(!payload.observaciones){
        payload.observaciones = "N/A";
      }
      payload.conviviente = 1;
      payload.autorizado_retirar = 0;
      
      payload._method = "POST";

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${store.state.user.authToken}`;

      curl.post('/api/public/app_familiares/v1/familiares',payload)
        .then(function (response) {
          // handle success
          if(response.data.familiar){
            console.log("Familiar Creado!");
          } else {
            console.log("Algo pasó en la creación del familiar: ",response.data);
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
          console.log("Algo pasó",error);
        });
    },
  }
};

export default familiar