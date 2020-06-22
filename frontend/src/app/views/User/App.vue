<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3 col-xl-2 p-4">
                <img src="../../assets/user.jpeg" class="img-fluid mb-4" alt="user">
                <h4 class="name text-center mb-4">{{user.name}} {{user.surname}}</h4>
                <MenuUser></MenuUser>
            </div>
            <main class="col-md-9 col-xl-10 content p-4" style="background: rgb(241, 241, 241);">
                <router-view/>
            </main>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import MenuUser from "@/app/components/User/Menu.vue";

    @Component({
        components: {
            MenuUser
        }
    })
    export default class AppUser extends Vue {
        get user() {
            return this.$store.state.authentication.user
        }
    }
</script>

<style scoped>
    .name {
        color: #595959;
        font-weight: normal;
    }
</style>
