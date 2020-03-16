<template>
<v-container>
    <v-layout row class="text-xs-center"> 
        <v-card height="500px"></v-card>
        <v-flex xs4 class="grey lighten-4">
            <v-container style="position: relative;top: 15%;" class="text-xs-center">
                <v-card flat>
                    <v-card-title primary-title>
                        <h4>Login</h4>
                    </v-card-title>
                    <ValidationObserver ref="observer" v-slot="{ validate, reset }">
                        <v-form class="my-2">
                            <ValidationProvider v-slot="{ errors }" name="username" rules="required|max:10">
                                <v-text-field v-model="username" prepend-icon="mdi-human" :counter="10" :error-messages="errors" label="Username" required></v-text-field>
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
                    <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
                    {{ text }}
                    <v-btn dark text @click="snackbar = false">
                        Close
                    </v-btn>
                    </v-snackbar>
                </v-card>
            </v-container>
        </v-flex>
    </v-layout>
</v-container>
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
        color: '',
        snackbar: false,
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
                            this.snackbar = true;
                            this.color = 'red';
                            this.text = response.data.message;
                            this.load = false;
                        }else{
                            localStorage.setItem('username', response.data.user)
                            console.log(response.data)
                            this.snackbar = true;
                            this.color = 'green';
                            this.text = response.data.message;
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
            this.name = ''
            this.email = ''
            this.select = null
            this.checkbox = null
            this.$refs.observer.reset()
        },
    },
}
</script>
