import Vue from 'vue' 
import Router from 'vue-router' 
const DashboardLayout = () => import(/* webpackChunkName: "dashboard" */ '../components/dashboardLayout.vue') 
// const loginLayout = () => import(/* webpackChunkName: "dashboard" */ '../components/login.vue') 
// const landingLayout = () => import(/* webpackChunkName: "dashboard" */ '../components/landingPageController.vue') 
function loadView(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../components/dashboardContents/${view}.vue`) 
} 
// function loadUser(view) {
//     return () => import(/* webpackChunkName: "view-[request]" */ `../components/userContents/${view}.vue`) 
// } 
const routes = [ 
    // { name: 'login', path: '/login', component: loginLayout },
    { name: 'dashboardLayout', path: '/', component: DashboardLayout },
    { path: '/', component: DashboardLayout,
        children: [ 
            // { name: 'UserController', path: '/user', component: loadView('userController') },
            { name: 'PegawaiController', path: '/pegawai', component: loadView('pegawaiController') },
            { name: 'UkuranHewanController', path: '/ukuran-hewan', component: loadView('ukuranHewanController') },
            { name: 'JenisHewanController', path: '/jenis-hewan', component: loadView('jenisHewanController') },
        ],
    },
] 
Vue.use(Router) 
const router = new Router({
    mode: 'history', 
    routes: routes}) 
export default router