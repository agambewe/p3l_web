<template>
<v-container dark>
    <v-container grid-list-md mb-0>
        <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Transaksi Layanan</h1>
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
                            <ValidationObserver ref="observer" v-slot="{ }">
                                <div v-if="typeInput === 'Tambah'">
                                    <label >Member ? </label>
                                        <input type="checkbox" id="checkbox" v-model="checked">
                                </div>
                                <v-row v-if="!checked">
                                </v-row>
                                <v-row v-else>
                                    <v-col cols="6" md="12">
                                        <ValidationProvider v-slot="{ errors }" name="Customer" rules="required">
                                            <v-autocomplete
                                                v-model="formDetail.customer"
                                                :items="customers"
                                                :error-messages="errors"
                                                item-value="id"
                                                item-text="nama"
                                                label="Customer"
                                                required
                                                hide-selected
                                                clearable>
                                            </v-autocomplete>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col cols="6" md="12">
                                        <ValidationProvider v-slot="{ errors }" name="Hewan" rules="required">
                                            <v-autocomplete
                                                v-model="formDetail.id_hewan"
                                                :items="hewanSiapa"
                                                :error-messages="errors"
                                                no-data-text="Customer masih kosong/ belum punya hewan"
                                                item-value="id"
                                                item-text="nama"
                                                label="Hewan"
                                                required
                                                hide-selected
                                                clearable>
                                            </v-autocomplete>
                                        </ValidationProvider>
                                    </v-col>
                                </v-row>
                                <div v-for="(row, index) in rows" v-bind:key="index">
                                    <v-row>
                                        <v-col cols="6" md="6">
                                            <ValidationProvider v-slot="{ errors }" name="Layanan" rules="required">
                                                <v-autocomplete
                                                    v-model="row.id_layanan"
                                                    :items="layanan"
                                                    :error-messages="errors"
                                                    item-value="id"
                                                    item-text="nama"
                                                    label="Layanan"
                                                    required
                                                    hide-selected
                                                    clearable
                                                    @change="setSubtotal(index)">
                                                </v-autocomplete>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col cols="6" md="5">
                                            <v-text-field v-model="row.subtotal" label="Harga" readonly required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="1">
                                            <v-btn icon color="amber darken-4" @click="deleteRow(index)">
                                                <v-icon>mdi-window-close</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </div>
                            </ValidationObserver>
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
                                <v-btn icon color="amber accent-3" @click="editHandler(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon color="red darken-4" @click="deleteData(item.id)">
                                    <v-icon>mdi-window-close</v-icon>
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
import { required } from 'vee-validate/dist/rules'
    import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
    setInteractionMode('eager')

    extend('required', {
        ...required,
        message: '{_field_} tidak boleh kosong.',
    })

export default {
    components: {
        Detail,
        ValidationProvider,
        ValidationObserver,
    },
    data() {
        return {
            load: false,
            dialog: false,
            dialogDetail: false,
            checked: false,
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
            hewan: [],
            hewanSiapa: [],
            layanan: [],
            rows: [
                {
                    'id_transaksi': '',
                    'id_layanan': '',
                    'subtotal': ''
                }
            ],
            formDetail: {
                customer: '',
                id_hewan: '',
                },
            editDetil: {
                'id_transaksi': '',
                'id_customer': '',
                'id_hewan': '',
                rows: [
                    {
                        'id_layanan': '',
                        'subtotal': ''
                    }
                ],
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
                    'id_transaksi': '',
                    'id_layanan': '',
                    'subtotal': ''
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

            var uri = this.$apiUrl + '/detail-transaksi-layanan/transaksi/'+this.editDetil.id_transaksi;
            this.load = true
            this.$http.post(uri, this.user).then(response => {
                // this.$swal({
                //     icon: 'success',
                //     title: response.data.message,
                //     showConfirmButton: false,
                //     timer: 1500
                // })
                this.load = false;
                this.readData(); //refresh data ini
            }).catch(error => {
                this.errors = error
                // this.$swal({
                //     icon: 'error',
                //     title: 'Gagal mengubah data!',
                //     text: 'Coba lagi ..',
                //     showConfirmButton: false,
                //     timer: 1500
                // })
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
            this.user.append('cs', this.getUsername());

            var uri = this.$apiUrl + '/order-layanan/'
            this.load = true
            this.$http.post(uri, this.user).then(response => {
                this.$swal({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                this.createDataDetail(response.data.value);
                // this.close();
                this.readData(); //mengambil data user 
                // this.resetForm();
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
                this.user.append('id_transaksi', id);
                // this.user.append('id_hewan[]', this.rows[i].id_hewan);
                if (this.checked){
                    this.user.append('id_hewan', this.formDetail.id_hewan);
                }
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
        editHandler(item) {
            this.typeInput = 'Ubah';
            this.dialog = true;
            var uri = this.$apiUrl + '/detail-transaksi-layanan/transaksi/'+item.id_transaksi
                this.$http.get(uri).then(response => {
                    var det = response.data
                    this.editDetil.id_transaksi = det[0].id_transaksi
                    if(!!det[0].hewan){
                        this.checked = true;
                        this.formDetail.id_hewan = det[0].hewan.id
                        this.formDetail.customer = det[0].hewan.id_customer
                    }

                    for (var i = 0; i < det.length; i++) {
                        this.rows[i].id_layanan = det[i].id_layanan
                        this.rows[i].subtotal = det[i].subtotal
                        this.addRow()
                    }
                    this.rows.splice(det.length, 2); 
                })
        },
        updateDetail() {
            for (var i = 0; i < this.rows.length; i++) {
                if (this.checked){
                    this.user.append('id_hewan', this.formDetail.id_hewan);
                }
                this.user.append('id_layanan[]', this.rows[i].id_layanan);
                this.user.append('subtotal[]', this.rows[i].subtotal);   
            }

            var uri = this.$apiUrl + '/detail-transaksi-layanan/' + this.editDetil.id_transaksi;
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
            var uri = this.$apiUrl + '/order-layanan/selesai-layanan/' + id;
            this.load = true
            this.$swal({
                title: 'Apa kamu yakin??',
                text: 'Apakah layanan ini benar benar sudah selesai??',
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
            var uri = this.$apiUrl + '/detail-transaksi-layanan/restore/'+this.editDetil.id_transaksi;
                this.$http.get(uri).then(response => {
                })
            this.close()
        },
        deleteData(deleteId) {
            //mengahapus data 
            var uri = this.$apiUrl + '/order-layanan/' + deleteId;
            
            this.$swal({
                title: 'Apa kamu yakin??',
                text: 'Hapus transaksi ini!',
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
        async setForm() {
            const isValid = await this.$refs.observer.validate();
            if(isValid){
                if (this.typeInput === 'Tambah') {
                    this.createData()
                } else {
                    this.updateDetail()
                }
            }
        },
        resetForm() {
            this.changeId('-')
            this.checked = false,
            this.formDetail= {
                customer: null,
                id_hewan: null,
            }
            this.formDetail.customer = null
            this.formDetail.id_hewan = null
            // this.user.delete('id_hewan[]')
            this.user.delete('id_layanan[]')
            this.user.delete('subtotal[]')

            this.rows.length = 0
            // this.rows[0].id_layanan= ''
            this.rows= [
                {
                    'id_transaksi': '',
                    'id_layanan': '',
                    'subtotal': ''
                }
            ]
            this.customers = []
            this.hewanSiapa = []
            this.layanan = []
            // console.log(this.formDetail)
            this.initData();
            if(this.checked){
                this.$refs.observer.reset()
            }
        },
        getRole() {
            return localStorage.getItem('role');
        },
        getUsername() {
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
        'formDetail.customer': function () {
            var uri = this.$apiUrl + '/hewan/nya/'+this.formDetail.customer;
                this.$http.get(uri).then(response => {
                    this.hewanSiapa = response.data
                    // console.log(response.data)
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
