<template>
    <nav class="links"  aria-label="Main navigation" style="">
        <ul class="nav flex-column sidenav">
            <li class="nav-item" v-for="menu in menus" :key="menu.route">
                <router-link :to="menu.route" :class="{active: menuIsActive(menu)}">{{ menu.name }}</router-link>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    interface Menu {
        name: string;
        route: string;
    }

    @Component
    export default class MenuUser extends Vue {
        get user(){
            return this.$store.state.authentication.user
        }

        get menus(): Menu[]{
            const menus = [
                {
                    name: 'Videoclase',
                    route: '/room/users'
                },
                {
                    name: 'Chat',
                    route: '/chat/chats'
                },
                {
                    name: 'Documentos',
                    route: '/user/documents'
                }
            ]
            if(this.user.roles.includes('STUDENT')){
                menus.push({
                    name: 'Profesores',
                    route: '/user/teachers'
                });
            }
            if(this.user.roles.includes('TEACHER')){
                menus.push({
                    name: 'Alumnos',
                    route: '/users/students'
                });
            }
            return menus;
        }

        menuIsActive(menu: Menu){
            return this.$route.path == menu.route;
        }
    }
</script>

<style scoped>
    /*@media(min-width: 768px){
        .links {
            display: block !important;
        }
    }*/
    .links li>a{
        display: block;
        margin-bottom: 5px;
        text-align: center;
        text-decoration: none;
        color: black;
        border-radius: 10px;
        border: 1px solid #848888;
        padding: 10px 15px;
        background-color: #d0e0e3;
    }
    .links li>a:hover, .links li >a.active{
        background-color: #f39901;
    }
    .sidenav {

    }
</style>
