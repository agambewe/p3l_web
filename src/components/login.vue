<template>
<div class="blue-grey lighten-5 full-height">
    <v-container fill-height>
        <v-layout row class="text-xs-center"> 
            <v-row>
                <v-flex md7>
                    <img src="../assets/background.png" id="bekgron">
                    <div id="tulisan">Welcome to Kouvee Pet Shop..</div>
                </v-flex>
                <v-card height="300px"></v-card>
                <v-flex md4 align="center" justify="center" style="backgroundColor:#4E5862;">
                    <v-container id="bungkus" class="text-xs-center">
                        <img src="../assets/logo.png" id="gambar">
                        <v-card class="pl-5 pr-5 pb-1" flat>
                            <v-card-title primary-title>
                                <h4 id="titel">Login</h4>
                            </v-card-title>
                            <!-- <ValidationObserver ref="observer" v-slot="{ validate, reset }"> -->
                            <ValidationObserver ref="observer" v-slot="{  }">
                                <v-form class="my-5">
                                    <ValidationProvider v-slot="{ errors }" name="username" rules="required|max:50">
                                        <v-text-field v-model="username" prepend-icon="mdi-human" :counter="50" :error-messages="errors" label="Username" required></v-text-field>
                                    </ValidationProvider>
                                    <ValidationProvider v-slot="{ errors }" name="password" rules="required|">
                                        <v-text-field v-model="password" type="password" prepend-icon="mdi-key" :error-messages="errors" label="password" required @keyup.enter="submit(); load =true"></v-text-field>
                                    </ValidationProvider>
                                    <v-card-actions>
                                        <v-btn primary block @click="submit">Login</v-btn>
                                    </v-card-actions>
                                    <v-card-actions>
                                    <v-btn primary block @click="clear">clear</v-btn>
                                    </v-card-actions>
                                </v-form>
                            </ValidationObserver>
                        </v-card>
                    </v-container>
                </v-flex>
                <v-card height="300px"></v-card>
            </v-row>
        </v-layout>
    </v-container>
</div>
</template>

<style scoped>
    @import url("https://fonts.googleapis.com/css?family=Amatic+SC");
    @import url("https://fonts.googleapis.com/css?family=Aclonica");
    /* html, body {
        height: 100%;
    } */

    .full-height {
        height: 100%;
    }

    #bungkus{
        /* position: relative; */
        top: 15%;
        left: 0; 
        right:0;
    }

    #gambar{
        width: 100%;
        height: auto;
        opacity: 0.5;
        text-align: center;
    }

    #bekgron{
        width: 100%;
        height: 100%;
        opacity: 0.7;
        /* text-align: center; */
    }

    #tulisan {
        position: absolute;
        right: -32%;
        top: 25%;
        width: 100%;
        text-align: left;
        font-size: 30px;
        font-family: 'Amatic SC'
    }

    #titel {
        opacity: 0.8;
        font-family: 'Aclonica'
    }
</style> scoped>

<script>
import {
    required,
    email,
    max
} from 'vee-validate/dist/rules'
import {
    extend,
    ValidationObserver,
    ValidationProvider,
    setInteractionMode
} from 'vee-validate'

setInteractionMode('eager')

extend('required', {
    ...required,
    message: '{_field_} tidak boleh kosong',
})

extend('max', {
    ...max,
    message: '{_field_} tidak boleh lebih dari {length} karakter',
})

export default {
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data: () => ({
        username: '',
        password: '',
        load: false,
    }),

    methods: {
        async submit() {
            const isValid = await this.$refs.observer.validate();
                if (!isValid) {
                }else{
                    this.load = true
                    this.$http.post(this.$apiUrl + '/login', {
                        username: this.username,
                        password: this.password
                    }).then(response => {
                        if(response.data.status==='failed'){
                            this.$swal({
                                icon: 'error',
                                title: response.data.message,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.load = false;
                        }else{
                            localStorage.setItem('username', response.data.user);
                            localStorage.setItem('role', response.data.role);
                            this.$swal({
                                icon: 'success',
                                title: response.data.message,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.load = false;
                            this.clear();
                            var role = localStorage.getItem('role')
                            if(role=='OWNER'){
                                this.$router.push({
                                name: 'PegawaiController'
                                })
                            }else if(role=='CS'){
                                this.$router.push({
                                name: 'TlayananControllerCS'
                                })
                            }else{
                                this.$router.push({
                                name: 'TlayananControllerKASIR'
                                })
                            }
                        }
                    }).catch(error => {
                        console.log(error)
                        this.load = false
                    })
                }
        },
        clear() {
            this.username = ''
            this.password = ''
            this.$refs.observer.reset()
        },
    },
}
</script>
