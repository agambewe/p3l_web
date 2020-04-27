<template>
<v-container dark>
    <v-container grid-list-md mb-0>
        <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Transaksi Produk</h1>
        <v-layout row wrap style="margin:10px">
            <v-dialog v-model="dialog" persistent max-width="300px">
                <v-card>
                    <v-card-title>
                        <span class="headline text-md-center">{{ formTitle }} diskon</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="form.diskon" label="Diskon"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue accent-2" text @click="close">Batal</v-btn>
                            <v-btn v-if="typeInput=='Masukkan'" color="green lighten-1" text @click="updateData()">Simpan</v-btn>
                        </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDetail" persistent max-width="810px">
                    <v-card>
                        <v-card-text>
                            <v-container>
                                <tbody>
                                    <ul>
                                        <Detail></Detail>
                                    </ul>
                                </tbody>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn class="text-md-right" color="blue accent-2" text @click="dialogDetail = false">Tutup</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
        </v-layout>
        <v-data-table :headers="headers" :items-per-page="5" :items="transaksi" :sort-by="'status_order'" :sort-desc="false" :search="keyword" :loading="load" no-data-text="Data kosong" light>
            <template v-slot:body="{ items }">
                <tbody v-if="items.length!=0">
                    <tr v-for="item in items" :key="item.id">
                        <td >
                            <div class="flex">
                                <v-btn icon color="amber accent-3" @click="readDetail(item)">
                                    <v-icon>mdi-arrow-down</v-icon>
                                </v-btn>
                            </div>
                        </td>
                        <td>
                            {{ item.id_transaksi }}
                        </td>
                        <td>
                            {{ item.total_harga }}
                        </td>
                        <td>
                            <v-btn x-small color="red lighten-2" v-if="item.status_bayar==0" @click="inputDiskon(item.id)">
                                Belum dibayar
                            </v-btn>
                            <v-btn x-small color="green lighten-2" v-else @click="showDiskon(item.diskon)">
                                Sudah dibayar
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <td :colspan="headers.length" class="text-center">Data masih kosong.</td>
                </tbody>
            </template>
        </v-data-table>
        <v-divider></v-divider>
    </v-container>
</v-container>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Share+Tech+Mono");

table th+th {
    border-left: 1px solid #dddddd;
}

table td+td {
    border-left: 1px solid #dddddd;
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
import { mapGetters, mapActions, mapMutations } from "vuex";
import Detail from "./DprodukController";

export default {
    components: {
        Detail
    },
    data() {
        return {
            load: false,
            dialog: false,
            dialogDetail: false,
            typeInput: 'Masukkan',
            keyword: '',
            headers: [{
                    text: 'Aksi',
                    value: null,
                    sortable: false,
                    align: 'center',
                    width: 150
                },
                {
                    text: 'ID transaksi produk',
                    value: 'id_transaksi'
                },
                {
                    text: 'Total harga',
                    value: 'total_harga'
                },
                {
                    text: 'Status bayar',
                    value: 'status_bayar'
                },
            ],
            transaksi: [],
            customers: [],
            customer: '',
            hewan: [],
            hewanSiapa: [],
            produk: [],
            form: {
                    id: '',
                    diskon: '',
                },
            errors: '',
            user: new FormData,
        }
    },
    computed: {
        formTitle() {
            return this.typeInput
        },
    },
    methods: {
        // createData(){
        //     console.log(this.rows[0].id_produk)
        // },
        ...mapMutations({
            changeId: "transaksi/changeId",
        }),
        close() {
            this.dialog = false,
            this.typeInput = 'Masukkan';
            this.clear();
        },
        clear() {
            this.resetForm();
        },
        readDataCustomer() {
            var uri = this.$apiUrl + '/customer/'
            this.$http.get(uri).then(response => {
                this.customers = response.data
            })
        },
        readDataHewan() {
            var uri = this.$apiUrl + '/hewan/'
            this.$http.get(uri).then(response => {
                this.hewan = response.data
            })
        },
        readDataProduk() {
            var uri = this.$apiUrl + '/produk/'
            this.$http.get(uri).then(response => {
                this.produk = response.data
            })
        },
        readData() {
            var uri = this.$apiUrl + '/bayar-produk/'
            this.$http.get(uri).then(response => {
                this.transaksi = response.data
            })
        },
        readDetail(item) {
            this.changeId(item.id_transaksi);
            this.dialogDetail = true
        },
        showDiskon(id){
            this.dialog=true;
            this.typeInput = 'Lihat';
            this.form.diskon = id;
        },
        inputDiskon(id){
            this.dialog=true;
            this.form.id = id;
        },
        updateData() {
            this.load = true
            this.$swal({
                title: 'Apa kamu yakin??',
                text: 'Yakin menyesesaikan pembayaran dengan diskon '+this.form.diskon+' ??',
                icon: 'warning',
                cancelButtonColor: '#FF5252',
                confirmButtonColor: '#BDBDBD',
                cancelButtonText: 'Oke!',
                confirmButtonText: 'Batal',
                showCancelButton: true,
                allowEscapeKey: false,
                allowOutsideClick: false,
                dangerMode: true,
            }).then((result) => {
                if (!result.value) {
                    this.user.append('diskon', this.form.diskon);
                    this.user.append('kasir', this.getUsername());

                    var uri = this.$apiUrl + '/bayar-produk/bayar-produk/' + this.form.id;
                    this.$http.post(uri, this.user).then(response => {
                    this.$swal({
                        icon: 'success',
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.load = false;
                    this.close();
                    this.readData(); //refresh data ini 
                    this.resetForm();
                    }).catch(error => {
                        this.errors = error
                        this.$swal({
                            icon: 'error',
                            title: 'Gagal mengubah data!',
                            text: 'Coba lagi ..',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        this.load = false;
                    })
                }
                this.load = false;
            })
        },
        resetForm() {
            this.changeId('-')
            this.customer= ''
            this.formDetail= {
                cs: ''
            }
            this.form= {
                id: '',
                diskon: ''
            }
            this.initData();
        },
        getRole() {
            return localStorage.getItem('role');
        },
        getUsername() {
            return localStorage.getItem('username');
        },
        setSubtotal(index) {
            var uri = this.$apiUrl + '/produk/'+this.rows[index].id_produk
            this.$http.get(uri).then(response => {
                this.rows[index].subtotal = response.data.harga
            })
        },
        initData() {
            this.readData();
            this.readDataCustomer();
            this.readDataProduk();
            this.readDataHewan();
        }
    },
    watch: {
        customer: function () {
            var uri = this.$apiUrl + '/hewan/nya/'+this.customer;
                this.$http.get(uri).then(response => {
                    this.hewanSiapa = response.data
                })
        },
    },
    mounted() {
        this.initData()
    },
}
</script>
