<template>
    <v-container dark>
        <v-container grid-list-md mb-0>
            <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Data Pengadaan</h1>
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
                                    kosong
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
            <v-data-table :headers="headers" :items-per-page="5" :items="pengadaan" :search="keyword" :loading="load" no-data-text="Data kosong" light>
                <template v-slot:body="{ items }">
                    <tbody v-if="items.length!=0">
                        <tr v-for="item in items" :key="item.id">
                            <td >
                                <div class="flex">
                                    <v-btn icon color="amber accent-3" @click="readDetail()">
                                        <v-icon>mdi-arrow-down</v-icon>
                                    </v-btn>
                                </div>
                            </td>
                            <td>
                                <v-btn x-small color="green lighten-2" v-if="item.status_order == 1">
                                    Diterima
                                </v-btn>
                                <v-btn x-small color="red lighten-2" v-else @click="updateData(item.id)" >
                                    Dalam pengiriman
                                </v-btn>
                            <td>
                                <v-autocomplete
                                    v-model="item.id_supplier" 
                                    :items="supplier"
                                    item-value="id"
                                    item-text="nama"
                                    readonly>
                                </v-autocomplete>
                            </td>
                            <td>{{ item.tanggal_restock }}</td>
                            <td>{{ item.total_bayar }}</td>
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
                typeInput: 'Tambah',
                keyword: '',
                headers: [
                    {
                        text: 'Detail',
                        value: null,
                        sortable: false
                    },
                    {
                        text: 'Status',
                        value: 'status_order'
                    },
                    {
                        text: 'Supplier',
                        value: 'id_supplier'
                    },
                    {
                        text: 'Tanggal Restock',
                        value: 'tanggal_restock'
                    },
                    {
                        text: 'Total Bayar',
                        value: 'total_bayar'
                    },
                ],
                pengadaan: [],
                supplier: [],
                form: {
                    id_supplier: '',
                    tanggal_restock: '',
                    total_bayar: '',
                    status_order: ''
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
            close() {
                this.dialog = false
            },
            clear() {
                this.resetForm();
            },
            readDataSupplier() {
                var uri = this.$apiUrl + '/supplier/'
                this.$http.get(uri).then(response => {
                    this.supplier = response.data
                })
            },
            readData() {
                var uri = this.$apiUrl + '/order-restock/'
                this.$http.get(uri).then(response => {
                    this.pengadaan = response.data
                })
            },
            readDetail() {
            },
            updateData(id) {
                var uri = this.$apiUrl + '/order-restock/' + id;
                this.load = true
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
            },
            resetForm() {
                this.form = {
                    id_supplier: '',
                    tanggal_restock: '',
                    total_bayar: '',
                    status_order: ''
                }
            },
        },
        mounted() {
            this.readData();
            this.readDataSupplier();
        },
    }
</script>