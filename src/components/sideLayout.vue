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
                    <v-list-item-title class="title"> Kouvee </v-list-item-title> 
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
            <img src="../assets/logo.png" style="opacity:0.6;height:65px;width:90px"> 
            <v-toolbar-title style="font-family: 'Jolly Lodger';font-size: 45px;" > Kouvee Pet Shop </v-toolbar-title>
            <VSpacer /> 
            <v-toolbar-items>
                    <!-- <v-menu
                    v-slot:activator="{ on }"
                    offset-y
                    origin="center center"
                    class="elelvation-1"
                    :nudge-bottom="14"
                    transition="scale-transition"
                    >
                    <v-btn icon v-on="on" 
                    @click="notifFetch()">
                        <v-badge color="red" overlap>
                            <span slot="badge">{{unreadNotifications.length}}</span>
                        <v-icon medium>mdi-bell-ring-outline</v-icon>
                        </v-badge>
                    </v-btn>

                    <v-list>
                        <v-list-tile :class="{'green': notification.read_at==null}" v-for="notification in allNotifications" :key="notification.id">
                        <v-list-tile-content>
                            <v-list-tile-title>{{notification.data.createdUser.name}} has just registered on {{notification.created_at}}</v-list-tile-title>
                        </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    </v-menu> -->
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
import firebase from 'firebase'
import manifest from "../../public/manifest.json";
export default { 
    data () { 
        return { 
            manifest: manifest,
            dialog: false,
            drawer: true,
            expandOnHover: true,
            miniVariant: true,
            username: '',
            role: '',
            items: [],
            dataPegawai: [],
            allNotifications: [],
            unreadNotifications: [],
        } 
    }, 
    created() {
    },
    mounted () {
        this.setUsername();
        this.setRole();
        this.cekRole();
        this.readDataPegawai();
        this.notifPermission();
        this.notifFetch();
        // console.log(this.pegawai());

    },
    methods: {
        notifFetch(){
            // messaging.onMessage((payload) => {
            //     console.log('Message received. ', payload);
            // // ...
            // });
        },
        notifPermission(){
            if(this.role=== "OWNER"){
                Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                    // TODO(developer): Retrieve an Instance ID token for use with FCM.
                    // ...
                    if(this.isTokenSentToServer()){
                        console.log("Token already save on server");
                    }else{
                        this.getToken();
                    }
                } else {
                    console.log('Unable to get permission to notify.');
                }
                });
            }
        },
        saveToken(currentToken) {
            var uri = this.$apiUrl + '/produk-token/' + currentToken
            this.$http.get(uri).then(response => {
            })
        },
        setTokenSentToServer(sent) {
	        localStorage.setItem('sentToServer', sent ? 1 : 0);
        },
        isTokenSentToServer() {
            return localStorage.getItem('sentToServer') == 1;
        },
        getToken(){
            const messaging = firebase.messaging();
                    // console.log(messaging.getToken())
            // Get Instance ID token. Initially this makes a network call, once retrieved
            // subsequent calls to getToken will return from cache.
            messaging.usePublicVapidKey("BJkk2-iNdhp-oABmlwo0C9i07hQVmS07_z78SzNYn29J5g1_00KljLAa6JTSX0eh-HL2JyWF4GeoNgn44gs52_A");
            messaging.getToken().then((currentToken) => {
                if (currentToken) {
                    this.saveToken(currentToken);
                    console.log(currentToken)
                    this.setTokenSentToServer(true);
                } else {
                    console.log('No Instance ID token available. Request permission to generate one.');
                    this.setTokenSentToServer(false);
                }
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                    setTokenSentToServer(false);
                });
            },
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