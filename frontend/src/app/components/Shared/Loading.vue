<template>
    <div class="loading">
        <img src="../../assets/oval.svg" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class Loading extends Vue {

    }
</script>

<style scoped>
    .loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(58, 58, 58, 0.4);
    }
    .loading img{
        width: 20%;
        height: 20%;
        margin-left: 40vw;
        margin-top: 40vh;
    }
</style>
