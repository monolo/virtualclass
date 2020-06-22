<template>
    <div id="app">
        <Header></Header>
        <div v-if="alert.message" :class="`alert ${alert.type}`">
            {{alert.message}}
            <button type="button" class="close" @click="clearAlert">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <router-view/>
        <Footer></Footer>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import Header from "@/app/components/Header.vue";
    import Footer from "@/app/components/Footer.vue";

    @Component({
        components: {
            Header, Footer
        }
    })
    export default class App extends Vue {
        get alert() {
            return this.$store.state.alert;
        }

        clearAlert(){
            this.$store.dispatch('alert/clear')
        }

        @Watch('$route', { immediate: true, deep: true })
        onUrlChange() {
            this.$store.dispatch('alert/clear');
        }
    }
</script>

<style>

</style>
