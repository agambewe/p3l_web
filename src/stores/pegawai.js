import Axios from 'axios' 
const item = {
    nama: '',
    username: '',
    alamat: '',
    tanggal_lahir: '',
    telepon: '',
    role: '',
    password: '',
}

export default {
    namespaced: true,

    state: {
        item: Object.assign({}, item),
    },

    getters: {
        getOwner: state => state.owner,
        getCs: state => state.cs,
        getKasir: state => state.kasir,
    },
    mutations: {
        setItem(state, source) {
            state.item = source.data;
        }
    },
    actions: {
        async readData(context) {
            return new Promise((resolve) => {
                Axios.get('http://127.0.0.1:8000/api/pegawai/').then(response => {
                    context.commit('setItem',response.data)
                    resolve(response.data);
                })
            });
        }
    }
};
