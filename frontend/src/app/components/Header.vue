<template>
    <header class="navbar navbar-expand-lg navbar-light bg-light flex-column flex-md-row">
        <div class="">
            <a class="navbar-brand mr-0 mr-md-2" href="/" aria-label="VirtualClass">
                <img src="../assets/logo.png" style="height: 38px;"/>
            </a>
        </div>
        <div class="flex-row ml-md-auto">
            <div v-if="!user">
                <form @submit.prevent="loginSubmit" class="form-inline">
                    <input type="text" v-model="email" class="form-control mb-2 mr-sm-2"
                           placeholder="Correo electrónico"
                           :class="{ 'is-invalid': submitted && !email }">
                    <input type="password" v-model="password" class="form-control mb-2 mr-sm-2"
                           placeholder="contraseña" :class="{ 'is-invalid': submitted && !password }">
                    <input :disabled="loggingIn" type="submit" class="btn btn-success mb-2 mr-sm-2"
                           value="Iniciar sesión">
                </form>
            </div>
            <div v-else="">
                <router-link to="/home" class="btn btn-success mb-2 mr-sm-2">Cerrar sesión</router-link>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Header extends Vue {
        private email = "";
        private password = "";
        private submitted = false;

        get loggingIn() {
            return this.$store.state.authentication.status.loggingIn;
        }

        get user(): object | null {
            return this.$store.state.authentication.user;
        }

        public loginSubmit() {
            this.submitted = true;
            const {email, password} = this;
            if (email && password) {
                this.$store.dispatch('authentication/login', {email, password});
            }
        }
    }
</script>

<style scoped>

</style>
