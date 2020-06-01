export default {
    namespaced: true,

    state: {
        owner: [
            // { 
            //     title: 'Dashboard', 
            //     path: '/', 
            //     icon: 'mdi-home' 
            // },
            { 
                title: 'Pengadaan',
                icon: 'mdi-truck-fast', 
                items: [
                    { 
                        title: 'Data Supplier', 
                        path: '/supplier',
                    }, 
                    { 
                        title: 'Pengadaan produk', 
                        path: '/pengadaan',
                    }, 
                ]
            },  
            {
                title: 'Data Master',
                icon: 'mdi-database',
                active: true,
                items: [
                    { 
                        title: 'Pegawai', 
                        path: '/pegawai',
                    }, 
                    { 
                        title: 'Customer', 
                        path: '/customer',
                    }, 
                    { 
                        title: 'Hewan',
                        path: '/hewan',
                    }, 
                    { 
                        title: 'Produk', 
                        path: '/produk',
                    }, 
                    { 
                        title: 'Layanan', 
                        path: '/layanan',
                    }, 
                    { 
                        title: 'Ukuran Hewan', 
                        path: '/ukuran-hewan', 
                    }, 
                    { 
                        title: 'Jenis Hewan', 
                        path: '/jenis-hewan',
                    },
                ],
            },
            // {
            //     title: 'Transaksi',
            //     icon: 'mdi-store',
            //     items: [
            //     ],
            // },
            {
                title: 'Laporan',
                icon: 'mdi-file-document',
                items: [
                    {
                        title: 'Pengadaan',
                        path: '/laporan-pengadaan-tahunan',
                    },
                    {
                        title: 'Produk',
                        path: '/laporan-produk-terlaris',
                    },
                    {
                        title: 'Layanan',
                        path: '/laporan-layanan-terlaris',
                    },
                    {
                        title: 'Pendapatan',
                        path: '/laporan-pendapatan-tahunan',
                    },
                ],
            },
        ],
        cs: [
            {
                title: 'Data Master',
                icon: 'mdi-database',
                items: [
                    { 
                        title: 'Customer', 
                        path: '/customer',
                    }, 
                    { 
                        title: 'Hewan',
                        path: '/hewan',
                    }, 
                    // { 
                    //     title: 'Produk', 
                    //     path: '/produk',
                    // }, 
                    // { 
                    //     title: 'Layanan', 
                    //     path: '/layanan',
                    // },
                ],
            },
            {
                title: 'Transaksi',
                icon: 'mdi-store',
                active: true,
                items: [
                    { 
                        title: 'Layanan', 
                        path: '/TlayananC',
                    },
                    { 
                        title: 'Produk', 
                        path: '/TprodukC',
                    },
                ],
            },
            // {
            //     title: 'Transaksi',
            //     icon: 'mdi-store',
            //     items: [
            //     ],
            // },
        ],
        kasir: [
            {
                title: 'Transaksi',
                icon: 'mdi-store',
                active: true,
                items: [
                    { 
                        title: 'Layanan', 
                        path: '/TlayananK',
                    },
                    { 
                        title: 'Produk', 
                        path: '/TprodukK',
                    },
                ],
            },
        ],
    },

    getters: {
        getOwner: state => state.owner,
        getCs: state => state.cs,
        getKasir: state => state.kasir,
    },
};
