<template>
    <v-container dark>
        <v-card>
            <v-container grid-list-md mb-0>
                <h2 class="text-md-center" style="text-shadow: 2px 0px 4px #00000">Data Produk</h2>
                <v-layout row wrap style="margin:10px">
                    <v-flex xs6 class="text-right">
                        <v-text-field v-model="keyword" append-icon="mdi-file-search" label="Search" single-line hide-details>
                        </v-text-field>
                    </v-flex>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="secondary" dark class="mb-2" v-on="on" @click="clear()">tambah produk</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <img v-if="imageUrl" :src="imageUrl" alt="Profile foto" width="150" height="180">
                                        <img v-else :src="$apiUrl + '/../uploads/' + form.foto" alt="Foto produk" width="150" height="180"><br>
                                        <input type="file" accept="image/*" @change="onChange" />
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="form.nama" label="Nama"></v-text-field>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-text-field v-model="form.satuan" label="Satuan"></v-text-field>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-text-field v-model="form.harga" type="number" label="Harga"></v-text-field>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-text-field v-model="form.stok" type="number" label="Stok"></v-text-field>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-text-field v-model="form.minimal" type="number" label="Minimal"></v-text-field>
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
                <v-data-table :headers="headers" :items-per-page="5" :items="produk" :search="keyword" :loading="load">
                    <template v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="(item,index) in items" :key="item.id">
                                <td>{{ index + 1 }}</td>
                                <td>
                                    <img :src="imageSrc(item.foto)" 
                                    width="150"
                                    height="150"
                                    />
                                </td>
                                <td>{{ item.nama }}</td>
                                <td>{{ item.satuan }}</td>
                                <td>{{ item.stok }}</td>
                                <td>{{ item.harga }}</td>
                                <td>{{ item.created_at}}</td>
                                <td>{{ item.updated_at }}</td>
                                <!-- <td v-if="item.deleted_at==NULL">
                                    -
                                </td>
                                <td v-else>
                                    {{ item.deleted_at }}
                                </td> -->
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
                src: '',
                load: false,
                dialog: false,
                color: '',
                text: '',
                snackbar: false,
                checked: false,
                typeInput: 'Tambah',
                keyword: '',
                headers: [{
                        text: 'No',
                        value: 'no',
                    },
                    {
                        text: 'Foto',
                        value: 'foto'
                    },
                    {
                        text: 'Nama',
                        value: 'nama'
                    },
                    {
                        text: 'Satuan',
                        value: 'satuan'
                    },
                    {
                        text: 'Stok',
                        value: 'stok'
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
                    // {
                    //     text: 'Deleted At',
                    //     value: 'deleted_at'
                    // },
                    {
                        text: 'Aksi',
                        value: null,
                        sortable: false
                    },
                ],
                produk: [],
                form: {
                    nama: '',
                    satuan: '',
                    stok: '',
                    minimal: '',
                    harga: '',
                    foto: '',
                },
                updatedId: '',
                errors: '',
                user: new FormData,
                imageUrl: '',
            }
        },
        computed: {
            formTitle() {
                return this.typeInput
            },
        },
        watch: {
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
            imageSrc(foto) {
                return this.$apiUrl + '/../uploads/' + foto
            },
            onChange(e) {
                const file = e.target.files[0]
                this.produk.foto = file
                this.form.foto = file
                this.imageUrl = URL.createObjectURL(file)
            },
            readData() {
                var uri = this.$apiUrl + '/produk/'
                this.$http.get(uri).then(response => {
                    this.produk = response.data
                })
            },
            createData() {
                this.user.append('nama', this.form.nama);
                this.user.append('satuan', this.form.satuan);
                this.user.append('stok', this.form.stok);
                this.user.append('minimal', this.form.minimal);
                this.user.append('harga', this.form.harga);
                this.user.append('foto', this.form.foto);

                var uri = this.$apiUrl + '/produk/'
                this.load = true
                this.$http.post(uri, this.user).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = response.data.message;
                    this.load = false;
                    this.close();
                    this.readData();
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
                this.form.satuan = item.satuan;
                this.form.stok = item.stok;
                this.form.harga = item.harga;
                this.updatedId = item.id;
                console.log(this.typeInput);
            },
            updateData() {
                this.user.append('nama', this.form.nama);
                this.user.append('satuan', this.form.satuan);
                this.user.append('stok', this.form.stok);
                this.user.append('harga', this.form.harga);

                var uri = this.$apiUrl + '/produk/' + this.updatedId;
                this.load = true
                this.$http.post(uri, this.user).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = response.data.message;
                    this.load = false;
                    this.close();
                    this.readData();
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
                var uri = this.$apiUrl + '/produk/' + deleteId;
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
                    satuan: '',
                    stok: '',
                    harga: '',
                    foto: '',
                }
            },
        },
        mounted() {
            this.readData();
        },
    }
</script>