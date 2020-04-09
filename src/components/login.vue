<template>
<div class="grey lighten-1">
    <v-container>
        <v-layout row class="text-xs-center"> 
            <v-row>
                <v-card height="500px"></v-card>
                <v-flex md4 align="center" justify="center" style="backgroundColor:#4E5862;">
                    <v-container style="position: relative;top: 15%;left: 0; right:0" class="text-xs-center">
                        <v-card class="pl-4 pr-4 pb-1" flat>
                            <v-card-title primary-title>
                                <h4>Login</h4>
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
            </v-row>
        </v-layout>
    </v-container>
</div>
</template>

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
                            this.$router.push({
                                name: 'PegawaiController'
                            })
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
