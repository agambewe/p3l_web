<template>
    <v-container dark>
        <v-card>
            <v-container grid-list-md mb-0>
                <h2 class="text-md-center" style="text-shadow: 2px 0px 4px #00000">Data Pegawai</h2>
                <v-layout row wrap style="margin:10px">
                    <!-- <v-flex xs12 class="text-left">
                        <v-text-field v-model="keyword" append-icon="mdi-file-search" label="Search" single-line hide-details>
                        </v-text-field>
                    </v-flex> -->
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-flex xs8 style="float:right;widht:300">
                                <v-btn color="secondary" dark class="mb-1" v-on="on" @click="clear()">tambah pegawai</v-btn>
                                <v-divider class="mx-1" inset vertical></v-divider>
                                <v-btn color="secondary" dark class="mb-1" v-on="on" router to="/pegawai/terhapus">pegawai terhapus</v-btn>
                                </v-flex>
                            <v-flex xs4 >
                                <v-text-field v-model="keyword" append-icon="mdi-file-search" label="Search" single-line hide-details></v-text-field>
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
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="form.username" label="Username"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-overflow-btn 
                                            v-model="form.role" 
                                            label="Role"
                                            class="my-2" 
                                            :items="role_data"
                                            item-value="text">
                                            </v-overflow-btn>
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
                                                    label="Tanggal"
                                                    hint="MM/DD/YYYY format"
                                                    persistent-hint
                                                    readonly
                                                    v-on="on"
                                                ></v-text-field>
                                                </template>
                                                <v-date-picker v-model="date" no-title @input="menu2 = false"></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="form.alamat" label="Alamat"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="12">
                                            <v-text-field v-model="form.telepon" label="Telepon"></v-text-field>
                                        </v-col>
                                        <v-col v-if="this.typeInput === 'Ubah'" cols="12" sm="6" md="12">
                                        <label>Ubah password? </label>
                                            <input type="checkbox" id="checkbox" v-model="checked"><br><br>
                                                <v-text-field v-if="checked" v-model="form.password" type="password" label="Password Baru"></v-text-field>
                                                <v-text-field v-else v-show="false" v-model="form.password" type="password" label="Password"></v-text-field>
                                        </v-col>
                                        <v-col v-else cols="12" sm="6" md="12">
                                            <v-text-field v-model="form.password" label="password" type="password"></v-text-field>
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
                <v-data-table :headers="headers" :items="pegawai" :search="keyword" :loading="load">
                    <template v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="(item,index) in items" :key="item.id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.nama }}</td>
                                <td>{{ item.username }}</td>
                                <td>{{ item.alamat }}</td>
                                <td>{{ item.tanggal_lahir }}</td>
                                <td>{{ item.telepon }}</td>
                                <td>{{ item.role }}</td>
                                <!-- <td>{{ item.password }}</td> -->
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
                checked: false,
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
                        text: 'Username',
                        value: 'username'
                    },
                    {
                        text: 'Alamat',
                        value: 'alamat'
                    },
                    {
                        text: 'Tanggal Lahir',
                        value: 'tanggal_lahir'
                    },
                    {
                        text: 'Telepon',
                        value: 'telepon'
                    },
                    {
                        text: 'Role',
                        value: 'role'
                    },
                    // {
                    //     text: 'Password',
                    //     value: 'password'
                    // },
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
                role_data: [
                    { text: 'CS' },
                    { text: 'KASIR' }
                ],
                pegawai: [],
                form: {
                    nama: '',
                    username: '',
                    alamat: '',
                    tanggal_lahir: '',
                    telepon: '',
                    role: '',
                    password: '',
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
                this.form = {}
                this.cek = -1
            },
            readData() {
                var set_token = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
                var uri = this.$apiUrl + '/pegawai/'
                this.$http.get(uri, set_token).then(response => {
                    this.pegawai = response.data
                })
            },
            createData() {
                this.user.append('nama', this.form.nama);
                this.user.append('username', this.form.username);
                this.user.append('alamat', this.form.alamat);
                this.user.append('tanggal_lahir', this.form.tanggal_lahir);
                this.user.append('telepon', this.form.telepon);
                this.user.append('role', this.form.role);
                this.user.append('password', this.form.password);

                var uri = this.$apiUrl + '/pegawai/'
                this.load = true
                this.$http.post(uri, this.user).then(response => {
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
                this.form.username = item.username;
                this.form.alamat = item.alamat;
                this.form.tanggal_lahir = item.tanggal_lahir;
                this.form.telepon = item.telepon;
                this.form.role = item.role;
                this.updatedId = item.id;
                console.log(this.typeInput);
            },
            updateData() {
                this.user.append('nama', this.form.nama);
                this.user.append('username', this.form.username);
                this.user.append('alamat', this.form.alamat);
                this.user.append('tanggal_lahir', this.form.tanggal_lahir);
                this.user.append('telepon', this.form.telepon);
                this.user.append('role', this.form.role);
                if (this.checked)
                    this.user.append('password', this.form.password);

                var uri = this.$apiUrl + '/pegawai/' + this.updatedId;
                this.load = true
                this.$http.post(uri, this.user).then(response => {
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
                var uri = this.$apiUrl + '/pegawai/' + deleteId;
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
        },
        mounted() {
            this.readData();
        },
    }
</script>