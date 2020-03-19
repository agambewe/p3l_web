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
                    <v-list-item-title class="title"> Couvee </v-list-item-title> 
                    <v-list-item-subtitle> shop </v-list-item-subtitle> 
                </v-list-item-content> 
            </v-list-item> 
            <v-divider></v-divider> 
            <v-list shaped> 
                <v-list-group
                    v-for="sub in items"
                    :key="sub.title"
                    v-model="sub.active"
                    :prepend-icon="sub.icon"
                    no-action
                >
                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title v-text="sub.title"></v-list-item-title>
                    </v-list-item-content>
                </template>
                
                    <v-list-item 
                        v-for="item in sub.items" 
                        :key="item.title" link 
                        @click="item.path"
                    >
                        <v-list-item-content> 
                            <router-link :to="item.path" tag="ul" exact>
                            <v-list-item-title v-text="item.title"></v-list-item-title>
                            </router-link>
                        </v-list-item-content> 
                    </v-list-item> 
                </v-list-group>
            </v-list> 
            <!-- <template v-slot:append> 
                <div class="pa-2">
                    <v-btn block @click="submitLogout()"><v-icon>mdi-logout</v-icon></v-btn>
                </div>
            </template>  -->
        </v-navigation-drawer> 
        <v-app-bar dark app fixed height="75px" :src="bg"> 
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> 
            <img src="../assets/logo.png" style="height:45px;width:45px"> 
            <v-toolbar-title style="font-family: 'Jolly Lodger';font-size: 45px;" > Couvee Pet Shop </v-toolbar-title>
            <VSpacer /> 
            <v-toolbar-tems>
                <v-btn text router to="/user/profile"><v-icon>mdi-face</v-icon></v-btn>
                <v-btn text router @click="submitLogout()"><v-icon>mdi-power</v-icon></v-btn>
            </v-toolbar-tems>
        </v-app-bar> 
        <VContent > 
            <router-view /> 
        </VContent> 
    </div> 
</template> 

<style scoped>
    @import url("https://fonts.googleapis.com/css?family=Jolly%20Lodger");
</style>

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
                    title: 'User', 
                    path: '/user', 
                    icon: 'mdi-human-male' 
                },  
                {
            icon: 'mdi-database',
            title: 'Data Master',
            active: true,
            items: [
                { 
                    title: 'Pegawai', 
                    path: '/pegawai',
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
    return 'https://www.htmlcsscolor.com/preview/gallery/4E5862.png'
    },
},
} 
</script>