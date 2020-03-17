<template> 

    <div> 
        <v-navigation-drawer
        v-model="drawer"
        :expand-on-hover="expandOnHover"
        :mini-variant="miniVariant"
        :src="bg"
        absolute
        dark
        >
            <v-list-item> 
                <v-list-item-content> 
                    <v-list-item-title class="title"> ICONIC </v-list-item-title> 
                    <v-list-item-subtitle> g00d </v-list-item-subtitle> 
                </v-list-item-content> 
            </v-list-item> 
            <v-divider></v-divider> 
            <v-list> 
                <v-list-item v-for="item in items" :key="item.title" link > 
                    <v-list-item-icon> 
                        <v-icon>{{ item.icon }}</v-icon> 
                    </v-list-item-icon> 
                    <v-list-item-content> 
                        <router-link :to="item.path" tag="li" exact>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </router-link>
                    </v-list-item-content> 
                </v-list-item> 
            </v-list> 
            <template v-slot:append> 
                <div class="pa-2">
                    <v-btn block @click="submitLogout()"><v-icon>mdi-logout</v-icon></v-btn>
                </div>
            </template> 
        </v-navigation-drawer> 
        <v-app-bar dark app fixed clipped-right height="75px" :src="bg"> 
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> 
            <img src="../assets/logo.png" style="height:45px;width:45px"> 
            <v-toolbar-title style="font-size: 21px;" class="white--text" > Couvee Pet Shop </v-toolbar-title>
            <VSpacer /> 
            <!-- <v-toolbar-tems>
                <v-btn text router to="/">Home</v-btn>
                <v-btn v-if="logwhat" text router to="/user/profile">Profile</v-btn>
                <v-btn v-else text router to="/user">Login</v-btn>
            </v-toolbar-tems> -->
        </v-app-bar> 
        <VContent > 
            <router-view /> 
        </VContent> 
    </div> 
</template> 

<script> 
export default { 
    data () { 
        return { 
            drawer: true,
            expandOnHover: true,
            miniVariant: true,
            // load: false,
            // logwhat: '',
            items: [ 
                { 
                    title: 'Dashboard', 
                    path: '/', 
                    icon: 'mdi-home' 
                },
                { 
                    title: 'User Controller', 
                    path: '/user', 
                    icon: 'mdi-human-male' 
                },  
                { 
                    title: 'Pegawai', 
                    path: '/pegawai', 
                    icon: 'mdi-human' 
                }, 
                { 
                    title: 'Produk', 
                    path: '/produk', 
                    icon: 'mdi-file' 
                }, 
                { 
                    title: 'Layanan', 
                    path: '/layanan', 
                    icon: 'mdi-store' 
                }, 
                { 
                    title: 'Ukuran Hewan', 
                    path: '/ukuran-hewan', 
                    icon: 'mdi-ruler' 
                }, 
                { 
                    title: 'Jenis Hewan', 
                    path: '/jenis-hewan', 
                    icon: 'mdi-chart-donut' 
                }, 
            ],
        } 
    }, 
    mounted () {
    },
    methods: {
        submitLogout() {
            localStorage.removeItem('username')
            this.$router.push({
                    name: 'login'
                })
        },
    },
    computed: {
    bg () {
    return 'http://sf.co.ua/2012/wallpaper-1729525.jpg'
    },
},
} 
</script>