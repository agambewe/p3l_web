<template>
<v-container dark>
    <v-container grid-list-md mb-0>
        <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Transaksi Produk</h1>
        <v-layout row wrap style="margin:10px">
            <v-flex xs12>
                <v-text-field v-model="keyword" append-icon="mdi-magnify" label="Cari" single-line hide-details></v-text-field>
            </v-flex>
            <v-dialog v-model="dialog" persistent max-width="300px">
                <v-card>
                    <v-card-title>
                        <span class="headline text-md-center">{{ formTitle }} diskon</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <ValidationObserver ref="observer" v-slot="{ }">
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <ValidationProvider v-slot="{ errors }" name="Diskon" :rules="`required|min_value_diskon:0|max_value_diskon:${form.max_diskon}`">
                                            <v-text-field v-model="form.diskon" type="number" label="Diskon" :error-messages="errors"></v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                </v-row>
                            </ValidationObserver>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue accent-2" text @click="close">Batal</v-btn>
                            <v-btn v-if="typeInput=='Masukkan'" color="green lighten-1" text @click="updateData()">Simpan</v-btn>
                        </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogNota" max-width="1000px">
                <v-card>
                    <v-card-text>
                        <v-container>
                            <Pdf :src="urlNota" ref="printPdf"></Pdf>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue accent-2" text @click="dialogNota = false">Tutup</v-btn>
                            <v-btn color="green lighten-1" text @click="showNota('download')">Download</v-btn>
                            <v-btn color="orange lighten-1" text @click="printNota()">Print</v-btn>
                        </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogEdit" persistent max-width="1000px">
                <v-card>
                    <v-card-title>
                        <span class="headline text-md-center">Ubah</span>
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
                                                no-data-text="Customer ini belum punya hewan"
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
                                        <v-col cols="6" md="4">
                                            <ValidationProvider v-slot="{ errors }" name="Produk" rules="required">
                                                <v-autocomplete
                                                    v-model="row.id_produk"
                                                    :items="produk"
                                                    :error-messages="errors"
                                                    item-value="id"
                                                    item-text="nama"
                                                    label="Produk"
                                                    required
                                                    hide-selected
                                                    clearable
                                                    @change="setSubtotal(index)">
                                                </v-autocomplete>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col cols="6" md="3">
                                            <ValidationProvider v-slot="{ errors }" name="jumlah" :rules="`required|min_value:1|max_value:${row.max}`">
                                                <v-text-field v-model="row.jumlah" :hint="row.max+' produk tersedia'" label="jumlah" type="number" :error-messages="errors" required @change="setSubtotal(index)"></v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col cols="6" md="4">
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
                                    <ul>
                                        <label><strong>Lihat log? </strong></label>
                                        <input type="checkbox" id="checkbox" v-model="checkedLog">
                                    </ul>
                                    <ul v-if="!checkedLog">
                                    </ul>
                                    <ul v-else>
                                        <ul># <strong>Dibuat pada : </strong>{{ this.detail.dibuat }}</ul>
                                        <ul># <strong>Dibuat oleh : </strong>{{ this.detail.dibuatoleh }}</ul>
                                        <ul># <strong>Diubah pada : </strong>{{ this.detail.diubah?this.detail.diubah:'-' }}</ul>
                                        <ul># <strong>Diubah oleh : </strong>{{ this.detail.diubaholeh?this.detail.diubaholeh:'-' }}</ul>
                                    </ul>
                                </tbody>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn class="text-md-right" color="blue accent-2" text @click="clear">Tutup</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
        </v-layout>
        <v-data-table :headers="headers" :items-per-page="5" :items="transaksi" :sort-by="'status_bayar'" :sort-desc="false" :search="keyword" :loading="load" no-data-text="Data kosong" light>
            <template v-slot:body="{ items }">
                <tbody v-if="items.length!=0">
                    <tr v-for="item in items" :key="item.id">
                        <td >
                            <div class="flex">
                                <v-btn icon color="amber accent-3" @click="readDetail(item)">
                                    <v-icon>mdi-arrow-down</v-icon>
                                </v-btn>
                                <v-btn v-if="item.status_bayar==1" icon color="amber darken-3" @click="showNota(item.id_transaksi)">
                                    <v-icon>mdi-receipt</v-icon>
                                </v-btn>
                                <v-btn v-if="item.status_bayar==0" icon color="amber accent-3" @click="editHandler(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn v-if="item.status_bayar==0" icon color="red darken-4" @click="deleteData(item.id)">
                                    <v-icon>mdi-window-close</v-icon>
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
                            <v-btn x-small color="red lighten-2" v-if="item.status_bayar==0" @click="inputDiskon(item)">
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
import Pdf from 'vue-pdf'
import Detail from "./DprodukController";
import { required, min_value, min, max_value } from 'vee-validate/dist/rules'
    import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
    setInteractionMode('eager')

    extend('required', {
        ...required,
        message: '{_field_} tidak boleh kosong.',
    })
    extend('min_value', {
        ...min_value,
        message: '{_field_} tidak boleh nol atau minus.',
    })
    extend('min_value_diskon', {
        ...min_value,
        message: '{_field_} tidak boleh minus.',
    })
    extend('max_value_diskon', {
        ...max_value,
        message: '{_field_} tidak boleh melebih total harga.',
    })
    extend('max_value', {
        ...max_value,
        message: '{_field_} produk melebihi stok.',
    })

export default {
    components: {
        Pdf,
        Detail,
        ValidationProvider,
        ValidationObserver,
    },
    data() {
        return {
            load: false,
            dialog: false,
            dialogEdit: false,
            dialogDetail: false,
            dialogNota: false,
            checked: false,
            checkedLog: false,
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
            rows: [
                {
                    'max_diskon': '10000',
                    'max': '5',
                    'id_transaksi': '',
                    'id_hewan': '',
                    'id_produk': '',
                    'jumlah': '',
                    'subtotal': ''
                }
            ],
            detail: {
                    diubah: '',
                    diubaholeh: '',
                    dibuat: '',
                    dibuatoleh: '',
                },
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
                        'id_produk': '',
                        'subtotal': ''
                    }
                ],
            },
            form: {
                    id: '',
                    diskon: '',
                    max_diskon: ''
                },
            urlNota: '',
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
        cekNotif() {
            var Window
            // window.open(this.$apiUrl + '/produk-notif/','_blank');
            var url = this.$apiUrl + '/produk-notif/'
                var Window = window.open( 
                url, "_blank");
        },
        addRow: function() {
            this.rows.push(
                {
                    'max': '5',
                    'id_transaksi': '',
                    'id_hewan': '',
                    'id_produk': '',
                    'jumlah': '',
                    'subtotal': ''
                }
            );
        },
        deleteRow: function(index) {
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
        },
        deleteRowApi(r) {
            this.user.append('index', r);

            var uri = this.$apiUrl + '/detail-transaksi-produk/transaksi/'+this.editDetil.id_transaksi;
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
            this.dialog = false,
            this.dialogEdit = false,
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

            this.detail.dibuat = item.created_at
            this.detail.dibuatoleh = item.created_by
            this.detail.diubah = item.updated_at
            this.detail.diubaholeh = item.updated_by
        },
        showNota(id){
            if(id=='download'){
                window.open(this.$apiUrl + '/nota/produk/download/'+this.editDetil.id_transaksi, "_blank");
            }else{
                this.editDetil.id_transaksi = id
                this.urlNota = this.$apiUrl + '/nota/produk/lihat/'+id
            }
            this.dialogNota = true;
        },
        printNota(){
            this.$refs.printPdf.print()
        },
        showDiskon(id){
            this.dialog=true;
            this.typeInput = 'Lihat';
            this.form.diskon = id;
        },
        inputDiskon(item){
            var uri = this.$apiUrl + '/detail-transaksi-produk/transaksi/'+item.id_transaksi
                this.$http.get(uri).then(response => {
                    var det = response.data
                    if(!!det[0].hewan){
                        this.dialog=true;
                        this.form.max_diskon = item.total_harga;
                    }else{
                        this.user.append('kasir', this.getUsername());

                        var uri = this.$apiUrl + '/bayar-produk/bayar-produk/' + item.id;
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
                })
            this.form.id = item.id;
        },

        editHandler(item) {
            this.dialogEdit = true;
            var uri = this.$apiUrl + '/detail-transaksi-produk/transaksi/'+item.id_transaksi
                this.$http.get(uri).then(response => {
                    var det = response.data
                    this.editDetil.id_transaksi = det[0].id_transaksi
                    if(!!det[0].hewan){
                        this.checked = true;
                        this.formDetail.id_hewan = det[0].hewan.id
                        this.formDetail.customer = det[0].hewan.id_customer
                    }

                    for (var i = 0; i < det.length; i++) {
                        this.rows[i].id_produk = det[i].id_produk
                        this.rows[i].jumlah = det[i].jumlah
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
                this.user.append('id_produk[]', this.rows[i].id_produk);
                this.user.append('jumlah[]', this.rows[i].jumlah);
                this.user.append('subtotal[]', this.rows[i].subtotal); 
                this.user.append('updated_by', this.getUsername());    
            }

            var uri = this.$apiUrl + '/detail-transaksi-produk/' + this.editDetil.id_transaksi;
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
        async updateData() {
            const isValid = await this.$refs.observer.validate();
            if(isValid){
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
                    this.cekNotif();
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
            }
        },
        restoreList(){
            var uri = this.$apiUrl + '/detail-transaksi-produk/restore/'+this.editDetil.id_transaksi;
                this.$http.get(uri).then(response => {
                })
            this.close()
        },
        deleteData(deleteId) {
            //mengahapus data 
            var uri = this.$apiUrl + '/order-produk/' + deleteId;
            
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
                this.updateDetail()
            }
        },
        resetForm() {
            this.changeId('-')
            this.checkedLog = false,
            this.dialogDetail = false,
            this.formDetail= {
                customer: '',
                id_hewan: '',
            }
            this.user.delete('id_produk[]')
            this.user.delete('jumlah[]')
            this.user.delete('subtotal[]')
            this.user.delete('index')
            this.rows.length = 0
            this.rows= [
                {
                    'max': '5',
                    'id_transaksi': '',
                    'id_hewan': '',
                    'id_produk': '',
                    'jumlah': '',
                    'subtotal': ''
                }
            ],
            this.customers = []
            this.hewanSiapa = []
            this.produk = []
            this.form= {
                id: '',
                diskon: '',
                max_diskon:''
            }
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
            var uri = this.$apiUrl + '/produk/'+this.rows[index].id_produk
            this.$http.get(uri).then(response => {
                if(this.rows[index].jumlah==""){
                    this.rows[index].jumlah = 1
                }else if(this.rows[index].jumlah==undefined){
                    this.rows[index].jumlah = 1
                }
                if(response.data.harga){
                    this.rows[index].subtotal = this.rows[index].jumlah*response.data.harga
                    this.rows[index].max = response.data.stok
                }
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
        'formDetail.customer': function () {
            var uri = this.$apiUrl + '/hewan/nya/'+this.formDetail.customer;
                this.$http.get(uri).then(response => {
                    this.hewanSiapa = response.data
                    // console.log(response.data)
                })
        },
    },
    mounted() {
        this.initData()
    },
}
</script>
