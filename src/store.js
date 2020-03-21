import Vue from 'vue' 
import Vuex from 'vuex';

Vue.use(Vuex);

import side from './stores/side';
import pegawai from './stores/pegawai';

const vuex_store = new Vuex.Store({
    modules: {
        side,
        pegawai
    },
});

export default vuex_store;