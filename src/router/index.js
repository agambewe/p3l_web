import Vue from 'vue' 
import Router from 'vue-router' 
const SideLayout = () => import(/* webpackChunkName: "dashboard" */ '../components/sideLayout.vue') 
const loginLayout = () => import(/* webpackChunkName: "dashboard" */ '../components/login.vue') 
function loadView(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../components/dataMaster/${view}.vue`) 
}
function loadViewlaporan(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../components/laporan/${view}.vue`) 
}
function loadSampah(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../components/keranjangSampah/${view}.vue`) 
}
function loadRest(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../components/pengadaan/${view}.vue`) 
} 
function loadTransCS(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../components/transaksi/CS/${view}.vue`) 
} 
function loadTransKASIR(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../components/transaksi/KASIR/${view}.vue`) 
} 
const routes = [ 
    { name: 'login', path: '/login', component: loginLayout },
    { name: 'dashboardLayout', path: '/', component: SideLayout, 
        beforeEnter: (to, from, next) => {
            if(localStorage.getItem('username')) {
                next();
            } else{
                next('/login');
            }
        },
    },
    { path: '/', component: SideLayout,
        children: [ 
            //Sampah
            { name: 'CustomerTerhapus', path: '/customer/terhapus', component: loadSampah('customerController') },
            { name: 'HewanController', 
                path: '/hewan', 
                component: loadView('hewanController'),
                beforeEnter: (to, from, next) => {
                    if(localStorage.getItem('role')=="CS" || localStorage.getItem('role')=="OWNER") {
                        next();
                    } else{
                        next('/login');
                    }
                },
            },
            { name: 'HewanTerhapus', path: '/hewan/terhapus', component: loadSampah('hewanController') },

            //Master
            { name: 'PegawaiController', path: '/pegawai', component: loadView('pegawaiController') },
            { name: 'PegawaiTerhapus', path: '/pegawai/terhapus', component: loadSampah('pegawaiController') },
            { name: 'CustomerController', path: '/customer', component: loadView('customerController') },
            { name: 'ProdukController', path: '/produk', component: loadView('produkController') },
            { name: 'LayananController', path: '/layanan', component: loadView('layananController') },
            { name: 'UkuranHewanController', path: '/ukuran-hewan', component: loadView('ukuranHewanController') },
            { name: 'JenisHewanController', path: '/jenis-hewan', component: loadView('jenisHewanController') },

            //Laporan
            { name: 'LaporanController', path: '/laporan-pengadaan-tahunan', component: loadViewlaporan('laporanPengadaanTahunanController') },
            { name: 'LaporanController', path: '/laporan-pengadaan-bulanan', component: loadViewlaporan('laporanPengadaanBulananController') },
            { name: 'LaporanController', path: '/laporan-produk-terlaris', component: loadViewlaporan('laporanProdukTerlarisController') },
            { name: 'LaporanController', path: '/laporan-layanan-terlaris', component: loadViewlaporan('laporanLayananTerlarisController') },
            { name: 'LaporanController', path: '/laporan-pendapatan-tahunan', component: loadViewlaporan('laporanPendapatanTahunanController') },
            { name: 'LaporanController', path: '/laporan-pendapatan-bulanan', component: loadViewlaporan('laporanPendapatanBulananController') },
            
            //Pengadaan
            { name: 'SupplierController', path: '/supplier', component: loadRest('supplierController') },
            { name: 'PengadaanController', path: '/pengadaan', component: loadRest('pengadaanController') },
            { name: 'DetailController', path: '/detail-restock', component: loadRest('detailController') },

            //TransaksiCS
            { name: 'TlayananControllerCS', path: '/TlayananC', component: loadTransCS('TlayananController') },
            { name: 'TprodukControllerCS', path: '/TprodukC', component: loadTransCS('TprodukController') },
            
            //TransaksiKasir
            { name: 'TlayananControllerKASIR', path: '/TlayananK', component: loadTransKASIR('TlayananController') },
            { name: 'TprodukControllerKASIR', path: '/TprodukK', component: loadTransKASIR('TprodukController') },
        ],
        beforeEnter: (to, from, next) => {
            if(localStorage.getItem('username')) {
                next();
            } else{
                next('/login');
            }
        },  
    },
] 
Vue.use(Router) 
const router = new Router({
    mode: 'history', 
    routes: routes}) 
export default router