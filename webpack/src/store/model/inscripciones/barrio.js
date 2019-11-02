import axios from 'axios'
import router from '../../../router'

const barrio = {
    state: {
      apiNeighborhoodFiltering:false,
      neighborhoodApi:[],
    },
    getters: {
      barriosApi: state => state.neighborhoodApi
    },
    mutations: {
      refillNeighborhood(state,payload){
        state.neighborhoodApi = payload;
      }
    },
    actions: {
        apiFilterNeighborhood: function({commit,state},payload){
          const curl = axios.create({
            baseURL: process.env.SIEP_API_GW_INGRESS
          });
          // Header con token
          curl.defaults.headers.common['Authorization'] = `Bearer ${store.state.user.authToken}`;
          state.apiNeighborhoodFiltering = true;
          curl.get('/api/public/app_familiares/v1/barrios',{
            params: payload
          }).then(function(response){
            let res = response.data.map(x => {
              return x.nombre
            });
            commit('refillNeighborhood', res); 
            state.apiNeighborhoodFiltering = false;
          }).catch(function (error) {
            // handle error
            console.log(error);
          });
        }
      }
    };

    export default barrio