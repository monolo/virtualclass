import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Home from '../views/Home.vue'
import AppUser from "@/app/views/User/App.vue";
import HomeUser from "@/app/views/User/Home.vue";
import DocumentsUser from "@/app/views/User/Documents/Documents.vue";
import StudentRegister from "@/app/views/StudentRegister.vue";
import TeacherRegister from "@/app/views/TeacherRegister.vue";
import ChatsUser from "@/app/views/User/Chat/Chats.vue";
import NewChatUser from "@/app/views/User/Chat/New.vue";
import ShowChatUser from "@/app/views/User/Chat/Show.vue";
import ShowRoomUser from "@/app/views/User/Room/Show.vue";
import UsersRoomUser from "@/app/views/User/Room/Users.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/register/student',
        name: 'StudentRegister',
        component: StudentRegister
    },
    {
        path: '/register/teacher',
        name: 'TeacherRegister',
        component: TeacherRegister
    },
    {
        path: '/',
        name: 'AppUser',
        component: AppUser,
        children: [
            {
                path: '',
                name: 'HomeUser',
                component: HomeUser
            },
            {
                path: 'chat/chats',
                name: 'ChatsUser',
                component: ChatsUser
            },
            {
                path: 'chat/new',
                name: 'NewChatUser',
                component: NewChatUser
            },
            {
                path: 'chat/:id',
                name: 'ShowChatUser',
                component: ShowChatUser
            },
            {
                path: 'room/users',
                name: 'UsersRoomUser',
                component: UsersRoomUser
            },
            {
                path: 'room/:id',
                name: 'ShowRoomUser',
                component: ShowRoomUser
            },
            {
                path: 'documents',
                name: 'DocumentsUser',
                component: DocumentsUser
            }
        ],
        meta: {
            requiresAuth: true
        }
    },
    { path: '*', redirect: '/' }
    //Todo: 404
    //Todo: 403
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)){
        if(localStorage.getItem('user') == null) {
            next({
               path: '/home'
            });
        }
        else {
            //let uer = JSON.parse(localStorage.getItem('user'));
            //Todo: Role
            next();
        }
    }
    else next();
});

export default router
