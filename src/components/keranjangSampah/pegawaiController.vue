<template>
    <v-container dark>
        <v-card>
            <v-container grid-list-md mb-0>
                <h2 class="text-md-center" style="text-shadow: 2px 0px 4px #00000">Data Pegawai Terhapus</h2>
                <v-layout row wrap style="margin:10px">
                    <v-flex xs8 style="float:right;widht:300">
                        <v-btn color="secondary" dark class="mb-1" v-on="on" router to="/pegawai/">Data pegawai</v-btn>
                        <v-divider class="mx-1" inset vertical></v-divider>
                    </v-flex>
                    <v-flex xs4 >
                        <v-text-field v-model="keyword" append-icon="mdi-file-search" label="Search" single-line hide-details></v-text-field>
                    </v-flex>
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
                            </tr>
                        </tbody>
                    </template>
                </v-data-table>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                load: false,
                color: '',
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
                ],
                pegawai: [],
            }
        },
        methods: {
            readData() {
                var set_token = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
                var uri = this.$apiUrl + '/pegawai/terhapus'
                this.$http.get(uri, set_token).then(response => {
                    this.pegawai = response.data
                })
            },
        },
        mounted() {
            this.readData();
        },
    }
</script>