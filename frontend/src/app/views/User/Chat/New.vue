<template>
    <div class="">
        <Loading v-if="loading"></Loading>
        <Table :fields="usersTable.fields" :items="usersTable.items" @table:row-clicked="onUserClicked">
            <template slot="image">
                test
            </template>
        </Table>
        <Pagination v-if="users.length > 0" :total="total" :limit="limit" @page-changed="onChangePage"></Pagination>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Table, {Props} from "@/app/components/Shared/Table.vue";
    import Loading from "@/app/components/Shared/Loading.vue";
    import Pagination from "@/app/components/Shared/Pagination.vue";
    import {User} from "../../../../interfaces/User";
    import AxiosUserRepository from "@/repositories/AxiosUserRepository";
    import AxiosChatRepository from "@/repositories/AxiosChatRepository";
    import { v4 } from 'uuid';

    @Component({
        components: {
            Pagination,
            Table,
            Loading
        }
    })
    export default class NewChatUser extends Vue {
        loading = false;
        limit = 8;
        total = 0;
        users: Array<User> = [];
        offset = 0;
        usersTable: Props = {
            fields: [
                {
                    name: '__slot:image',
                    title: '',
                    visible: false
                },
                {
                    name: 'name',
                    title: 'Nombre'
                },
                {
                    name: 'surname',
                    title: 'Apellido'
                }
            ],
            items: this.users
        }

        created() {
            this.syncUsers();
        }

        async syncUsers() {
            try {
                const {users, total} = await AxiosUserRepository.getUsersLessMeBy(this.offset, this.limit);
                this.users.splice(0, this.users.length);
                users.forEach(user => this.users.push(user));
                this.total = total;
            } catch (e) {
                await this.$store.dispatch('alert/error', e);
            }
        }

        onChangePage(page: number) {
            this.offset = (page - 1) * this.limit;
            this.syncUsers();
        }

        async onUserClicked(user: User) {
            this.loading = true;
            try {
                const id = v4();
                await AxiosChatRepository.createChat(id, user.id);
                await this.$router.push(`/chat/${id}`);
            }
            catch (e) {
                if(e.chatId){
                    await this.$router.push(`/chat/${e.chatId}`);
                }
                else await this.$store.dispatch('alert/error', e)
            }
            finally {
                this.loading = false;
            }
        }
    }
</script>

<style scoped>
    table tr .btn-light {
        border: 1px solid #939393;
    }
</style>
