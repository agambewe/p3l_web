import Axios from 'axios' 

export default {
    namespaced: true,

    state: {
        id_transaksi: '-'
    },
    getters: {
        idTransaksi: state => state.id_transaksi,
    },
    mutations: {
        changeId (state, payload) {
            state.id_transaksi = payload
        }
    },
    actions: {}
};
