import Vue from 'vue' 
import Router from 'vue-router' 
const SideLayout = () => import(/* webpackChunkName: "dashboard" */ '../components/sideLayout.vue') 
const loginLayout = () => import(/* webpackChunkName: "dashboard" */ '../components/login.vue') 
function loadView(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../components/dataMaster/${view}.vue`) 
} 
function loadSampah(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../components/dataMaster/${view}.vue`) 
}
function loadRest(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../components/pengadaan/${view}.vue`) 
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

            //Pengadaan
            { name: 'SupplierController', path: '/supplier', component: loadRest('supplierController') },
            { name: 'PengadaanController', path: '/pengadaan', component: loadRest('pengadaanController') },
            { name: 'DetailController', path: '/detail-restock', component: loadRest('detailController') },
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