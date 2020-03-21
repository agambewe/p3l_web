<template>
    <v-container dark>
        <v-container grid-list-md mb-0>
            <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Data Hewan Terhapus</h1>
            <v-layout row wrap style="margin:10px">
                <v-flex xs8 style="float:right;widht:300">
                    <v-btn small class="mx-2" fab color="deep-orange darken-3" v-on="on" router to="/hewan">
                        <v-icon dark>mdi-undo</v-icon>
                    </v-btn>
                </v-flex>
                <v-flex xs4 >
                    <v-text-field v-model="keyword" append-icon="mdi-magnify" label="Cari" single-line hide-details></v-text-field>
                </v-flex>
            </v-layout>
            <v-data-table :headers="headers" :items="hewan" :search="keyword" :loading="load" no-data-text="Data kosong" light>
                <template v-slot:body="{ items }">
                    <tbody v-if="items.length!=0">
                        <tr v-for="item in items" :key="item.id">
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
                            <td>{{ item.created_by }}</td>
                            <td v-if="item.updated_by==NULL">
                                -
                            </td>
                            <td v-else>
                                {{ item.updated_by }}
                            </td>
                            <td v-if="item.deleted_by==NULL">
                                -
                            </td>
                            <td v-else>
                                {{ item.deleted_by }}
                            </td>
                            <td>{{ item.created_at}}</td>
                            <td>{{ item.updated_at }}</td>
                            <td>{{ item.deleted_at }}</td>
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

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Share+Tech+Mono");

table th + th { border-left:1px solid #dddddd; }
table td + td { border-left:1px solid #dddddd; }
tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, .05);
}
</style>

<script>
    export default {
        data() {
            return {
                load: false,
                color: '',
                keyword: '',
                headers: [
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
                    {
                        text: 'Dibuat oleh',
                        value: 'created_by'
                    },
                    {
                        text: 'Diubah oleh',
                        value: 'updated_by'
                    },
                    {
                        text: 'Dihapus oleh',
                        value: 'deleted_by'
                    },
                    {
                        text: 'Dibuat pada',
                        value: 'created_at'
                    },
                    {
                        text: 'Diubah pada',
                        value: 'updated_at'
                    },
                    {
                        text: 'Deleted At',
                        value: 'deleted_at'
                    },
                ],
                hewan: [],
                jenisHewan: [],
                customer: [],
            }
        },
        methods: {
            readData() {
                var uri = this.$apiUrl + '/hewan/terhapus'
                this.$http.get(uri).then(response => {
                    this.hewan = response.data
                })
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
        },
        mounted() {
            this.readData();
            this.readDataJenisHewan();
            this.readDataCustomer();
        },
    }
</script>