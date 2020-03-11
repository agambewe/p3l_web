<template>
    <v-container dark>
        <v-card>
            <v-container grid-list-md mb-0>
                <h2 class="text-md-center">Ukuran Hewan</h2>
                <v-layout row wrap style="margin:10px">
                    <v-flex xs6 class="text-right">
                        <v-text-field v-model="keyword" append-icon="mdi-file-search" label="Search" single-line hide-details>
                        </v-text-field>
                    </v-flex>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-dialog v-model="dialog" max-width="300px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="secondary" dark class="mb-2" v-on="on" @click="clear()">tambah ukuran</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="form.nama" label="Nama Ukuran"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Batal</v-btn>
                                <v-btn color="blue darken-1" text @click="setForm()">Simpan</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-layout>
                <v-data-table :headers="headers" :items="ukuranHewan" :search="keyword" :loading="load">
                    <template v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="(item,index) in items" :key="item.id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.nama }}</td>
                                <td>{{ item.created_at}}</td>
                                <td>{{ item.updated_at }}</td>
                                <td v-if="item.deleted_at==NULL">
                                    -
                                </td>
                                <td v-else>
                                    {{ item.deleted_at }}
                                </td>
                                <td>
                                    <v-btn icon color="primary lighten-2" dark @click="editHandler(item)">
                                        <v-icon>mdi-file-edit</v-icon>
                                    </v-btn>
                                    <v-btn icon color="red lighten-2 " @click="deleteData(item.id)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
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
        </v-card>
    </v-container>
</template>

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
                headers: [{
                        text: 'No',
                        value: 'no',
                    },
                    {
                        text: 'Nama',
                        value: 'nama'
                    },
                    {
                        text: 'Created At',
                        value: 'created_at'
                    },
                    {
                        text: 'Updated At',
                        value: 'updated_at'
                    },
                    {
                        text: 'Deleted At',
                        value: 'deleted_at'
                    },
                    {
                        text: 'Aksi',
                        value: null,
                        sortable: false
                    },
                ],
                ukuranHewan: [],
                form: {
                    nama: '',
                },
                updatedId: '',
                errors: '',
                ukuran: new FormData,
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
                this.form = {}
                this.cek = -1
            },
            readData() {
                var set_token = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
                var uri = this.$apiUrl + '/ukuran-hewan/'
                this.$http.get(uri, set_token).then(response => {
                    this.ukuranHewan = response.data
                })
            },
            createData() {
                this.ukuran.append('nama', this.form.nama);

                var uri = this.$apiUrl + '/ukuran-hewan/'
                this.load = true
                this.$http.post(uri, this.ukuran).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = response.data.message;
                    this.load = false;
                    this.close();
                    this.readData(); //mengambil data user 
                    this.resetForm();
                }).catch(error => {
                    this.errors = error
                    this.snackbar = true;
                    this.text = 'Try Again';
                    this.color = 'red';
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
                this.ukuran.append('nama', this.form.nama);

                var uri = this.$apiUrl + '/ukuran-hewan/' + this.updatedId;
                this.load = true
                this.$http.post(uri, this.ukuran).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = response.data.message;
                    this.load = false;
                    this.close();
                    this.readData(); //mengambil data user 
                    this.resetForm();
                    this.typeInput = 'Tambah';
                }).catch(error => {
                    this.errors = error
                    this.snackbar = true;
                    this.text = 'Try Again';
                    this.color = 'red';
                    this.load = false;
                    this.typeInput = 'Tambah';
                })
            },
            deleteData(deleteId) {
                //mengahapus data 
                var uri = this.$apiUrl + '/ukuran-hewan/' + deleteId;
                //data dihapus berdasarkan id 
                confirm('Yakin menghapus ini?') && this.$http.delete(uri).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = response.data.message;
                    this.deleteDialog = false;
                    this.readData();
                }).catch(error => {
                    this.errors = error
                    this.snackbar = true;
                    this.text = 'Try Again';
                    this.color = 'red';
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
                    nama: '',
                }
            },
        },
        mounted() {
            this.readData();
        },
    }
</script>