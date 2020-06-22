<template>
    <div class="">
        <Table :fields="chatsTable.fields" :items="chatsTable.items" @table:row-clicked="onChatClicked">
            <template slot="image">
                <img src="../../../assets/user.jpeg" class="img-fluid" alt="user" style="min-width: 50px;">
            </template>
            <template slot="message" scope="props">
                <div class="d-flex flex-row">
                    <div>
                        <h5>{{props.rowData.title}}</h5>
                    </div>
                    <div class="ml-auto">
                        <div v-if="props.rowData.lastMessage">props.rowData.lastMessage.createdAt</div>
                    </div>
                </div>
                <div v-if="props.rowData.lastMessage" class="d-flex flex-row">
                    <div>
                        {{props.rowData.lastMessage.value}}
                    </div>
                    <div class="ml-auto">
                        <div v-if="props.rowData.unreadMessages > 0">{{props.rowData.unreadMessages}}</div>
                    </div>
                </div>
            </template>
        </Table>
        <Pagination v-if="chats.length > 0" :total="total" :limit="limit" @page-changed="onChangePage"></Pagination>
        <div class="text-center">
            <router-link to="/chat/new" class="btn btn-success btn-block">Nuevo chat</router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Table, {Props} from "@/app/components/Shared/Table.vue";
    import Pagination from "@/app/components/Shared/Pagination.vue";
    import {Chat} from "@/interfaces/Chat";
    import AxiosChatRepository from "@/repositories/AxiosChatRepository";
    import AxiosUserRepository from "@/repositories/AxiosUserRepository";

    @Component({
        components: {
            Pagination,
            Table
        }
    })
    export default class ChatsUser extends Vue {
        limit = 8;
        total = 0;
        chats: Array<Chat> = [];
        offset = 0;
        chatsTable: Props = {
            fields: [
                {
                    name: '__slot:image',
                    title: '',
                    visible: false
                },
                {
                    name: '__slot:message',
                    title: 'Nombre',
                    width: '100%',
                    visible: false
                }
            ],
            items: this.chats
        }

        created() {
            this.syncChats();
        }

        async syncChats() {
            try {
                const {chats, total} = await AxiosChatRepository.getBy(this.offset, this.limit);
                for (const chat of chats) {
                    const userId = (chat.users[0] == this.$store.state.authentication.user.id) ? chat.users[1] : chat.users[0];
                    const user = await AxiosUserRepository.user(userId);
                    chat.title = `${user.name} ${user.surname}`;
                }
                this.chats.splice(0, this.chats.length);
                chats.forEach(chat => this.chats.push(chat));
                this.total = total;
            } catch (e) {
                await this.$store.dispatch('alert/error', e);
            }
        }

        onChangePage(page: number) {
            this.offset = (page - 1) * this.limit;
            this.syncChats();
        }

        onChatClicked(chat: Chat){
            this.$router.push(`/chat/${chat.id}`);
        }
    }
</script>

<style scoped>
    /deep/ table tr{
        cursor: pointer;
    }
    /deep/ table tr td{
        vertical-align: middle;
    }
</style>
