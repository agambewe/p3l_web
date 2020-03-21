<template>
<v-container dark>
    <v-container grid-list-md mb-0>
        <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Data Produk</h1>
        <v-layout row wrap style="margin:10px">
            <v-dialog v-model="dialog" persistent max-width="500px">
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
                                <v-col v-if="this.typeInput === 'Ubah'" cols="12" sm="12" md="12">
                                    <img v-if="imageUrl" :src="imageUrl" alt="Foto produk" width="150" height="150">
                                    <img v-else :src="$apiUrl + '/../uploads/' + form.foto" alt="Foto produk" width="150" height="150"><br>
                                    <label>Ubah gambar? </label>
                                    <input type="checkbox" id="checkbox_img" v-model="checked_img"><br>
                                    <input v-if="checked_img" id="foto" type="file" accept="image/*" @change="onChange" />
                                </v-col>
                                <v-col v-else cols="12" sm="12" md="12">
                                    <img v-if="imageUrl" :src="imageUrl" alt="Foto produk" width="150" height="150">
                                    <img v-else :src="$apiUrl + '/../uploads/default.png'" alt="Foto produk" width="150" height="150"><br>
                                    <input id="foto" type="file" accept="image/*" @change="onChange" />
                                </v-col>
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
                        <v-btn color="blue accent-2" text @click="close">Batal</v-btn>
                        <v-btn color="green lighten-1" text @click="setForm()">Simpan</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialog2" persistent max-width="528px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Nama file: {{ gambarTampil }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <img 
                                    :src="imageSrc(gambarTampil)" 
                                    center
                                    width="480"
                                    height="500"
                                    />
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue accent-2" text @click="dialog2 = false">Tutup</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
        <v-data-table :headers="headers" :items-per-page="5" :items="produk" :search="keyword" :loading="load" no-data-text="Data kosong" light>
            <template v-slot:body="{ items }">
                <tbody v-if="items.length!=0">
                    <tr v-for="item in items" :key="item.id">
                        <td>
                            <div class="flex">
                                <v-btn icon color="amber accent-3" @click="editHandler(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon color="red accent-2" @click="deleteData(item.id)">
                                    <v-icon>mdi-delete-empty</v-icon>
                                </v-btn>
                            </div>
                        </td>
                        <td>
                            <div class="flex">
                                <v-btn icon class="mx-2" color="grey darken-1" v-on="on" @click="tampilGambar(item)">
                                    <v-icon dark>mdi-eye</v-icon>
                                </v-btn>
                                {{ tampilNama(item.foto) }}
                            </div>
                        </td>
                        <td>{{ item.nama }}</td>
                        <td>{{ item.satuan }}</td>
                        <td>{{ item.stok }}</td>
                        <td>{{ item.minimal }}</td>
                        <td>{{ item.harga }}</td>
                        <td>{{ item.created_at}}</td>
                        <td>{{ item.updated_at }}</td>
                        <!-- <td v-if="item.deleted_at==NULL">
                                -
                            </td>
                            <td v-else>
                                {{ item.deleted_at }}
                            </td> -->
                    </tr>
                </tbody>
                <tbody v-else>
                    <td :colspan="headers.length" class="text-center">Data masih kosong.</td>
                </tbody>
            </template>
        </v-data-table>
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
</style>

<script>
export default {
    data() {
        return {
            src: '',
            load: false,
            dialog: false,
            dialog2: false,
            text: '',
            checked_img: false,
            checked: false,
            typeInput: 'Tambah',
            keyword: '',
            headers: [{
                    text: 'Aksi',
                    value: null,
                    sortable: false
                },
                {
                    text: 'Gambar',
                    value: 'gambar'
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
                    text: 'Minimal',
                    value: 'minimal'
                },
                {
                    text: 'Harga',
                    value: 'harga'
                },
                {
                    text: 'Dibuat pada',
                    value: 'created_at'
                },
                {
                    text: 'Diubah pada',
                    value: 'updated_at'
                },
                // {
                //     text: 'Deleted At',
                //     value: 'deleted_at'
                // },
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
            gambarTampil: '',
            // gambarNama: '',
        }
    },
    computed: {
        formTitle() {
            return this.typeInput
        },
    },
    watch: {},
    methods: {
        close() {
            this.dialog = false
            this.typeInput = 'Tambah';
        },
        clear() {
            this.resetForm();
        },
        imageSrc(foto) {
            return this.$apiUrl + '/../uploads/' + foto
        },
        onChange(e) {
            const file = e.target.files[0]
            this.produk.foto = file
            this.imageUrl = URL.createObjectURL(file)
        },
        tampilGambar(item){
            this.dialog2 = true;
            this.gambarTampil= item.foto;
        },
        tampilNama(item){
            var str = 'default.png';

            if(item!='default.png'){
                var str = item.split("_")[1];
            }
            return str;
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
            this.user.append('foto', this.produk.foto);

            var uri = this.$apiUrl + '/produk/'
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
            this.typeInput = 'Ubah';
            this.dialog = true;
            this.form.nama = item.nama;
            this.form.satuan = item.satuan;
            this.form.stok = item.stok;
            this.form.minimal = item.minimal;
            this.form.harga = item.harga;
            this.form.foto = item.foto;
            this.updatedId = item.id;
        },
        updateData() {
            this.user.append('nama', this.form.nama);
            this.user.append('satuan', this.form.satuan);
            this.user.append('stok', this.form.stok);
            this.user.append('minimal', this.form.minimal);
            this.user.append('harga', this.form.harga);
            if (this.checked_img) {
                this.user.append('foto', this.produk.foto);
            }

            var uri = this.$apiUrl + '/produk/' + this.updatedId;
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
            var uri = this.$apiUrl + '/produk/' + deleteId;
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
            // this.imageUrl= '',
            this.form = {
                    nama: '',
                    satuan: '',
                    stok: '',
                    minimal: '',
                    harga: '',
                    foto: '',
                },

            this.produk.foto = '';
            this.checked_img = false;
            this.imageUrl = '';
            document.getElementById('foto').value=''
        },
    },
    mounted() {
        this.readData();
        this.produk.foto = '';
        this.checked_img = false;
        this.imageUrl = '';
    },
}
</script>
