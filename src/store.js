import Vue from 'vue' 
import Vuex from 'vuex';

Vue.use(Vuex);

import side from './stores/side';
import pegawai from './stores/pegawai';
import transaksi from './stores/transaksi';
import restock from './stores/restock';

const vuex_store = new Vuex.Store({
    modules: {
        side,
        pegawai,
        transaksi,
        restock,
    },
});

export default vuex_store;