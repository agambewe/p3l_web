<template>
    <v-container dark>
        <v-container grid-list-md mb-0>
            <h1 class="text-md-center" style="font-family: 'Share Tech Mono';text-shadow: -2px 4px 4px silver">Informasi Toko</h1>
        </v-container>
        <v-container>
      <v-row dense>
        <v-col cols="12">
          <v-card color="#238092E6">
            <v-card-title class="headline">JAM OPERASINAL</v-card-title>
            <v-card-subtitle>Buka Setiap Hari, Pukul 08.00 - 18.00 WIB</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card color="#54A2B1E6">
            <v-card-title class="headline">KOUVEE PET SHOP</v-card-title>
            <v-card-subtitle>Kouve adalah pet shop yang melayani pembelian produk dan layanan yang berdiri sejak tahun 2020 di Yogyakarta.</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card color="#7FC1CEE6">
            <v-card-title class="headline">LAYANAN KONSUMEN</v-card-title>
            <v-card-subtitle>Tersedia 24 Jam, Hubungi Telp. (0274) 357735 </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
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