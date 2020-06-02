<template>
    <v-container dark>
        <v-container grid-list-md mb-0>
            <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Daftar Layanan Tersedia</h1>
                <v-data-iterator :items="layanan" :items-per-page.sync="itemsPerPage" :page="page" :search="search" :sort-by="sortBy.toLowerCase()" :sort-desc="sortDesc" hide-default-footer>

                <template v-slot:header>
                    <v-toolbar dark color="#4E5862" class="mb-1">
                        <v-text-field v-model="search" clearable flat solo-inverted hide-details label="Search" prepend-inner-icon="mdi-magnify"></v-text-field>
                        <template v-if="$vuetify.breakpoint.mdAndUp">
                            <v-spacer></v-spacer>
                            <v-select v-model="sortBy" flat solo-inverted hide-details :items="keys" label="Sort by" prepend-inner-icon="mdi-magnify"></v-select>
                            <v-spacer></v-spacer>
                            <v-btn-toggle v-model="sortDesc" mandatory>
                                <v-btn large depressed color="#4E5862" :value="false">
                                    <v-icon>mdi-arrow-up</v-icon>
                                </v-btn>
                                <v-btn large depressed color="#4E5862" :value="true">
                                    <v-icon>mdi-arrow-down</v-icon>
                                </v-btn>
                            </v-btn-toggle>
                        </template>
                    </v-toolbar>
                </template>

                <template v-slot:default="props">
                    <v-row>
                        <v-col v-for="item in props.items" :key="item.nama" cols="12" sm="6" md="4" lg="3">
                            <v-card>
                                <v-card-title class="subheading font-weight-bold">{{ item.nama }}</v-card-title>

                                <v-divider></v-divider>

                                <v-list dense>
                                    <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                                        <v-list-item-content :class="{ 'blue--text': sortBy === key }">{{ key }}:</v-list-item-content>
                                        <v-list-item-content class="align-end" :class="{ 'blue--text': sortBy === key }">{{ item[key.toLowerCase()] }}</v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-col>
                    </v-row>
                </template>

                <template v-slot:footer>
                    <v-row class="mt-2" align="center" justify="center">
                        <span class="grey--text">Items per page</span>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-btn dark text color="#4E5862" class="ml-2" v-on="on">
                                    {{ itemsPerPage }}
                                    <v-icon>mdi-chevron-down</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item v-for="(number, index) in itemsPerPageArray" :key="index" @click="updateItemsPerPage(number)">
                                    <v-list-item-title>{{ number }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>

                        <v-spacer></v-spacer>
                    </v-row>
                </template>
            </v-data-iterator>
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
    .v-select__selections {
        max-width: 150px;
        min-width: 100px;
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
                dialogDetail: false,
                keyword: '',
                headers: [
                    {
                        text: 'Nama',
                        value: 'nama'
                    },
                  
                ],
                layanan: [],
                ukuranHewan: [],
                updatedId: '',
                errors: '',
                user: new FormData,
                //
                itemsPerPageArray: [4, 8, 12, 16, 20],
            search: '',
            filter: {},
            sortDesc: false,
            page: 1,
            itemsPerPage: 8,
            sortBy: 'nama',
            keys: [
                'Nama', 
                'Harga',
            ],
            items: [],
            cek: -1,
            dialog: false,
            checkDelete: [],
            search: "",
            dialog: false,
            // desserts: [],
            editedIndex: -1,
            }
        },
        computed: {
            formTitle() {
                return this.typeInput
            },
            numberOfPages() {
            return Math.ceil(this.items.length / this.itemsPerPage)
            },
            filteredKeys() {
                return this.keys.filter(key => key !== `Nama`)
            },
        },
        watch: {
            dialog(val) {
                val || this.close();
            }
        },
        methods: {
            nextPage() {
            if (this.page + 1 <= this.numberOfPages) this.page += 1
            },
            formerPage() {
                if (this.page - 1 >= 1) this.page -= 1
            },
            updateItemsPerPage(number) {
                this.itemsPerPage = number
            },
            close() {
                this.dialog = false
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