<template>
    <v-container dark>
        <v-container grid-list-md mb-0>
            <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Data Layanan</h1>
            <v-layout row wrap style="margin:10px">
                <v-dialog v-model="dialog" persistent max-width="500px">
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
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="form.nama" label="Nama Layanan"></v-text-field>
                                    </v-col>
                                    <v-col cols="6" sm="6" md="6">
                                        <v-overflow-btn 
                                        v-model="form.id_ukuran" 
                                        label="Ukuran"
                                        class="my-2" 
                                        :items="ukuranHewan"
                                        item-value="id"
                                        item-text="nama">
                                        </v-overflow-btn>
                                    </v-col>
                                    <v-col cols="6" sm="6" md="6">
                                        <v-text-field v-model="form.harga" type="number" label="Harga"></v-text-field>
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
            </v-layout>
            <v-data-table :headers="headers" :items-per-page="5" :items="layanan" :search="keyword" :loading="load" no-data-text="Data kosong" light>
                <template v-slot:body="{ items }">
                    <tbody v-if="items.length!=0">
                        <tr v-for="item in items" :key="item.id">
                            <td >
                                <div class="flex">
                                    <v-btn icon color="amber accent-3" @click="editHandler(item)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon color="red accent-2" @click="deleteData(item.id)">
                                        <v-icon>mdi-delete-empty</v-icon>
                                    </v-btn>
                                </div>
                            </td>
                            <td>{{ item.nama }}</td>
                            <td>
                            <v-select
                                v-model="item.id_ukuran" 
                                label="Ukuran"
                                readonly
                                :items="ukuranHewan"
                                item-value="id"
                                item-text="nama">
                            </v-select></td>
                            <td>{{ item.harga }}</td>
                            <td>{{ item.created_at}}</td>
                            <td>{{ item.updated_at }}</td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <td :colspan="headers.length" class="text-center">Data masih kosong.</td>
                    </tbody>
                </template>
            </v-data-table>
            <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
                {{ text }}
                <v-btn dark text @click="snackbar = false">
                    Close
                </v-btn>
            </v-snackbar>
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
    export default {
        data() {
            return {
                load: false,
                dialog: false,
                color: '',
                snackbar: false,
                typeInput: 'Tambah',
                keyword: '',
                headers: [
                    {
                        text: 'Aksi',
                        value: null,
                        sortable: false
                    },
                    {
                        text: 'Nama',
                        value: 'nama'
                    },
                    {
                        text: 'Ukuran',
                        value: 'id_ukuran'
                    },
                    {
                        text: 'Harga',
                        value: 'harga'
                    },
                    {
                        text: 'Created At',
                        value: 'created_at'
                    },
                    {
                        text: 'Updated At',
                        value: 'updated_at'
                    },
                ],
                layanan: [],
                ukuranHewan: [],
                form: {
                    id_ukuran: '',
                    nama: '',
                    harga: ''
                },
                updatedId: '',
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
            close() {
                this.dialog = false
                this.typeInput = 'Tambah';
            },
            clear() {
                this.resetForm();
            },
            readDataUkuranHewan() {
                var uri = this.$apiUrl + '/ukuran-hewan/'
                this.$http.get(uri).then(response => {
                    this.ukuranHewan = response.data
                })
            },
            readData() {
                var uri = this.$apiUrl + '/layanan/'
                this.$http.get(uri).then(response => {
                    this.layanan = response.data
                })
            },
            createData() {
                this.user.append('id_ukuran', this.form.id_ukuran);
                this.user.append('nama', this.form.nama);
                this.user.append('harga', this.form.harga);

                var uri = this.$apiUrl + '/layanan/'
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
                        title: 'Gagal mengubah data!',
                        text: 'Coba lagi ..',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.load = false;
                })
            },
            editHandler(item) {
                this.typeInput = 'Ubah';
                this.dialog = true;
                this.form.id_ukuran = item.id_ukuran;
                this.form.nama = item.nama;
                this.form.harga = item.harga;
                this.updatedId = item.id;
            },
            updateData() {
                this.user.append('id_ukuran', this.form.id_ukuran);
                this.user.append('nama', this.form.nama);
                this.user.append('harga', this.form.harga);

                var uri = this.$apiUrl + '/layanan/' + this.updatedId;
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
            deleteData(deleteId) {
                //mengahapus data 
                var uri = this.$apiUrl + '/layanan/' + deleteId;
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
                            icon: 'success'})
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
                    this.updateData()
                }
            },
            resetForm() {
                this.form = {
                    id_ukuran: '',
                    nama: '',
                    harga: ''
                }
            },
        },
        mounted() {
            this.readData();
            this.readDataUkuranHewan();
        },
    }
</script>