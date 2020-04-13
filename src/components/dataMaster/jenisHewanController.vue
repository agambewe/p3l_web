<template>
    <v-container dark>
        <v-container grid-list-md mb-0>
            <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Jenis Hewan</h1>
            <v-layout row wrap style="margin:10px">
                <v-dialog v-model="dialog" persistent max-width="300px">
                    <template v-slot:activator="{ on }">
                        <v-flex class="flex" xs8 style="float:right;widht:300">
                            <v-btn class="mx-2" fab color="blue lighten-1" v-on="on" @click="clear()">
                                <v-icon dark>mdi-plus</v-icon>
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
                                <ValidationObserver ref="observer" v-slot="{ }">
                                    <v-form>
                                        <v-row>
                                            <ValidationProvider v-slot="{ errors }" name="Nama Jenis" rules="required">
                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="form.nama" label="Nama Jenis" :error-messages="errors" required></v-text-field>
                                                </v-col>
                                            </ValidationProvider>
                                        </v-row>
                                    </v-form>
                                </ValidationObserver>
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
                                        <ul># <strong>Diubah pada : </strong>{{ this.detail.diubah }}</ul>
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
            <v-data-table :headers="headers" :items-per-page="5" :items="jenisHewan" :sort-by="'updated_at'" :sort-desc="true" :search="keyword" :loading="load" no-data-text="Data kosong" light>
                <template v-slot:body="{ items }">
                    <tbody v-if="items.length!=0">
                        <tr v-for="item in items" :key="item.id">
                            <td >
                                <div class="flex">
                                    <v-btn icon color="blue lighten-2" @click="readDetail(item)">
                                        <v-icon>mdi-arrow-down</v-icon>
                                    </v-btn>    
                                    <v-btn icon color="amber accent-3" @click="editHandler(item)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon color="red accent-2" @click="deleteData(item.id)">
                                        <v-icon>mdi-delete-empty</v-icon>
                                    </v-btn>
                                </div>
                            </td>
                            <td>{{ item.nama }}</td>
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

    .flex {
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
    }
</style>

<script>
    import { required, max } from 'vee-validate/dist/rules'
    import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
    setInteractionMode('eager')

    extend('required', {
        ...required,
        message: '{_field_} tidak boleh kosong.',
    })
    export default {
        components: {
            ValidationProvider,
            ValidationObserver,
        },
        data() {
            return {
                load: false,
                dialog: false,
                dialogDetail: false,
                typeInput: 'Tambah',
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
                    // {
                    //     text: 'Dibuat pada',
                    //     value: 'created_at'
                    // },
                    // {
                    //     text: 'Diubah pada',
                    //     value: 'updated_at'
                    // },
                ],
                jenisHewan: [],
                form: {
                    nama: '',
                },
                detail: {
                    nama: '',
                    diubah: '',
                    dibuat: '',
                },
                updatedId: '',
                errors: '',
                jenis: new FormData,
            }
        },
        computed: {
            formTitle() {
                return this.typeInput
            },
        },
        methods: {
            validate () {
                this.$refs.form.validate()
            },
            close() {
                this.dialog = false
                this.typeInput = 'Tambah';
                this.resetForm();
            },
            clear() {
                this.resetForm();
            },
            readDetail(item) {
                this.dialogDetail = true
                this.detail.nama = item.nama
                this.detail.dibuat = item.created_at
                this.detail.diubah = item.updated_at
            },
            readData() {
                var set_token = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
                var uri = this.$apiUrl + '/jenis-hewan/'
                this.$http.get(uri, set_token).then(response => {
                    this.jenisHewan = response.data
                })
            },
            createData() {
                this.jenis.append('nama', this.form.nama);

                var uri = this.$apiUrl + '/jenis-hewan/'
                this.load = true
                this.$http.post(uri, this.jenis).then(response => {
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
                this.form.nama = item.nama;
                this.updatedId = item.id;
                console.log(this.typeInput);
            },
            updateData() {
                this.jenis.append('nama', this.form.nama);

                var uri = this.$apiUrl + '/jenis-hewan/' + this.updatedId;
                this.load = true
                this.$http.post(uri, this.jenis).then(response => {
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
            deleteData(deleteId) {
                //mengahapus data 
                var uri = this.$apiUrl + '/jenis-hewan/' + deleteId;
                //data dihapus berdasarkan id 
                this.$swal({
                    title: 'Apa kamu yakin??',
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
                        this.$http.delete(uri).then(response => {
                            this.$swal({
                            title: response.data.message,
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
                        this.updateData()
                    }
                }
            },
            resetForm() {
                this.form = {
                    nama: '',
                }
                this.$refs.observer.reset()
            },
        },
        mounted() {
            this.readData();
        },
    }
</script>