<template>
    <footer class="footer text-muted">
        <div class="container-fluid p-3 p-md-5">
            <ul class="footer-links">
                <li><a href="">Sobre nosotros</a></li>
                <li><router-link to="/register/student">Registro como estudiante</router-link></li>
                <li><router-link to="/register/teacher">Registro como profesor</router-link></li>
                <li><a href="">Política de privacidad</a></li>
                <li><a href="">Términos y condiciones</a></li>
            </ul>
        </div>
    </footer>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class Footer extends Vue {

    }
</script>

<style scoped>
    .footer-links {
        padding-left: 0;
        margin-bottom: 1rem;
    }
    .footer-links li {
        display: inline-block;
    }
    .footer-links li+li {
        margin-left: 1rem;
    }
    .footer-links li a {
        font-weight: 600;
        color: #495057;
    }
</style>
