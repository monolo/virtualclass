<template>
    <div>
        <Loading v-if="loading"></Loading>
        <div class="row">
            <div class="col-12" :class="{'col-sm-9': chatShow}">
                <div style="position: relative; width: 100%; height: 500px;">
                    <vue-webrtc ref="webrtc" width="100%"
                                :roomId="id"
                    />
                </div>
                <div class="text-center mt-4">
                        <router-link class="mr-4" to="/room/users"><img src="../../../assets/colgar.png" style="width: 80px; height: 80px;" /></router-link>
                        <img  class="mr-4" src="../../../assets/chat.png" style="width: 80px; height: 80px;" @click="chatShow=true" />
                        <img src="../../../assets/draw.png" style="width: 80px; height: 80px;" />
                </div>
            </div>
            <div class="col-sm-3" v-show="chatShow">
                <div>
                    <div style="display: inline-block; max-width: 50px;">
                        <img src="../../../assets/chat.png" class="img-fluid" alt="user">
                    </div>
                    <div style="display: inline-block" class="ml-3">
                        <h4 class="mb-0">Chat</h4>
                    </div>
                    <div style="display: inline-block;" class="float-right" @click="chatShow=false">
                        x
                    </div>
                </div>
                <div style="width: 100%; height: 450px; overflow-y: auto;" class="pt-4" id="chat">
                    <div v-for="message in messagesSorted" :key="message.id"
                         :class="{'sender': (message.sender === user.id)}" class="mt-1">
                        <div class="messageBox">
                            <div>{{message.value}}</div>
                            <div>{{message.createdAt|dateFormat}}</div>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-12">
                        <input v-model="text" type="text" class="form-control" style="width: 100%"
                               @keyup.enter="sendMessage">
                    </div>
                    <div class="col-12">
                        <a class="btn btn-success btn-block" @click="sendMessage">Enviar</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Loading from "@/app/components/Shared/Loading.vue";
    import {Message} from "../../../../interfaces/Chat";
    import {v4} from 'uuid';
    import WebSocket from '@/repositories/websocket/WebSocket';
    import {ISubscriberEmitter} from "@/interfaces/ISubscriberEmitter";
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    import WebRTC from 'vue-webrtc';
    import io from 'socket.io-client'

    window.io = io;

    Vue.use(WebRTC);

    @Component({
        components: {
            Loading
        }
    })
    export default class ShowRoomUser extends Vue {
        loading = false;
        messages: Array<any> = [];
        text = '';
        subscriber: ISubscriberEmitter | null = null;
        chatShow=false
        draw=false;

        mounted() {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            this.$refs.webrtc.join();
        }

        get user() {
            return this.$store.state.authentication.user
        }

        get id() {
            return this.$route.params.id;
        }

        async created() {
            this.chatGoBottom();
            this.subscriber = await WebSocket.subscriber(`/room/${this.$route.params.id}`);
            this.subscriber.on('message', (data: any) => {
                this.addMessage(data);
                this.chatGoBottom();
            });
            /*this.subscriber.on('connected', () => {
               if(this.user.id == this.$route.params.id) WebSocket.socket.emit('init room', {
                   id: this.user.id
               });
            });*/
        }

        get messagesSorted() {
            return this.messages.sort((message1: Message, message2: Message) => {
                return message1.createdAt.getTime() - message2.createdAt.getTime();
            })
        }

        async destroyed() {
            if (this.subscriber) await WebSocket.unsubscriber(this.subscriber);
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            this.$refs.webrtc.leave();
        }

        addMessage(data: any) {
            const message = data;
            const index = this.messages.findIndex(_message => _message.id == message.id);
            if (index !== -1) {
                this.messages[index] = {
                    id: message.id,
                    type: message.type,
                    value: message.value,
                    createdAt: (typeof message.createdAt === "string") ? new Date(message.createdAt) : message.createdAt,
                    sender: message.sender
                }
            } else this.messages.push({
                id: message.id,
                type: message.type,
                value: message.value,
                createdAt: (typeof message.createdAt === "string") ? new Date(message.createdAt) : message.createdAt,
                sender: message.sender
            });
        }

        chatGoBottom() {
            Vue.nextTick().then(() => {
                const chatElement = document.getElementById('chat');
                if (chatElement && chatElement.lastElementChild && chatElement.lastElementChild instanceof HTMLElement) {
                    chatElement.scrollTop = chatElement.lastElementChild.offsetTop;
                }
            });
        }

        async sendMessage() {
            const message = {
                id: v4(),
                type: 'text',
                value: this.text,
                createdAt: new Date(),
                sender: this.user.id
            };
            this.addMessage(message);
            this.text = "";
            if (this.messages.length > 150) this.messages.shift();

            this.chatGoBottom();

            WebSocket.socket.emit('emit room', {
                room: `/room/${this.$route.params.id}`,
                event: 'message',
                data: message
            });
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

    .sender .messageBox {
        background: #4cbb4c;
    }
    /deep/ .video-list .video-item:first-child{
        position: absolute;
        right: 5%;
        top: 5%;
        z-index: 99;
    }

    /deep/ .video-list .video-item:first-child video{
        z-index: 99;
    }

    /deep/ .video-list .video-item:nth-child(2){
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    /deep/ .video-list .video-item:nth-child(2) video{
        width: 100%;
        height: 100%;
    }

    /deep/ .video-item{
        background: none;
    }
</style>
