import Axios from 'axios' 

export default {
    namespaced: true,

    state: {
        id_po: '-'
    },
    getters: {
        idPo: state => state.id_po,
    },
    mutations: {
        changeId (state, payload) {
            state.id_po = payload
        }
    },
    actions: {}
};
