<template>
    <div class="home container-fluid">
        <div class="row slide mb-3">
            <div class="col-8 mx-auto col-md-4 order-md-2">
                <img src="../assets/homeCall.png" alt="video call" class="img-fluid mb-3"/>
            </div>
            <div class="col-md-8 order-md-1 text-center text-md-left pr-md-5">
                <h4 class="mb-3">Aprende desde casa con clases particulares online</h4>
                <p class="lead mb-4">
                    Elige entre cientos de profesores y aprende, supera exámenes y mejora competencias, con clases
                    orientadas a tu objetivo.
                </p>
            </div>
        </div>
        <div class="row content-box p-3">
            <div class="col-6 col-md-3 mb-3">
                <div class="box p-3">
                    <h5>Flexibilidad</h5>
                    <p>Realiza las clases cómodamente desde casa, con adaptación de horarios</p>
                </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
                <div class="box p-3">
                    <h5>Profesores cualificados</h5>
                    <p>Avanza a tu ritmo con los mejores profesionales </p>
                </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
                <div class="box p-3">
                    <h4>Aula Virtual</h4>
                    <p>Con todo lo necesario para tus clases: videollamadas, pizarra, edición de documentos.</p>
                </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
                <div class="box p-3">
                    <h4>Ahorra</h4>
                    <p>Paga solo las clases que haces. Sin matrícula ni permanencia.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Home extends Vue {
        created() {
            this.$store.dispatch('authentication/logout');
        }
    }
</script>

<style scoped>
    .slide {
        padding: 1.5em;
        background-color: #f1ece4;
    }

    .box {
        border-radius: 15px;
        border: 1px solid black;
        height: 100%;
    }
</style>
