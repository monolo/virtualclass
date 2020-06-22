<template>
    <div class="container-fluid">
        <h2 class="text-center">Registro profesor</h2>
        <hr>
        <form @submit.prevent="submitRegister">
            <div class="form-group row">
                <label class="col-md-4 col-form-label text-md-right">Nombre</label>
                <div class="col-md-6">
                    <input type="text" v-model="name" class="form-control"
                           :class="{ 'is-invalid': submitted && !name }">
                </div>
            </div>

            <div class="form-group row">
                <label class="col-md-4 col-form-label text-md-right">Apellidos</label>
                <div class="col-md-6">
                    <input type="text" v-model="surname" class="form-control"
                           :class="{ 'is-invalid': submitted && !surname }">
                </div>
            </div>

            <div class="form-group row">
                <label class="col-md-4 col-form-label text-md-right">Correo electronico</label>
                <div class="col-md-6">
                    <input type="email" v-model="email" class="form-control"
                           :class="{ 'is-invalid': submitted && !email }">
                </div>
            </div>

            <div class="form-group row">
                <label class="col-md-4 col-form-label text-md-right">Descripción corta</label>
                <div class="col-md-6">
                    <textarea v-model="shortDescription" class="form-control"
                              :class="{ 'is-invalid': (submitted && !shortDescription) || shortDescription.length > 80 }">
                    </textarea>
                    <div class="textCounter" :class="{'redCounter': (shortDescription.length > 80)}">
                        {{shortDescription.length}}/80
                    </div>
                </div>
            </div>

            <div class="form-group row">
                <label class="col-md-4 col-form-label text-md-right">Descripción larga</label>
                <div class="col-md-6">
                    <textarea v-model="fullDescription" class="form-control" rows="5"
                              :class="{ 'is-invalid': (submitted && !fullDescription) || fullDescription.length > 500 }">
                    </textarea>
                    <div class="textCounter" :class="{'redCounter': (fullDescription.length > 500)}">
                        {{fullDescription.length}}/500
                    </div>
                </div>
            </div>

            <div class="form-group row">
                <label class="col-md-4 col-form-label text-md-right">Contraseña</label>
                <div class="col-md-6">
                    <input type="password" v-model="password" class="form-control"
                           :class="{ 'is-invalid': submitted && !password }">
                </div>
            </div>

            <div class="form-group row">
                <label class="col-md-4 col-form-label text-md-right">Repetir contraseña</label>
                <div class="col-md-6">
                    <input type="password" v-model="passwordSecond" class="form-control"
                           :class="{ 'is-invalid': (submitted && !passwordSecond) || (password && password !== passwordSecond) }">
                </div>
            </div>

            <div class="col-md-6 offset-md-4">
                <button type="submit" class="btn btn-primary">
                    Registar
                </button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import AxiosUserRepository from "@/repositories/AxiosUserRepository";
    import { v4 } from 'uuid';

    @Component
    export default class TeacherRegister extends Vue {
        name = "";
        surname = "";
        email = "";
        shortDescription = "";
        fullDescription = "";
        password = "";
        passwordSecond = "";
        submitted = false;

        async submitRegister() {
            this.submitted = true;
            const {name, surname, email, password, passwordSecond, shortDescription, fullDescription} = this;
            if (name && surname && email && password && passwordSecond &&
                password == passwordSecond && shortDescription && fullDescription &&
                shortDescription.length <= 80 && fullDescription.length <= 500
            ) {
                try {
                    await AxiosUserRepository.registerTeacher(v4(), name, surname, email, shortDescription, fullDescription, password);
                    await this.$store.dispatch('alert/success', 'Registrado correctamente');
                } catch (e) {
                    await this.$store.dispatch('alert/error', e);
                }
            }
        }
    }
</script>

<style scoped>
    .textCounter {
        font-size: 13px;
        text-align: right;
    }

    .redCounter {
        color: red;
    }
</style>
