<template>
    <v-container dark>
        <v-container grid-list-md mb-0>
            <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Data Hewan</h1>
            <v-layout row wrap style="margin:10px">
                <v-dialog v-model="dialog" persistent max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-flex class="flex" xs8 style="float:right;widht:300">
                            <v-btn class="mx-2" fab color="blue lighten-1" v-on="on" @click="clear()">
                                <v-icon dark>mdi-plus</v-icon>
                            </v-btn>
                            <v-btn small class="mx-2" fab color="deep-orange darken-3" v-on="on" router to="/hewan/terhapus">
                                <v-icon dark>mdi-redo</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-divider class="mx-1" inset vertical></v-divider>
                        <v-flex xs4 >
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
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field v-model="form.nama" label="Nama"></v-text-field>
                                    </v-col>
                                    <v-col cols="6" sm="6" md="6">
                                        <v-autocomplete
                                            v-model="form.id_jenis"
                                            :items="jenisHewan"
                                            item-value="id"
                                            item-text="nama"
                                            label="Jenis Hewan"
                                            required
                                            hide-selected
                                            clearable>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="6" sm="6" md="6">
                                        <v-autocomplete
                                            v-model="form.id_customer"
                                            :items="customer"
                                            item-value="id"
                                            item-text="nama"
                                            label="Nama Pemilik"
                                            required
                                            hide-selected
                                            clearable>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-menu
                                            v-model="menu2"
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            offset-y
                                            max-width="290px"
                                            min-width="290px"
                                        >
                                            <template v-slot:activator="{ on }">
                                            <v-text-field
                                                v-model="computedDateFormatted"
                                                label="Tanggal Lahir"
                                                hint="YYYY/MM/DD"
                                                persistent-hint
                                                readonly
                                                v-on="on"
                                            ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="date" no-title @input="menu2 = false"></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue accent-2" text @click="close">Batal</v-btn>
                            <v-btn color="green lighten-1" text @click="setForm()">Simpan</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDetail" max-width="528px">
                    <v-card>
                        <v-card-title>
                            <span class="headline text-md-center">Detail Data {{ this.detail.nama }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <tbody>
                                    <ul>
                                        <ul># <strong>Dibuat pada : </strong>{{ this.detail.dibuat }}</ul>
                                        <ul># <strong>Dibuat oleh : </strong>{{ this.detail.dibuatoleh }}</ul>
                                        <ul># <strong>Diubah pada : </strong>{{ this.detail.diubah }}</ul>
                                        <ul># <strong>Diubah oleh : </strong>{{ this.detail.diubaholeh }}</ul>
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
            <v-data-table :headers="headers" :items-per-page="5" :items="hewan" :sort-by="'updated_at'" :sort-desc="true" :search="keyword" :loading="load" no-data-text="Data kosong" light>
                <template v-slot:body="{ items }">
                    <tbody v-if="items.length!=0">
                        <tr v-for="item in items" :key="item.id">
                            <td >
                                <div class="text-center">
                                    <v-btn icon color="blue lighten-2" @click="readDetail(item)">
                                        <v-icon>mdi-arrow-down</v-icon>
                                    </v-btn>    
                                    <v-btn v-if="role!='OWNER'" icon color="amber accent-3" @click="editHandler(item)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn v-if="role!='OWNER'" icon color="red accent-2" @click="setDeletedBy(item.id)">
                                        <v-icon>mdi-delete-empty</v-icon>
                                    </v-btn>
                                </div>
                            </td>
                            <td>{{ item.nama }}</td>
                            <td>
                                <v-autocomplete
                                    v-model="item.id_jenis"
                                    :items="jenisHewan"
                                    item-value="id"
                                    item-text="nama"
                                    readonly>
                                </v-autocomplete>
                            </td>
                            <td>
                                <v-autocomplete
                                    v-model="item.id_customer" 
                                    :items="customer"
                                    item-value="id"
                                    item-text="nama"
                                    readonly>
                                </v-autocomplete>
                            </td>
                            <td>{{ item.tanggal_lahir }}</td>
                            <!-- <td>{{ item.created_by}}</td>
                            <td v-if="item.updated_by==NULL">
                                -
                            </td>
                            <td v-else>
                                {{ item.updated_by }}
                            </td> -->
                            <!-- <td>{{ item.created_at}}</td>
                            <td>{{ item.updated_at }}</td> -->
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <td :colspan="headers.length" class="text-center">Data tidak ditemukan/ masih kosong.</td>
                    </tbody>
                </template>
            </v-data-table>
        </v-container>
    </v-container>
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Share+Tech+Mono");

    table th + th { border-left:1px solid #dddddd; }
    table td + td { border-left:1px solid #dddddd; }
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

    .v-select__selections {
        max-width: 50px;
        border: none;
    }

    .flex {
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
    }
</style>

<script>
    export default {
        data() {
            return {
                load: false,
                dialog: false,
                dialogDetail: false,
                typeInput: 'Tambah',
                role: '',
                keyword: '',
                headers: [
                    {
                        text: 'Aksi',
                        value: null,
                        sortable: false,
                        align: 'center',
                        width: 150
                    },
                    {
                        text: 'Nama',
                        value: 'nama'
                    },
                    {
                        text: 'Jenis',
                        value: 'id_jenis'
                    },
                    {
                        text: 'Pemilik',
                        value: 'id_customer'
                    },
                    {
                        text: 'Tanggal Lahir',
                        value: 'tanggal_lahir'
                    },
                    // {
                    //     text: 'Dibuat oleh',
                    //     value: 'created_by'
                    // },
                    // {
                    //     text: 'Diubah oleh',
                    //     value: 'updated_by'
                    // },
                    // {
                    //     text: 'Dibuat pada',
                    //     value: 'created_at'
                    // },
                    // {
                    //     text: 'Diubah pada',
                    //     value: 'updated_at'
                    // }
                ],
                hewan: [],
                jenisHewan: [],
                customer: [],
                form: {
                    id_jenis: '',
                    id_customer: '',
                    nama: '',
                    tanggal_lahir: '',
                    created_by: '',
                    updated_by: '',
                    delete_by: '',
                },
                detail: {
                    nama: '',
                    diubah: '',
                    diubaholeh: '',
                    dibuat: '',
                    dibuatoleh: '',
                },
                updatedId: '',
                errors: '',
                user: new FormData,
                date: new Date().toISOString().substr(0, 10),
                dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
                menu2: false,
            }
        },
        computed: {
            formTitle() {
                return this.typeInput
            },
            computedDateFormatted () {
                if(this.typeInput === 'Tambah'){
                    this.form.tanggal_lahir = this.formatDate(this.date)
                    return this.form.tanggal_lahir
                }else{
                    return this.form.tanggal_lahir
                }
            },
        },
        watch: {
            date (val) {
                this.dateFormatted = this.formatDate(this.date)
            },
        },
        methods: {
            close() {
                this.dialog = false
                this.typeInput = 'Tambah';
            },
            clear() {
                this.resetForm();
            },
            readDetail(item) {
                this.dialogDetail = true
                this.detail.nama = item.nama
                this.detail.dibuat = item.created_at
                this.detail.dibuatoleh = item.created_by
                this.detail.diubah = item.updated_at
                this.detail.diubaholeh = item.updated_by
            },
            readDataJenisHewan() {
                var uri = this.$apiUrl + '/jenis-hewan/'
                this.$http.get(uri).then(response => {
                    this.jenisHewan = response.data
                })
            },
            readDataCustomer() {
                var uri = this.$apiUrl + '/customer/'
                this.$http.get(uri).then(response => {
                    this.customer = response.data
                })
            },
            readData() {
                var uri = this.$apiUrl + '/hewan/'
                this.$http.get(uri).then(response => {
                    this.hewan = response.data
                })
            },
            createData() {
                this.user.append('id_jenis', this.form.id_jenis);
                this.user.append('id_customer', this.form.id_customer);
                this.user.append('nama', this.form.nama);
                this.user.append('tanggal_lahir', this.form.tanggal_lahir);
                this.user.append('created_by', localStorage.getItem('username'));
                console.log(this.form)

                var uri = this.$apiUrl + '/hewan/'
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
            editHandler(item) {
                console.log(this.typeInput);
                this.typeInput = 'Ubah';
                this.dialog = true;
                this.form.id_jenis = item.id_jenis;
                this.form.id_customer = item.id_customer;
                this.form.nama = item.nama;
                this.form.tanggal_lahir = item.tanggal_lahir;
                this.form.updated_by = localStorage.getItem('username');
                this.updatedId = item.id;
                console.log(this.typeInput);
            },
            updateData() {
                this.user.append('id_jenis', this.form.id_jenis);
                this.user.append('id_customer', this.form.id_customer);
                this.user.append('nama', this.form.nama);
                this.user.append('tanggal_lahir', this.form.tanggal_lahir);
                this.user.append('updated_by', this.form.updated_by);
                console.log(this.form);

                var uri = this.$apiUrl + '/hewan/' + this.updatedId;
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

            setDeletedBy(deleteId) {
                this.user.append('deleted_by', localStorage.getItem('username'));
                console.log(this.form);

                var uri = this.$apiUrl + '/hewan/by/' + deleteId;
                this.$swal({
                    title: 'Apa anda yakin??',
                    text: 'Setelah dihapus, Anda tidak akan dapat memulihkan data ini!',
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
                        this.load = true
                        this.$http.post(uri, this.user).then(response => {
                            this.$swal({
                            title: response.data.message,
                            icon: 'success',
                            timer: 1500})
                            this.load = false;
                            this.close();
                            this.readData(); //refresh data ini 
                            this.resetForm();
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

            // deleteData(deleteId) {
            //     //mengahapus data 
            //     var uri = this.$apiUrl + '/hewan/' + deleteId;
            //     //data dihapus berdasarkan id 
            //     this.$swal({
            //         title: 'Apa anda yakin??',
            //         text: 'Setelah dihapus, Anda tidak akan dapat memulihkan data ini!',
            //         icon: 'warning',
            //         cancelButtonColor: '#FF5252',
            //         confirmButtonColor: '#BDBDBD',
            //         cancelButtonText: 'Oke!',
            //         confirmButtonText: 'Batal',
            //         showCancelButton: true,
            //         allowEscapeKey: false,
            //         // reverseButtons: true,
            //         allowOutsideClick: false,
            //         dangerMode: true,
            //     }).then((result) => {
            //         if (!result.value) {
            //             this.$http.delete(uri).then(response => {
            //                 this.$swal({
            //                 title: response.data.message,
            //                 icon: 'success'})
            //                 this.setDeletedBy(deleteId);
            //                 this.readData();
            //             }).catch(error => {
            //             this.errors = error
            //             this.$swal({
            //                 title: 'Gagal menghapus data!',
            //                 text: 'Coba lagi ..',
            //                 icon: 'error',
            //                 });
            //             })
            //         }
            //     })
            // },
            setForm() {
                if (this.typeInput === 'Tambah') {
                    this.createData()
                } else {
                    this.updateData()
                }
            },
            resetForm() {
                this.form= {
                    id_jenis: '',
                    id_customer: '',
                    nama: '',
                    tanggal_lahir: '',
                    created_by: '',
                    updated_by: '',
                    delete_by: '',
                }
            },
            formatDate (date) {
                if (!date) return null

                const [year, month, day] = date.split('-')
                return `${year}/${month}/${day}`
            },
            parseDate (date) {
                if (!date) return null

                const [month, day, year] = date.split('/')
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },
            setRole() {
                this.role = localStorage.getItem('role');
            },
        },
        mounted() {
            this.readData();
            this.readDataJenisHewan();
            this.readDataCustomer();
            this.setRole();
        },
    }
</script>