<template>
<v-container dark>
    <v-container grid-list-md mb-0>
        <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Order Restok</h1>
        <v-layout row wrap style="margin:10px">
            <v-dialog v-model="dialog" persistent max-width="1000px">
                <template v-slot:activator="{ on }">
                    <v-flex class="flex" xs8 style="float:right;widht:300">
                        <v-btn class="mx-2" fab color="blue lighten-1" v-on="on" @click="clear">
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
                                        v-model="formDetail.supplier"
                                        :items="suppliers"
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
                                    <v-col cols="6" md="4">
                                        <v-autocomplete
                                            v-model="row.id_produk"
                                            :items="produk"
                                            item-value="id"
                                            item-text="nama"
                                            label="Produk"
                                            required
                                            hide-selected
                                            clearable
                                            @change="setSatuan(index)">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="6" md="4">
                                        <v-text-field v-model="row.satuan" label="Satuan" readonly required></v-text-field>
                                    </v-col>
                                    <v-col cols="6" md="3">
                                        <v-text-field v-model="row.jumlah" label="Jumlah" type="number" required></v-text-field>
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
                        <v-btn color="blue accent-2" text @click="restoreList()">Batal</v-btn>
                        <v-btn color="green lighten-1" text @click="setForm()">Simpan</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDetail" persistent max-width="550px">
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
        <v-data-table :headers="headers" :items-per-page="5" :items="restock" :sort-by="'status_order'" :sort-desc="false" :search="keyword" :loading="load" no-data-text="Data kosong" light>
            <template v-slot:body="{ items }">
                <tbody v-if="items.length!=0">
                    <tr v-for="item in items" :key="item.id">
                        <td >
                            <div class="flex">
                                <v-btn icon color="amber accent-3" @click="readDetail(item)">
                                    <v-icon>mdi-arrow-down</v-icon>
                                </v-btn>
                                <v-btn v-if="item.status_order==0" icon color="amber accent-3" @click="editHandler(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn v-if="item.status_order==0" icon color="red darken-4" @click="deleteData(item.id)">
                                    <v-icon>mdi-window-close</v-icon>
                                </v-btn>
                            </div>
                        </td>
                        <td>
                            <v-btn v-if="item.status_order==0" x-small color="red lighten-2" @click="updateData(item.id)">
                                Dalam proses
                            </v-btn>
                            <v-btn v-else x-small color="green lighten-2">
                                Sudah diterima
                            </v-btn>
                        </td>
                        <td>
                            {{ item.id_po }}
                        </td>
                        <td>
                            {{ item.supplier.nama }}
                        </td>
                        <td>
                            {{ item.tanggal_restock }}
                        </td>
                        <td>
                            {{ item.total_bayar }}
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
import Detail from "./detailController";

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
                    text: 'Aksi',
                    value: null,
                    sortable: false,
                    align: 'center',
                    width: 150
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
                    text: 'Tanggal Restok',
                    value: 'tanggal_restock'
                },
                {
                    text: 'Total Bayar',
                    value: 'total_bayar'
                },
            ],
            restock: [],
            suppliers: [],
            produk: [],
            rows: [
                {
                    'id_po': '',
                    'id_produk': '',
                    'satuan': '',
                    'jumlah': ''
                }
            ],
            formDetail: {
                supplier: '',
                },
            editDetil: {
                'id_po': '',
                'id_supplier': '',
                rows: [
                    {
                    'id_po': '',
                    'id_produk': '',
                    'satuan': '',
                    'jumlah': ''
                }],
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
        ...mapMutations({
            changeId: "restock/changeId",
        }),
        addRow: function() {
            this.rows.push(
                {
                    'id_po': '',
                    'id_produk': '',
                    'satuan': '',
                    'jumlah': ''
                }
            );
        },
        deleteRow: function(index) {
            if (this.typeInput === 'Ubah') {
                this.$swal({
                    title: 'Apa kamu yakin??',
                    text: 'Batalkan detail ini??',
                    icon: 'warning',
                    cancelButtonColor: '#FF5252',
                    confirmButtonColor: '#BDBDBD',
                    cancelButtonText: 'Oke!',
                    confirmButtonText: 'Batal',
                    showCancelButton: true,
                    allowEscapeKey: false,
                    // reverseButtons: true,
                    allowOutsideClick: false,
                    dangerMode: true,
                }).then((result) => {
                    if (!result.value) {
                        this.deleteRowApi(index);
                        this.rows.splice(index, 1);
                    }
                })
            }else this.rows.splice(index, 1);
        },
        deleteRowApi(r) {
            this.user.append('index', r);

            var uri = this.$apiUrl + '/detail-order-restock/po/'+this.editDetil.id_po;
            this.load = true
            this.$http.post(uri, this.user).then(response => {
                this.load = false;
                this.readData(); //refresh data ini
            }).catch(error => {
                this.errors = error
                this.load = false;
            })
        },
        close() {
            this.dialog = false
            this.typeInput = 'Tambah';
            this.clear()
        },
        clear() {
            this.resetForm();
        },
        readDataSupplier() {
            var uri = this.$apiUrl + '/supplier/'
            this.$http.get(uri).then(response => {
                this.suppliers = response.data
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
                this.restock = response.data
            })
        },
        readDetail(item) {
            this.changeId(item.id_po);
            this.dialogDetail = true
        },
        createData() {
            this.user.append('id_supplier', this.formDetail.supplier);

            var uri = this.$apiUrl + '/order-restock/'
            this.load = true
            this.$http.post(uri, this.user).then(response => {
                this.$swal({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                this.createDataDetail(response.data.value);
                this.readData(); //mengambil data user 
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
                this.close();
                this.load = false;
            })
        },
        createDataDetail(id) {
            for (var i = 0; i < this.rows.length; i++) {
                this.user.append('id_po', id);
                this.user.append('id_produk[]', this.rows[i].id_produk);
                this.user.append('jumlah[]', this.rows[i].jumlah);   
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
                    // title: 'Gagal menambah data!',
                    title: this.errors,
                    text: 'Coba lagi ..',
                    showConfirmButton: false,
                    // timer: 1500
                })
                this.load = false;
            })
        },
        editHandler(item) {
            this.typeInput = 'Ubah';
            this.dialog = true;
            var uri = this.$apiUrl + '/detail-order-restock/po/'+item.id_po
                this.$http.get(uri).then(response => {
                    var det = response.data
                    this.editDetil.id_po = det[0].id_po
                    this.formDetail.supplier = det[0].supplier.id

                    for (var i = 0; i < det.length; i++) {
                        this.rows[i].id_produk = det[i].id_produk
                        this.rows[i].satuan = det[i].produk.satuan
                        this.rows[i].jumlah = det[i].jumlah
                        this.addRow()
                    }
                    this.rows.splice(det.length, 2); 
                })
        },
        updateDetail() {
            for (var i = 0; i < this.rows.length; i++) {
                this.user.append('id_supplier', this.formDetail.supplier);
                this.user.append('id_produk[]', this.rows[i].id_produk);
                this.user.append('jumlah[]', this.rows[i].jumlah);   
            }

            var uri = this.$apiUrl + '/detail-order-restock/' + this.editDetil.id_po;
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
                this.readData(); //refresh data ini 
                this.resetForm();
                this.typeInput = 'Tambah';
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
        updateData(id) {
            var uri = this.$apiUrl + '/order-restock/selesai-restock/' + id;
            this.load = true
            this.$swal({
                title: 'Apa kamu yakin??',
                text: 'Apakah restok ini benar benar sudah selesai??',
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
                }
                this.load = false;
            })
        },
        restoreList(){
            var uri = this.$apiUrl + '/detail-order-restock/restore/'+this.editDetil.id_po;
                this.$http.get(uri).then(response => {
                })
            this.close()
        },
        deleteData(deleteId) {
            //mengahapus data 
            var uri = this.$apiUrl + '/order-restock/' + deleteId;
            
            this.$swal({
                title: 'Apa kamu yakin??',
                text: 'Hapus order restok ini!',
                icon: 'warning',
                cancelButtonColor: '#FF5252',
                confirmButtonColor: '#BDBDBD',
                cancelButtonText: 'Oke!',
                confirmButtonText: 'Batal',
                showCancelButton: true,
                allowEscapeKey: false,
                // reverseButtons: true,
                allowOutsideClick: false,
                dangerMode: true,
            }).then((result) => {
                if (!result.value) {
                    this.$http.delete(uri).then(response => {
                        this.$swal({
                        text: response.data.message,
                        icon: 'success',
                        timer: 1500})
                        this.readData();
                    }).catch(error => {
                    this.errors = error
                    this.$swal({
                        title: 'Gagal menghapus data!',
                        text: 'Coba lagi ..',
                        icon: 'error',
                        });
                    })
                }
            })
        },
        setForm() {
            if (this.typeInput === 'Tambah') {
                this.createData()
            } else {
                this.updateDetail()
            }
        },
        resetForm() {
            this.changeId('-')
            this.checked = false,
            this.formDetail= {
                supplier: null,
            }
            this.formDetail.supplier = null
            // this.user.delete('id_hewan[]')
            this.user.delete('id_produk[]')
            this.user.delete('jumlah[]')

            this.rows.length = 0
            // this.rows[0].id_produk= ''
            this.rows= [
                {
                    'id_po': '',
                    'id_produk': '',
                    'satuan': '',
                    'jumlah': ''
                }
            ]
            this.suppliers = []
            this.produk = []
            // console.log(this.formDetail)
            this.initData();
        },
        getRole() {
            return localStorage.getItem('role');
        },
        getUsername() {
            return localStorage.getItem('username');
        },
        setSatuan(index) {
            var uri = this.$apiUrl + '/produk/'+this.rows[index].id_produk
            this.$http.get(uri).then(response => {
                this.rows[index].satuan = response.data.satuan
            })
        },
        initData() {
            this.readData();
            this.readDataSupplier();
            this.readDataProduk();
        }
    },
    watch: {
        // 'formDetail.supplier': function () {
        //     var uri = this.$apiUrl + '/hewan/nya/'+this.formDetail.supplier;
        //         this.$http.get(uri).then(response => {
        //             this.hewanSiapa = response.data
        //             // console.log(response.data)
        //         })
        // },
    },
    mounted() {
        this.initData()
    },
}
</script>
