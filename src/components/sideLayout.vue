<template> 
    <div> 
        <v-navigation-drawer
        v-model="drawer"
        :expand-on-hover="expandOnHover"
        :mini-variant="miniVariant"
        color="#4E5862"
        absolute
        dark
        >
        <!-- :src="bg" -->
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
        </v-navigation-drawer>
        <v-dialog v-model="dialog" persistent max-width="528px">
            <v-card>
                <v-card-title>
                    <span class="headline text-md-center">Pegawai Info</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <tbody>
                            <ul>
                                <ul># <strong>Nama : </strong>{{ this.dataPegawai.nama }}</ul>
                                <ul># <strong>Username : </strong>{{ this.dataPegawai.username }}</ul>
                                <ul># <strong>Alamat : </strong>{{ this.dataPegawai.alamat }}</ul>
                                <ul># <strong>Tanggal Lahir : </strong>{{ this.dataPegawai.tanggal_lahir }}</ul>
                                <ul># <strong>Telepon : </strong>{{ this.dataPegawai.telepon }}</ul>
                                <ul># <strong>Role : </strong>{{ this.dataPegawai.role }}</ul>
                            </ul>
                        </tbody>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-btn class="text-md-right" color="blue accent-2" text @click="dialog = false">Tutup</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-app-bar dark app fixed height="75px" color="#4E5862"> 
            <!-- :src="bg" -->
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> 
            <img src="../assets/logo.png" style="height:45px;width:45px"> 
            <v-toolbar-title style="font-family: 'Jolly Lodger';font-size: 45px;" > Couvee Pet Shop </v-toolbar-title>
            <VSpacer /> 
            <v-toolbar-items>
                <v-btn text router @click="dialog = true"><v-icon>mdi-face</v-icon></v-btn>
                <v-btn text router @click="submitLogout()"><v-icon>mdi-power</v-icon></v-btn>
            </v-toolbar-items>
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
import { mapGetters, mapActions, mapMutations } from "vuex";
export default { 
    data () { 
        return { 
            dialog: false,
            drawer: true,
            expandOnHover: true,
            miniVariant: true,
            username: '',
            role: '',
            items: [],
            dataPegawai: [],
        } 
    }, 
    mounted () {
        this.setUsername();
        this.setRole();
        this.cekRole();
        this.readDataPegawai();
        // console.log(this.pegawai());

    },
    methods: {
        readDataPegawai() {
            var uri = this.$apiUrl + '/pegawai/user/' + this.username;
            this.$http.get(uri).then(response => {
                this.dataPegawai = response.data
            })
        },
        setRole() {
            this.role = localStorage.getItem('role');
        },
        setUsername() {
            this.username = localStorage.getItem('username');
        },
        cekRole(){
            var role = this.role;
            if(role == 'OWNER'){
                this.items = this.owner;
            }else if(role == 'CS'){
                this.items = this.cs;
            }else if(role == 'KASIR'){
                this.items = this.kasir;
            }
        },
        submitLogout() {
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            this.username = '';
            this.role = '';
            this.$router.push({
                    name: 'login'
                })
        },
        ...mapActions({
            pegawai: "pegawai/readData",
        }),
    },
    computed: {
    ...mapGetters({
        owner: "side/getOwner",
        cs : "side/getCs",
        kasir : "side/getKasir"
    }),
    // bg () {
    //     return 'https://www.htmlcsscolor.com/preview/gallery/4E5862.png'
    // },
},
} 
</script>