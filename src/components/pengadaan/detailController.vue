<template>
    <v-container dark>
        <v-container grid-list-md mb-0>
            <!-- <v-flex class="flex" xs8 style="float:right;widht:300">
                <v-btn class="mx-2" fab color="blue lighten-1" v-on="on" @click="clear()">
                    <v-icon dark>mdi-plus</v-icon>
                </v-btn>
            </v-flex> -->
            
            <div v-if="detailPo.length<=0" class="body-1 text-center">
                Detail belum ada/ masih kosong.
            </div>
            <div v-else>
                <v-card-title>
                    <span class="headline">Detail Data {{ idPo }} <v-divider inset vertical></v-divider></span>
                </v-card-title>
                <v-data-table :headers="headers" :items="detailPo" :loading="load" hide-default-footer no-data-text="Data kosong" light>
                    <template v-slot:body="{ items }">
                        <tbody v-if="items.length!=0">
                            <tr v-for="(item, index) in items" :key="item.id">
                                <td>{{ index+1 }}</td>
                                <td>{{ item.produk.nama }}</td>
                                <td>{{ item.produk.satuan }}</td>
                                <td>{{ item.jumlah }}</td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <td :colspan="headers.length" class="text-center">Data masih kosong.</td>
                        </tbody>
                    </template>
                </v-data-table>
            </div>
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
        max-width: 50px;
        border: none;
    }
    .v-select .dropdown-toggle {
        border: none;
    }
</style>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
        data() {
            return {
                load: false,
                typeInput: 'Tambah',
                keyword: '',
                headers: [
                    {
                        text: 'No',
                        value: null,
                        sortable: false
                    },
                    {
                        text: 'Nama Produk',
                        value: 'id_produk'
                    },
                    {
                        text: 'Satuan',
                        value: 'satuan'
                    },
                    {
                        text: 'Jumlah',
                        value: 'jumlah'
                    }
                    // {
                    //     text: 'Subtotal harga',
                    //     value: 'subtotal'
                    // }
                ],
                detailPo: [],
                form: {
                    id_produk: '',
                    jumlah: '',
                    subtotal: ''
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
            ...mapGetters({
                idPo: "restock/idPo"
            })
        },
        watch: {
            idPo: function () {
                this.readData();
            }
        },
        methods: {
            readData() {
                var uri = this.$apiUrl + '/detail-order-restock/po/'+this.idPo
                this.$http.get(uri).then(response => {
                    this.detailPo = response.data
                    console.log(this.idPo)
                })
            },
        },
        mounted() {
            this.readData();
        },
    }
</script>