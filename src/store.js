import Vue from 'vue' 
import Vuex from 'vuex';

Vue.use(Vuex);

import side from './stores/side';

const vuex_store = new Vuex.Store({
    modules: {
        side
    },
});

export default vuex_store;