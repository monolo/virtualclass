<template>
    <div>
        <Loading v-if="loading"></Loading>
        <div>
            <div style="display: inline-block; max-width: 50px;">
                <img src="../../../assets/user.jpeg" class="img-fluid" alt="user">
            </div>
            <div style="display: inline-block" class="ml-3">
                <h4 v-if="chat" class="mb-0">{{chat.title}}</h4>
            </div>
        </div>
        <div style="width: 100%; height: 450px; overflow-y: auto;" class="pt-4" id="chat">
            <div v-for="message in messagesSorted" :key="message.id" :class="{'sender': (message.sender === user.id)}" class="mt-1">
                <div class="messageBox">
                    <div>{{message.value}}</div>
                    <div>{{message.createdAt|dateFormat}}</div>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-10">
                <input v-model="text" type="text" class="form-control" style="width: 100%" @keyup.enter="sendMessage">
            </div>
            <div class="col-2">
                <a class="btn btn-success btn-block" @click="sendMessage">Enviar</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Loading from "@/app/components/Shared/Loading.vue";
    import AxiosChatRepository from "@/repositories/AxiosChatRepository";
    import {Chat, Message} from "../../../../interfaces/Chat";
    import AxiosUserRepository from "@/repositories/AxiosUserRepository";
    import {v4} from 'uuid';
    import WebSocket from '@/repositories/websocket/WebSocket';
    import {ISubscriberEmitter} from "@/interfaces/ISubscriberEmitter";

    @Component({
        components: {
            Loading
        }
    })
    export default class ShowChatUser extends Vue {
        loading = true;
        chat: Chat | null = null;
        messages: Array<Message> = [];
        text = '';
        subscriber: ISubscriberEmitter|null = null;

        get user(){
            return this.$store.state.authentication.user
        }

        async created() {
            await this.getChat();
            await this.getMessages();
            this.chatGoBottom();
            this.loading = false
            if(this.chat){
                this.subscriber = await WebSocket.subscriber(`/chat/${this.chat.id}`);
                this.subscriber.on('message', (data: any) => {
                    this.addMessage(data);
                    this.chatGoBottom();
                });
            }
        }

        get messagesSorted() {
            return this.messages.sort((message1: Message, message2: Message) => {
                return message1.createdAt.getTime() - message2.createdAt.getTime();
            })
        }

        async destroyed() {
            if(this.subscriber) await WebSocket.unsubscriber(this.subscriber);
        }

        async getChat() {
            try {
                const chat = await AxiosChatRepository.chat(this.$route.params.id);
                const userId = (chat.users[0] == this.$store.state.authentication.user.id) ? chat.users[1] : chat.users[0];
                const user = await AxiosUserRepository.user(userId);
                chat.title = `${user.name} ${user.surname}`;
                this.chat = chat;

            } catch (e) {
                await this.$store.dispatch('alert/error', e);
            }
        }

        async getMessages() {
            if(this.chat) {
                try {
                    const {messages} = await AxiosChatRepository.getMessagesBy(this.chat.id);
                    this.messages.splice(0, this.messages.length);
                    messages.forEach(message => this.addMessage(message));
                }
                catch (e) {
                    await this.$store.dispatch('alert/error', `No se han podido cargar los mensajes`);
                }
            }
        }

        addMessage(data: any) {
            const message = data;
            const index = this.messages.findIndex(_message => _message.id == message.id);
            if(index !== -1){
                this.messages[index] = {
                    id: message.id,
                    chatId: message.chatId,
                    type: message.type,
                    value: message.value,
                    createdAt: (typeof message.createdAt === "string") ? new Date(message.createdAt): message.createdAt,
                    sender: message.sender
                }
            }
            else this.messages.push({
                id: message.id,
                chatId: message.chatId,
                type: message.type,
                value: message.value,
                createdAt: (typeof message.createdAt === "string") ? new Date(message.createdAt): message.createdAt,
                sender: message.sender
            });
        }

        chatGoBottom() {
            Vue.nextTick().then(() => {
                const chatElement = document.getElementById('chat');
                if(chatElement && chatElement.lastElementChild && chatElement.lastElementChild instanceof HTMLElement){
                    chatElement.scrollTop = chatElement.lastElementChild.offsetTop;
                }
            });
        }

        async sendMessage() {
            if (this.chat && this.text) {
                const message = {
                    id: v4(),
                    chatId: this.chat.id,
                    type: 'text',
                    value: this.text,
                    createdAt: new Date(),
                    sender: this.$store.state.authentication.user.id
                };
                this.addMessage(message);
                this.text = "";
                if (this.messages.length > 150) this.messages.shift();

                this.chatGoBottom();

                try {
                    await AxiosChatRepository.sendMessage(message.id, message.chatId, message.type, message.value);
                }
                catch (e) {
                    await this.$store.dispatch('alert/error', `El mensaje ${message.value} no se ha podido enviar`);
                    const index = this.messages.findIndex((_message) => _message.id == message.id);
                    this.messages.splice(index, 1);
                }
            }
        }
    }
</script>

<style scoped>
    .messageBox {
        border: 1px solid black;
        border-radius: 15px;
        padding: 5px;
        display: inline-block;
    }
    .sender {
        text-align: right;
    }
    .sender .messageBox{
        background: #4cbb4c;
    }
</style>
