<template> 
    <div> 
        <v-app-bar dark app fixed height="75px" color="#4E5862"> 
            <!-- :src="bg" -->  
            <img src="../assets/logo.png" style="opacity:0.6;height:65px;width:90px"> 
            <v-toolbar-title style="font-family: 'Jolly Lodger';font-size: 45px;" > Kouvee Pet Shop </v-toolbar-title>
            <VSpacer />
            <v-toolbar-items>
                <v-btn text router to="/customerUI">Informasi Toko</v-btn>
                <v-btn text router to="/customerUIproduk">Daftar Prouk</v-btn>
                <v-btn text router to="/customerUIlayanan">Daftar Layanan</v-btn>
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
            //username: '',
            //role: '',
            items: [],
            //dataPegawai: [],
        } 
    },
    submitLogout() {
            this.$router.push({
                    name: 'CustomerUI'
                })
        }, /*
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
            if(role == 'CUSTOMER'){
                this.items = this.customer;
            }
        },
        ...mapActions({
            pegawai: "pegawai/readData",
        }),
    },*/
    computed: {
    ...mapGetters({
        customer: "sideCustomer/getCustomer",        
    }),
    // bg () {
    //     return 'https://www.htmlcsscolor.com/preview/gallery/4E5862.png'
    // },
},
} 
</script>