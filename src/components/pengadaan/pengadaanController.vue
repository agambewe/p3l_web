<template>
<v-container dark>
    <v-container grid-list-md mb-0>
        <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Data Pengadaan</h1>
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
                                        v-model="formDetail.id_supplier"
                                        :items="supplier"
                                        item-value="id"
                                        item-text="nama"
                                        label="Supplier"
                                        required
                                        hide-selected
                                        clearable>
                                    </v-autocomplete>
                                </v-col>
                            </v-row>
                            <div v-for="(row, index) in rows" v-bind:key="index">
                                <v-row>
                                    <!-- <v-col hidden cols="12" md="4">
                                        <v-text-field v-model="row.id_po" label="ID PO" required></v-text-field>
                                    </v-col> -->
                                    <v-col cols="6" md="4">
                                        <v-autocomplete
                                            v-model="row.id_produk"
                                            :items="produk"
                                            item-value="id"
                                            item-text="nama"
                                            label="Produk"
                                            required
                                            hide-selected
                                            clearable>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field v-model="row.jumlah" label="Jumlah" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field v-model="row.subtotal" label="Harga" required></v-text-field>
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
        </v-layout>
        <v-data-table :headers="headers" :items-per-page="5" :items="pengadaan" :sort-by="'status_order'" :sort-desc="false" :search="keyword" :loading="load" no-data-text="Data kosong" light>
            <template v-slot:body="{ items }">
                <tbody v-if="items.length!=0">
                    <tr v-for="item in items" :key="item.id">
                        <td>
                            <div class="flex">
                                <v-btn icon color="amber accent-3" @click="readDetail()">
                                    <v-icon>mdi-arrow-down</v-icon>
                                </v-btn>
                            </div>
                        </td>
                        <td>
                            <v-btn x-small color="green lighten-2" v-if="item.status_order == 1">
                                Diterima
                            </v-btn>
                            <v-btn x-small color="red lighten-2" v-else @click="updateData(item.id)">
                                Dalam pengiriman
                            </v-btn>
                        </td>
                        <td>{{ item.id_po }}</td>
                        <td>
                            <v-autocomplete v-model="item.id_supplier" :items="supplier" item-value="id" item-text="nama" readonly>
                            </v-autocomplete>
                        </td>
                        <td>{{ item.tanggal_restock }}</td>
                        <td>{{ item.total_bayar }}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <td :colspan="headers.length" class="text-center">Data masih kosong.</td>
                </tbody>
            </template>
        </v-data-table>
        <v-divider></v-divider>
        <Detail></Detail>
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
import Detail from "./detailController";

export default {
    components: {
        Detail
    },
    data() {
        return {
            load: false,
            dialog: false,
            typeInput: 'Tambah',
            keyword: '',
            headers: [{
                    text: 'Detail',
                    value: null,
                    sortable: false
                },
                {
                    text: 'Status',
                    value: 'status_order'
                },
                {
                    text: 'ID PO',
                    value: 'id'
                },
                {
                    text: 'Supplier',
                    value: 'id_supplier'
                },
                {
                    text: 'Tanggal Restock',
                    value: 'tanggal_restock'
                },
                {
                    text: 'Total Bayar',
                    value: 'total_bayar'
                },
            ],
            pengadaan: [],
            lastIdPo: '',
            supplier: [],
            produk: [],
            rows: [
                {
                    'id_order_restock': '',
                    'id_produk': '',
                    'jumlah': '',
                    'subtotal': ''
                }
            ],
            form: {
                id_supplier: '',
                tanggal_restock: '',
                total_bayar: '',
                status_order: ''
            },
            formDetail: {
                id_supplier: '',
                id_order_restock: '',
                    id_po: ''
                },
            errors: '',
            user: new FormData,
            date: new Date(),
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
        addRow: function() {
            this.rows.push(
                {
                    'id_order_restock': '',
                    'id_produk': '',
                    'jumlah': '',
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
        lastObject() {
            var last = Object.keys(this.supplier)[Object.keys(this.supplier).length-1];
            // console.log(this.supplier);
        },
        getTanggalSekarang() {
            var tanggal = this.date.getMonth()+1;
            var sekarang = this.date.getFullYear()+'-'+tanggal+'-'+this.date.getDate();
            return sekarang;
        },
        readDataSupplier() {
            var uri = this.$apiUrl + '/supplier/'
            this.$http.get(uri).then(response => {
                this.supplier = response.data
            })
        },
        readDataProduk() {
            var uri = this.$apiUrl + '/produk/'
            this.$http.get(uri).then(response => {
                this.produk = response.data
            })
        },
        readData() {
            var uri = this.$apiUrl + '/order-restock/'
            this.$http.get(uri).then(response => {
                this.pengadaan = response.data
                var last = Object.keys(this.pengadaan)[Object.keys(this.pengadaan).length-1];
                last = this.pengadaan[last].id_po
                this.lastIdPo = ++last.split("-")[4];
                this.lastIdPo= 'PO-'+last.split("-")[1]+'-'+last.split("-")[2]+'-'+last.split("-")[3]+'-'+0+this.lastIdPo;
                // console.log(this.lastIdPo)
            })
        },
        readDetail() {},
        createData() {
            this.formDetail.id_po = this.lastIdPo;
            this.user.append('id_po', this.formDetail.id_po);
            this.user.append('id_supplier', this.formDetail.id_supplier);
            this.user.append('tanggal_restock', this.getTanggalSekarang());
            this.user.append('total_bayar', 0);

            var uri = this.$apiUrl + '/order-restock/'
            this.load = true
            this.$http.post(uri, this.user).then(response => {
                this.$swal({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                this.formDetail.id_order_restock = response.data.id
                this.createDataDetail();
                // this.load = false;
                this.close();
                this.readData(); //mengambil data user 
                this.resetForm();
            }).catch(error => {
                this.errors = error
                this.$swal({
                    icon: 'error',
                    title: 'Gagal menambah data!',
                    text: 'Coba lagi ..',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.load = false;
            })
        },
        createDataDetail() {
            for (var i = 0; i < this.rows.length; i++) {
                this.user.append('id_produk[]', this.rows[i].id_produk);
                this.user.append('id_order_restock[]', this.formDetail.id_order_restock);
                this.user.append('jumlah[]', this.rows[i].jumlah);
                this.user.append('subtotal[]', this.rows[i].subtotal);
            }
            var uri = this.$apiUrl + '/detail-order-restock/'
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
                    title: 'Gagal menambah data!',
                    text: 'Coba lagi ..',
                    showConfirmButton: false,
                    timer: 1500
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
            this.form = {
                id_supplier: '',
                tanggal_restock: '',
                total_bayar: '',
                status_order: ''
            }
            this.formDetail= {
                id_supplier: '',
                id_order_restock: '',
                    id_po: '',
                    id_produk: '',
                    jumlah: '',
                    subtotal: ''
            }
            this.rows=[],
            this.rows= [
                {
                    'id_produk': '',
                    'jumlah': '',
                    'subtotal': ''
                }
            ]
        },
    },
    mounted() {
        this.readData();
        this.readDataProduk();
        this.readDataSupplier();
        this.lastObject();
    },
}
</script>
