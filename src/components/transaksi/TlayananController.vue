<template>
<v-container dark>
    <v-container grid-list-md mb-0>
        <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Transaksi Layanan</h1>
        <v-layout row wrap style="margin:10px">
            <v-dialog v-model="dialog" persistent max-width="1000px">
                <template v-slot:activator="{ on }">
                    <v-flex class="flex" xs8 style="float:right;widht:300">
                        <v-btn class="mx-2" fab color="blue lighten-1" v-on="on" @click="clear()">
                            <v-icon dark>mdi-plus</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-divider class="mx-1" inset vertical></v-divider>
                    <v-flex xs4>
                        <v-text-field v-model="keyword" append-icon="mdi-magnify" label="Cari" single-line hide-details></v-text-field>
                    </v-flex>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="6" md="12">
                                    <v-autocomplete
                                        v-model="customer"
                                        :items="customers"
                                        item-value="id"
                                        item-text="nama"
                                        label="Customer"
                                        required
                                        hide-selected
                                        clearable>
                                    </v-autocomplete>
                                </v-col>
                            </v-row>
                            <div v-for="(row, index) in rows" v-bind:key="index">
                                <v-row>
                                    <v-col cols="6" md="4">
                                        <v-autocomplete
                                            v-model="row.id_hewan"
                                            :items="hewanSiapa"
                                            item-value="id"
                                            item-text="nama"
                                            label="Hewan"
                                            required
                                            hide-selected
                                            clearable>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="6" md="4">
                                        <v-autocomplete
                                            v-model="row.id_layanan"
                                            :items="layanan"
                                            item-value="id"
                                            item-text="nama"
                                            label="Layanan"
                                            required
                                            hide-selected
                                            clearable
                                            @change="setSubtotal(index)">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="6" md="3">
                                        <v-text-field v-model="row.subtotal" label="Jumlah" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="1">
                                        <v-btn icon color="amber darken-4" @click="deleteRow(index)">
                                            <v-icon>mdi-window-close</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </div>    
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="indigo darken-2" text @click="addRow">Tambah form</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="blue accent-2" text @click="close">Batal</v-btn>
                        <v-btn color="green lighten-1" text @click="createData()">Simpan</v-btn>
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
                            <v-btn x-small color="red lighten-2" @click="updateData(item.id)">
                                Layanan Selesai
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
        <!-- <Detail></Detail> -->
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
import Detail from "./DlayananController";

export default {
    components: {
        Detail
    },
    data() {
        return {
            load: false,
            dialog: false,
            dialogDetail: false,
            typeInput: 'Tambah',
            keyword: '',
            headers: [{
                    text: 'Detail',
                    value: null,
                    sortable: false
                },
                {
                    text: 'ID transaksi layanan',
                    value: 'id_transaksi'
                },
                {
                    text: 'Status layanan',
                    value: 'status_layanan'
                },
            ],
            transaksi: [],
            customers: [],
            customer: '',
            hewan: [],
            hewanSiapa: [],
            layanan: [],
            rows: [
                {
                    'id_transaksi_layanan': '',
                    'id_hewan': '',
                    'id_layanan': '',
                    'subtotal': ''
                }
            ],
            formDetail: {
                cs: '',
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
        addRow: function() {
            this.rows.push(
                {
                    'id_transaksi_layanan': '',
                    'id_hewan': '',
                    'id_layanan': '',
                    'subtotal': ''
                }
            );
        },
        deleteRow: function(index) {
            this.rows.splice(index, 1);
        },
        close() {
            this.dialog = false
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
        readDataLayanan() {
            var uri = this.$apiUrl + '/layanan/'
            this.$http.get(uri).then(response => {
                this.layanan = response.data
            })
        },
        readData() {
            var uri = this.$apiUrl + '/order-layanan/'
            this.$http.get(uri).then(response => {
                this.transaksi = response.data
            })
        },
        readDetail(item) {
            this.changeId(item.id_transaksi);
            this.dialogDetail = true
        },
        createData() {
            // this.formDetail.id_transaksi = this.lastIdPo;
            // this.user.append('id_transaksi', this.formDetail.id_transaksi);
            this.user.append('cs', this.setUsername());
            // this.user.append('tanggal_transaksi', this.getTanggalSekarang());

            var uri = this.$apiUrl + '/order-layanan/'
            this.load = true
            this.$http.post(uri, this.user).then(response => {
                this.$swal({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                // this.formDetail.id_order_restock = response.data.id
                this.createDataDetail(response.data.id);
                // this.load = false;
                this.close();
                this.readData(); //mengambil data user 
                this.resetForm();
            }).catch(error => {
                this.errors = error
                this.$swal({
                    icon: 'error',
                    // title: 'Gagal menambah data!',
                    title: this.errors,
                    text: 'Coba lagi ..',
                    showConfirmButton: false,
                    // timer: 1500
                })
                this.load = false;
            })
        },
        createDataDetail(id) {
            for (var i = 0; i < this.rows.length; i++) {
                this.user.append('id_transaksi', id);
                this.user.append('id_hewan[]', this.rows[i].id_hewan);
                this.user.append('id_layanan[]', this.rows[i].id_layanan);
                this.user.append('subtotal[]', this.rows[i].subtotal);                
            }
            var uri = this.$apiUrl + '/detail-transaksi-layanan/'
            this.load = true
            this.$http.post(uri, this.user).then(response => {
                this.$swal({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                this.load = false;
                this.close();
                this.readData(); //mengambil data user 
                this.resetForm();
            }).catch(error => {
                this.errors = error
                this.$swal({
                    icon: 'error',
                    // title: 'Gagal menambah data!',
                    title: this.errors,
                    text: 'Coba lagi ..',
                    showConfirmButton: false,
                    // timer: 1500
                })
                this.load = false;
            })
        },
        updateData(id) {
            var uri = this.$apiUrl + '/order-restock/' + id;
            this.load = true
            this.$http.post(uri).then(response => {
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
        },
        resetForm() {
            this.changeId('-')
            this.customer= ''
            this.formDetail= {
                cs: ''
            }
            this.layanan.length = 0
            this.hewanSiapa.length = 0
            this.customers.length = 0
            this.rows.length = 0
            this.rows= [
                {
                    'id_transaksi_layanan': '',
                    'id_hewan': '',
                    'id_layanan': '',
                    'subtotal': ''
                }
            ]
            this.initData();
        },
        setRole() {
            return localStorage.getItem('role');
        },
        setUsername() {
            return localStorage.getItem('username');
        },
        setSubtotal(index) {
            var uri = this.$apiUrl + '/layanan/'+this.rows[index].id_layanan
            this.$http.get(uri).then(response => {
                this.rows[index].subtotal = response.data.harga
            })
        },
        initData() {
            this.readData();
            this.readDataCustomer();
            this.readDataLayanan();
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
        // transaksi: function () {
        //     this.readData();
        // }
        // rows: function () {
        //     console.log("hapie")
        //     this.rows.subtotal = this.rows.id_layanan;
        //         },
        //     deep: true
    },
    mounted() {
        this.initData()
    },
}
</script>
