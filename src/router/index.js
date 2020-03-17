import Vue from 'vue' 
import Router from 'vue-router' 
const DashboardLayout = () => import(/* webpackChunkName: "dashboard" */ '../components/dashboardLayout.vue') 
const loginLayout = () => import(/* webpackChunkName: "dashboard" */ '../components/login.vue') 
function loadView(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../components/dashboardContents/${view}.vue`) 
} 
function loadSampah(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../components/keranjangSampah/${view}.vue`) 
} 
const routes = [ 
    { name: 'login', path: '/login', component: loginLayout },
    { name: 'dashboardLayout', path: '/', component: DashboardLayout, 
        beforeEnter: (to, from, next) => {
            if(localStorage.getItem('username')) {
                next();
            } else{
                next('/login');
            }
        },
    },
    { path: '/', component: DashboardLayout,
        children: [ 
            { name: 'PegawaiController', path: '/pegawai', component: loadView('pegawaiController') },
            { name: 'PegawaiTerhapus', path: '/pegawai/terhapus', component: loadSampah('pegawaiController') },
            { name: 'ProdukController', path: '/produk', component: loadView('produkController') },
            { name: 'LayananController', path: '/layanan', component: loadView('layananController') },
            { name: 'UkuranHewanController', path: '/ukuran-hewan', component: loadView('ukuranHewanController') },
            { name: 'JenisHewanController', path: '/jenis-hewan', component: loadView('jenisHewanController') },
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