<template>
<v-container dark>
    <v-container grid-list-md mb-0>
        <center>
            <img src= "../../assets/kopsurat.png" id='kopsurat' >
            <h1>Laporan Pendapatan Tahunan</h1>
        </center>
        <v-layout row wrap style="margin:10px">
        <v-dialog v-model="dialogLaporan" max-width="1000px">
            <v-card>
                <v-card-text>
                    <v-container>
                        <Pdf :src="urlLaporan" ref="printPdf"></Pdf>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue accent-2" text @click="dialogLaporan = false">Tutup</v-btn>
                    <v-btn color="green lighten-1" text @click="showLaporan('download')">Download</v-btn>
                    <v-btn color="orange lighten-1" text @click="printNota()">Print</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        </v-layout>
        <v-layout row wrap style="margin:10px">
            <v-flex xs6>
                <v-col cols="5">
                    <h4 class="text-md-left">Pilih tahun</h4> 
                        <v-select
                        :items="pilihantahun"
                        v-model="form.tahun"
                        >
                    </v-select>  
                </v-col> 
            </v-flex>
        </v-layout>
        <v-layout>
        <v-spacer></v-spacer>
        <v-btn
        color="blue accent-2" text
        @click="showLaporan(form.tahun)"
        > Tampil Laporan Tahunan </v-btn>
        </v-layout>
    </v-container>
</v-container>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Share+Tech+Mono");

table th {
    border-left: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
}

table td {
    border-left: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
}

tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, .05);
}

.v-data-table
    /deep/
    tbody
    /deep/
    tr:hover:not(.v-data-table__expanded__content) {
        background: #8797a8 !important;
    }
    
.flex {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
}

.v-select__selections {
    max-width: 50px;
    border: none;
}

.v-select .dropdown-toggle {
    border: none;
}
</style>

<script>
import { mapGetters, mapActions } from "vuex";
import Pdf from 'vue-pdf'
import printJS from 'print-js'
import { required, min_value } from 'vee-validate/dist/rules'
    import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
    setInteractionMode('eager')

    extend('required', {
        ...required,
        message: '{_field_} tidak boleh kosong.',
    })
    
export default {
    components: {
        Pdf,
        ValidationProvider,
        ValidationObserver,
    },
    data() {
        return {
            pilihantahun:["2008","2014","2019","2020"],
            dialogLaporan: false,
            form: {
                tahun : '',
                bulan : '',
            },
            tahun : '',
            urlLaporan : '',
            errors: '',
            user: new FormData,
        }
    },
    validations: {
        form: {
            tahun: { required },
        },
    },
    methods: {
        showLaporan(tahun){
            if(tahun=='download'){
                window.open(this.$apiUrl + '/laporan/pendapatan-tahun/download/'+this.form.tahun, "_blank");
            }else{
                this.form.tahun = tahun
                this.urlLaporan = this.$apiUrl + '/laporan/pendapatan-tahun/'+tahun
            }
            this.dialogLaporan = true;
        },
        printNota(){
            this.$refs.printPdf.print()
        },
        close() {
            this.dialog = false
            this.typeInput = 'Tambah';
            this.clear()
        },
        clear() {
            this.resetForm();
        },
        getRole() {
            return localStorage.getItem('role');
        },
        getUsername() {
            return localStorage.getItem('username');
        },
        initData() {
        }
    },
    watch: {
        // //KETIKA VALUE BULAN BERUBAH, MAKA KITA REQUEST DATA BARU
        //     month() {
        //         this.getLaporan({
        //             month: this.month,
        //             year: this.year
        //         })
        //     },
        //     //KETIKA VALUE TAHUN BERUBAH, MAKA KITA REQUEST DATA BARU
        //     year() {
        //         this.getLaporan({
        //             month: this.month,
        //             year: this.year
        //         })
        //     }
    },
    mounted() {
        this.initData()
    },
}
</script>