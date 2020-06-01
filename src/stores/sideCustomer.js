export default {
    namespaced: true,

    state: {
        customer: [
            {
                title: 'Daftar Prouk',
                icon: 'mdi-database',
                path: '/customerUI'
            },
        ],
    },

    getters: {
        getCustomer: state => state.customer,        
    },
};
